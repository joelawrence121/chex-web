import React, {useEffect, useState} from 'react';
import '../styles/MultiplayerBoard.css';
import MainBoard from "./MainBoard";
import Utils from "../service/Utils";
import {Chess} from "chess.ts";
import ChapiService from "../service/ChapiService";
import GameData, {Message} from "../types/MultiplayerTypes";

const MultiplayerBoard: React.FC = () => {

    const POLL_INTERVAL = 500

    const [chess, setChess] = useState(new Chess(Utils.INITIAL_FEN))
    const [gameStatus, setGameStatus] = useState("No game created.")
    const [inputPlayerName, setInputPlayerName] = useState('')
    const [inputGameId, setInputGameId] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [gameData, setGameData] = useState<GameData>()
    const [createNew, setCreateNew] = useState(false)
    const [joinGame, setJoinGame] = useState(false)

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        return false
    }

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
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [joinGame])

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
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }
        }, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [gameData]);

    const updateGameId = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputGameId(e.target.value)
    }

    const updatePlayerName = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputPlayerName(e.target.value)
    }

    return (
        <section className="multiplayer-animated-grid">
            <div className="multiplayer-card no-background n"></div>
            <div className="multiplayer-card no-background time">Time</div>
            <div className="multiplayer-card no-background join">
                <h1 style={{alignSelf: "center"}}>{gameStatus}</h1>
                <input
                    className="App-Textarea"
                    placeholder="Type your name here..."
                    onChange={updatePlayerName}
                    value={inputPlayerName}
                />
                <button className="multiplayer-button" onClick={() => setCreateNew(true)}>Create new game</button>
                <input
                    className="App-Textarea"
                    placeholder="Type your game id here..."
                    onChange={updateGameId}
                    value={inputGameId}
                />
                <button className="multiplayer-button" onClick={() => setJoinGame(true)}>Join game</button>
            </div>
            <div className="multiplayer-card no-background chat">
                {gameData?.messages.map((message: Message, index: number) =>
                    <p>{message.player}: {message.message}</p>
                )}
            </div>
            <div className="multiplayer-main">
                <MainBoard
                    position={chess.fen()}
                    boardOrientation={"white"}
                    onPieceDrop={onDrop}
                    arrows={[]}
                    alternateArrows={true}
                    boardHighlight={Utils.getBoardHighlight(undefined)}
                />
            </div>
            <div className="multiplayer-card no-background list">Moves</div>
            <div className="multiplayer-card no-background k"></div>
            <div className="multiplayer-card no-background graph">Graph</div>
            <div className="multiplayer-card no-background turn">Turn</div>
            <div className="multiplayer-card no-background x"></div>
        </section>
    );
}

export default MultiplayerBoard;
