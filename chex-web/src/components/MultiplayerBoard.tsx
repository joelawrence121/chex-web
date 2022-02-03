import React, {useEffect, useState} from 'react';
import '../styles/MultiplayerBoard.css';
import MainBoard from "./MainBoard";
import Utils from "../service/Utils";
import {Chess} from "chess.ts";
import ChapiService from "../service/ChapiService";
import GameData, {Message} from "../types/MultiplayerTypes";
import whitePawn from "./icons/white-pawn.png";
import blackPawn from "./icons/black-pawn.png";
import MultiplayerChat from "./MultiplayerChat";
import BoardHighlight from "../types/BoardHighlight";
import Collapsible from "react-collapsible";
import AdvantageGraph from "./AdvantageGraph";
import MultiplayerMenu, {MenuState} from "./MultiplayerMenu";

const MultiplayerBoard: React.FC = () => {

    const POLL_INTERVAL = 500
    const IN_PROGRESS = "IN PROGRESS";
    const WAITING = "WAITING";

    const [fen, setFen] = useState(Utils.INITIAL_FEN)
    const [fenStack, setFenStack] = useState<string[]>([Utils.INITIAL_FEN])
    const [moveStack, setMoveStack] = useState<string[]>([])
    const [scoreStack, setScoreStack] = useState<number[]>([])
    const [gameStatus, setGameStatus] = useState("No game created.")
    const [inputPlayerName, setInputPlayerName] = useState('')
    const [inputGameId, setInputGameId] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [gameData, setGameData] = useState<GameData>()
    const [newMessages, setNewMessages] = useState<Message[]>([])
    const [menuState, setMenuState] = useState<MenuState>(MenuState.START)
    const [errorMessage, setErrorMessage] = useState<string>()
    const [move, setMove] = useState<string>()
    const [winner, setWinner] = useState<string>()
    const [turnTime, setTurnTime] = useState<number>(600)

    function setNewGameData(gameDataResponse: GameData) {
        setGameData(gameDataResponse);
        setGameStatus(gameDataResponse.state)
        if ((gameDataResponse.state === WAITING || gameDataResponse.state === IN_PROGRESS) && gameData) {
            setNewMessages(gameDataResponse.messages.filter(x => gameData.messages.includes(x)))
        } else if (gameDataResponse.message) {
            setMenuState(MenuState.ERROR)
            setGameData(undefined)
            setErrorMessage(gameDataResponse.message)
        }
    }

    // multiplayer menu hook
    useEffect(() => {
        console.log(menuState.valueOf())
        if (menuState === MenuState.CREATE) {
            ChapiService.createNewMultiplayerGame({
                player_name: inputPlayerName
            })
                .then(response => {
                    let gameDataResponse = response.data as unknown as GameData
                    setPlayerName(gameDataResponse.player_one)
                    setNewGameData(gameDataResponse)
                    setMenuState(MenuState.PLAYING)
                })
                .catch(e => {
                    console.log(e)
                })
        }
        if (menuState === MenuState.JOIN) {
            ChapiService.joinMultiplayerGame({
                player_name: inputPlayerName,
                game_id: inputGameId
            })
                .then(response => {
                    let gameDataResponse = response.data as unknown as GameData
                    setPlayerName(gameDataResponse.player_two)
                    setNewGameData(gameDataResponse)
                    setMenuState(MenuState.PLAYING)
                })
                .catch(e => {
                    console.log(e)
                })
        }
        if (menuState === MenuState.DRAW_OFFERED) {
            ChapiService.offerMultiplayerDraw({
                player_name: inputPlayerName,
                game_id: gameData!.game_id
            })
                .then(response => {
                    let gameDataResponse = response.data as unknown as GameData
                    setNewGameData(gameDataResponse)
                })
                .catch(e => {
                    console.log(e)
                })
        }
        if (menuState === MenuState.DRAW_ACCEPTED || menuState === MenuState.DRAW_REJECTED) {
            ChapiService.answerMultiplayerDraw({
                draw_accepted: menuState === MenuState.DRAW_ACCEPTED,
                game_id: gameData!.game_id
            })
                .then(response => {
                    let gameDataResponse = response.data as unknown as GameData
                    setNewGameData(gameDataResponse)
                })
                .catch(e => {
                    console.log(e)
                })
            if (menuState == MenuState.DRAW_REJECTED) setMenuState(MenuState.RESET_DRAW)
        }
        if (menuState === MenuState.RESET_DRAW) {
            ChapiService.resetMultiplayerDraw({
                draw_accepted: false,
                game_id: gameData!.game_id
            })
                .then(response => {
                    let gameDataResponse = response.data as unknown as GameData
                    setNewGameData(gameDataResponse)
                })
                .catch(e => {
                    console.log(e)
                })
            setMenuState(MenuState.PLAYING)
        }
        if (menuState === MenuState.RETIRE) {
            ChapiService.retireFromMultiplayer({
                game_id: gameData!.game_id,
                player_name: playerName
            })
                .then(response => {
                    let gameDataResponse = response.data as unknown as GameData
                    setNewGameData(gameDataResponse)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [menuState, inputGameId, inputPlayerName])

    // turn time hook
    useEffect(() => {
        const interval = setInterval(() => {
            if (gameData) {
                let chess = new Chess(gameData?.fen)
                if ((chess.turn() === 'w' && playerName === gameData?.player_one) || (chess.turn() === 'b' && playerName === gameData?.player_two)) {
                    console.log("deducing: " + turnTime)
                    setTurnTime(turnTime - 1)
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [turnTime]);

    // polling and clock hook
    useEffect(() => {
        const interval = setInterval(() => {
            if (gameData) {
                console.log("polling")
                ChapiService.pollMultiplayerGame({
                    player_name: playerName,
                    game_id: gameData?.game_id
                })
                    .then(response => {
                        let gameDataResponse = response.data as unknown as GameData
                        console.log(gameDataResponse)
                        setGameData(gameDataResponse);
                        setGameStatus(gameDataResponse.state)
                        setNewMessages(gameDataResponse.messages)
                        if (gameDataResponse.fen !== fen) {
                            setFen(gameDataResponse.fen)
                            let newFenStack = gameDataResponse.fen_stack.slice()
                            setFenStack(newFenStack)
                            let newMoveStack = gameDataResponse.move_stack.slice()
                            setMoveStack(newMoveStack)
                            let newScoreStack = gameDataResponse.score_stack.slice()
                            setScoreStack(transformScoreStack(newScoreStack))
                        }
                        if (gameDataResponse.winner && menuState !== MenuState.FINISHED) setWinner(gameDataResponse.winner)
                        if (menuState === MenuState.PLAYING && gameDataResponse.draw_offered) setMenuState(MenuState.DRAW_RECEIVED)
                        if (menuState === MenuState.DRAW_OFFERED && gameDataResponse.draw_response == 'ACCEPTED') {
                            setMenuState(MenuState.FINISHED)
                            setWinner('stale')
                        }
                        if (menuState == MenuState.DRAW_OFFERED && !gameDataResponse.draw_offered) setMenuState(MenuState.PLAYING)
                        if (menuState === MenuState.DRAW_OFFERED && gameDataResponse.draw_response == 'REJECTED') setMenuState(MenuState.PLAYING)
                        if (gameDataResponse.retired) {
                            setMenuState(MenuState.FINISHED)
                            setWinner(playerName === gameData!.player_one ? Utils.WHITE : Utils.BLACK)
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })
                // turn timing
                if (isPlayersTurn() && gameStatus === IN_PROGRESS) {
                    if (turnTime > 0) setTurnTime(turnTime - 1)
                    else setOtherPlayerWinner()
                }
            }
        }, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [gameData]);

    function transformScoreStack(newScoreStack: number[]) {
        if (gameData && playerName === gameData.player_two) {
            return newScoreStack.map(function (score) {
                return score * -1
            })
        }
        return newScoreStack
    }

    // push new move
    useEffect(() => {
        if (move && gameData) {
            ChapiService.playMultiplayerMove({
                game_id: gameData?.game_id,
                move: move
            })
                .then(response => {
                    console.log(response)
                    let gameDataResponse = response.data as unknown as GameData
                    setGameData(gameDataResponse);
                    setGameStatus(gameDataResponse.state)
                    setFen(gameDataResponse.fen)
                    if (gameData) {
                        setNewMessages(gameDataResponse.messages.filter(x => gameData.messages.includes(x)))
                        let newMoveStack = gameDataResponse.move_stack.slice()
                        setMoveStack(newMoveStack)
                        let newFenStack = gameDataResponse.fen_stack.slice()
                        setFenStack(newFenStack)
                        let newScoreStack = gameDataResponse.score_stack.slice()
                        setScoreStack(transformScoreStack(newScoreStack))
                    }
                    if (gameDataResponse.winner) setWinner(gameDataResponse.winner)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [move])

    function getBoardOrientation() {
        if (!gameData || !playerName) {
            return "WHITE"
        }
        if (playerName === gameData.player_one) {
            return "WHITE"
        }
        return "BLACK"
    }

    function getToMove() {
        let chess = new Chess(gameData?.fen)
        return (chess.turn() === 'w' ? whitePawn : blackPawn)
    }

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        if (gameStatus !== IN_PROGRESS) return false
        let chess = new Chess(fen)
        let move = chess.move({
            to: targetSquare,
            from: sourceSquare,
        })
        if (move == null) return false;
        setMove(move.from + move.to)
        setFen(chess.fen())
        return true
    }

    function isPlayersTurn() {
        let chess = new Chess(gameData?.fen)
        return (chess.turn() === 'w' && playerName === gameData?.player_one) || (chess.turn() === 'b' && playerName === gameData?.player_two)
    }

    function getGameStatus(gameStatus: string) {
        let chess = new Chess(gameData?.fen)
        if (chess.inCheckmate()) return <h1 style={{textAlign: "center"}}>Checkmate</h1>
        if (gameData && gameStatus == IN_PROGRESS) {
            return isPlayersTurn() ? <h1 style={{textAlign: "center"}}>{"Your turn " + getTimer(turnTime)}</h1>
                : <h1 style={{textAlign: "center"}}>{"Waiting"}</h1>
        }
        return <h1 style={{textAlign: "center"}}>{gameStatus}</h1>
    }

    function getTimer(turnTime: number) {
        if (gameStatus !== IN_PROGRESS) return <></>
        let seconds = String("0" + Math.ceil((turnTime % 120) / 2)).slice(-2)
        seconds = seconds === "60" ? "00" : seconds
        return Math.floor(turnTime / 120).toString() + ":" + seconds
    }

    function getOtherPlayer() {
        if (gameData) {
            if (playerName === gameData.player_one) return gameData.player_two
            return gameData.player_one
        }
        return ''
    }

    function setOtherPlayerWinner() {
        if (gameData) {
            if (playerName === gameData.player_one) setWinner(Utils.BLACK)
            else setWinner(Utils.BLACK)
        }
    }

    function getGameDescription() {
        if (gameData && menuState !== MenuState.ERROR) {
            return <>
                <h2 className="game">Player: {playerName}</h2>
                <h2 className="game">Game Id: {gameData.game_id}</h2>
            </>
        }
    }

    function getBoardHighlight(winner: string | undefined) {
        if (!winner) {
            return BoardHighlight.normal();
        }
        if (winner === getBoardOrientation().toLowerCase()) {
            return BoardHighlight.userWinner();
        }
        if (winner === 'stale') {
            return BoardHighlight.stalemate()
        }
        return BoardHighlight.stockfishWinner();
    }

    function handleRetirement() {
        setMenuState(MenuState.RETIRE)
        setOtherPlayerWinner()
    }

    function handleDrawAccepted() {
        setMenuState(MenuState.DRAW_ACCEPTED)
        setGameStatus('Draw')
        setWinner('stale')
    }

    function handleDrawRejected() {
        setMenuState(MenuState.DRAW_REJECTED)
    }

    return (
        <section className="multiplayer-animated-grid">
            <div className="multiplayer-card no-background n">{getGameDescription()}</div>
            <div className="multiplayer-card no-background time"></div>
            <div className="multiplayer-card no-background join">
                <MultiplayerMenu menuState={menuState} setMenuState={setMenuState} inputGameId={inputGameId}
                                 inputPlayerName={inputPlayerName} setInputGameId={setInputGameId}
                                 setInputPlayerName={setInputPlayerName} errorMessage={errorMessage}
                                 handleRetirement={handleRetirement} handleDrawAccepted={handleDrawAccepted}
                                 otherPlayer={getOtherPlayer()} handleDrawRejected={handleDrawRejected}/>
            </div>
            <div className="multiplayer-card no-background chat">
                {gameData ? <MultiplayerChat
                    messages={newMessages}
                    player={playerName}
                    gameId={gameData?.game_id}
                    otherPlayer={getOtherPlayer()}
                /> : <></>}
            </div>
            <div className="multiplayer-main">
                <MainBoard
                    position={fen}
                    boardOrientation={getBoardOrientation()}
                    onPieceDrop={onDrop}
                    arrows={[]}
                    alternateArrows={true}
                    boardHighlight={getBoardHighlight(winner)}
                />
            </div>
            <div className="multiplayer-card no-background list">
                {moveStack.map((move: string, index: number) =>
                    <Collapsible className="opening-collapsible" key={index} easing={"ease-in"}
                                 trigger={Utils.getTrigger(index, moveStack, fenStack)}>
                        {moveStack[index]}
                    </Collapsible>
                )}
            </div>
            <div className="multiplayer-card no-background k"></div>
            <div className="multiplayer-card no-background graph">
                {gameData && moveStack.length > 0 ?
                    <AdvantageGraph moveStack={moveStack} dataStack={undefined} playStack={undefined}
                                    scoreStack={scoreStack} width={400}/> : <></>
                }
            </div>
            <div className="multiplayer-card no-background turn">
                <img className={"img turn_img"} src={getToMove()} alt={"to move"}/>
                {getGameStatus(gameStatus)}
            </div>
            <div className="multiplayer-card no-background x"></div>
        </section>
    );
}

export default MultiplayerBoard;
