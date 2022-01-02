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
    const WAITING = "'WAITING'";

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
            setMenuState(MenuState.DONE)
            setNewMessages(gameDataResponse.messages.filter(x => gameData.messages.includes(x)))
        } else if (gameDataResponse.message) {
            setMenuState(MenuState.ERROR)
            setGameData(undefined)
            setErrorMessage(gameDataResponse.message)
        }
    }

    // multiplayer menu hook
    useEffect(() => {
        if (menuState === MenuState.CREATE) {
            ChapiService.createNewMultiplayerGame({
                player_name: inputPlayerName
            })
                .then(response => {
                    let gameDataResponse = response.data as unknown as GameData
                    setPlayerName(gameDataResponse.player_one)
                    setNewGameData(gameDataResponse)
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
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [menuState])

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
                        if (gameDataResponse.winner) setWinner(gameDataResponse.winner)
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

    function getGameStatus() {
        let chess = new Chess(gameData?.fen)
        if (chess.inCheckmate()) return "Checkmate"
        if (gameData && gameStatus === IN_PROGRESS) {
            return isPlayersTurn() ? "Your turn" : "Waiting"
        }
        return gameStatus
    }

    function getOtherPlayer() {
        if (gameData) {
            if (playerName === gameData.player_one) return gameData.player_two
            return gameData.player_one
        }
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

    function getTimer(turnTime : number) {
        if (gameStatus !== IN_PROGRESS) {
            return <></>
        }
        let seconds = String("0" + Math.ceil((turnTime % 120) / 2)).slice(-2)
        seconds = seconds === "60" ? "00" : seconds
        return <h1>{Math.floor(turnTime / 120)}:{seconds}</h1>
    }

    return (
        <section className="multiplayer-animated-grid">
            <div className="multiplayer-card no-background n">{getGameDescription()}</div>
            <div className="multiplayer-card no-background time">
                {getTimer(turnTime)}
            </div>
            <div className="multiplayer-card no-background join">
                <MultiplayerMenu menuState={menuState} setMenuState={setMenuState} inputGameId={inputGameId}
                                 inputPlayerName={inputPlayerName} setInputGameId={setInputGameId}
                                 setInputPlayerName={setInputPlayerName} errorMessage={errorMessage}/>
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
                <h1 style={{textAlign: "center"}}>{getGameStatus()}</h1>
            </div>
            <div className="multiplayer-card no-background x"></div>
        </section>
    );
}

export default MultiplayerBoard;
