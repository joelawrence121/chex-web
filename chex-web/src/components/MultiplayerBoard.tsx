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

const MultiplayerBoard: React.FC = () => {

    const POLL_INTERVAL = 500
    const IN_PROGRESS = "IN PROGRESS";

    const [fen, setFen] = useState(Utils.INITIAL_FEN)
    const [gameStatus, setGameStatus] = useState("No game created.")
    const [inputPlayerName, setInputPlayerName] = useState('')
    const [inputGameId, setInputGameId] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [gameData, setGameData] = useState<GameData>()
    const [newMessages, setNewMessages] = useState<Message[]>([])
    const [createNew, setCreateNew] = useState(false)
    const [joinGame, setJoinGame] = useState(false)
    const [move, setMove] = useState<string>()
    const [winner, setWinner] = useState<string>()

    // create new game hook
    useEffect(() => {
        if (createNew) {
            ChapiService.createNewMultiplayerGame({
                player_name: inputPlayerName
            })
                .then(response => {
                    let gameDataResponse = response.data as unknown as GameData
                    setGameData(gameDataResponse);
                    setGameStatus(gameDataResponse.state)
                    setPlayerName(gameDataResponse.player_one)
                    if (gameData) {
                        setNewMessages(gameDataResponse.messages.filter(x => gameData.messages.includes(x)))
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [createNew])

    // join new game hook
    useEffect(() => {
        if (joinGame) {
            ChapiService.joinMultiplayerGame({
                player_name: inputPlayerName,
                game_id: inputGameId
            })
                .then(response => {
                    let gameDataResponse = response.data as unknown as GameData
                    setGameData(gameDataResponse);
                    setGameStatus(gameDataResponse.state)
                    setPlayerName(gameDataResponse.player_two)
                    if (gameData) {
                        setNewMessages(gameDataResponse.messages.filter(x => !gameData.messages.includes(x)))
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [joinGame])

    // polling hook
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
                        if (gameDataResponse.fen !== fen) setFen(gameDataResponse.fen)
                        if (gameDataResponse.winner) setWinner(gameDataResponse.winner)
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }
        }, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [gameData]);

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
                    }
                    if (gameDataResponse.winner) setWinner(gameDataResponse.winner)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [move])

    const updateGameId = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputGameId(e.target.value)
    }

    const updatePlayerName = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputPlayerName(e.target.value)
    }

    function getOnlineComponent() {
        if (!gameData) {
            return <>
                <input
                    className="input-box"
                    placeholder="Type your name here..."
                    onChange={updatePlayerName}
                    value={inputPlayerName}/>
                <button className="multiplayer-button" onClick={() => setCreateNew(true)}>Create new game</button>
                <br/><br/>
                <input
                    className="input-box"
                    placeholder="Type your game id here..."
                    onChange={updateGameId}
                    value={inputGameId}/>
                <button className="multiplayer-button" onClick={() => setJoinGame(true)}>Join game</button>
            </>
        }
    }

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

    function getGameStatus() {
        let chess = new Chess(gameData?.fen)
        if (chess.inCheckmate()) return "Checkmate"
        if (gameData && gameStatus === IN_PROGRESS) {
            if ((chess.turn() === 'w' && playerName === gameData?.player_one) || (chess.turn() === 'b' && playerName === gameData?.player_two)) {
                return "Your turn"
            }
            return "Waiting"
        }
        return gameStatus
    }

    function getOtherPlayer() {
        if (gameData) {
            if (playerName === gameData.player_one) return gameData.player_two
            return gameData.player_one
        }
    }

    function getGameId() {
        if (gameData) {
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

    return (
        <section className="multiplayer-animated-grid">
            <div className="multiplayer-card no-background n">{getGameId()}</div>
            <div className="multiplayer-card no-background time">Time</div>
            <div className="multiplayer-card no-background join">{getOnlineComponent()}</div>
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
            <div className="multiplayer-card no-background list">Moves</div>
            <div className="multiplayer-card no-background k"></div>
            <div className="multiplayer-card no-background graph">Graph</div>
            <div className="multiplayer-card no-background turn">
                <img className={"img turn_img"} src={getToMove()} alt={"to move"}/>
                <h1 style={{textAlign: "center"}}>{getGameStatus()}</h1>
            </div>
            <div className="multiplayer-card no-background x"></div>
        </section>
    );
}

export default MultiplayerBoard;
