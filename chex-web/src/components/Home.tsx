import React, {useEffect, useState} from 'react';
import '../styles/Home.css';
import MainBoard from "./MainBoard";
import {Chess} from "chess.ts";
import Utils from "../service/Utils";
import ChapiService from "../service/ChapiService";
import PlayData from "../types/PlayData";

const Home: React.FC = () => {

    const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const stockfishLevel = 8
    const [playData, setPlayData] = useState<PlayData>()
    const [winner, setWinner] = useState<string>()

    useEffect(() => {
        const interval = setInterval(() => {
            ChapiService.getStockfishMove({
                fen: playData ? playData.fen : initialFen,
                difficulty: stockfishLevel
            })
                .then(response => {
                    const stockfishResult = (response.data as unknown as PlayData)
                    setPlayData(stockfishResult)
                    setWinner(stockfishResult.winner)
                })
                .catch(e => {
                    console.log(e)
                })
        }, 1000);
        return () => clearInterval(interval) ;
    }, [playData]);

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        return false
    }

    return (
        <section className="home-animated-grid">
            <div className="card-stationary">
                <h1>Welcome to Chexplanations!</h1>
            </div>
            <div className="card-stationary"></div>
            <div className="card-stationary m">
                <MainBoard
                    boardWidth={600}
                    position={playData ? playData.fen : initialFen}
                    boardOrientation={"white"}
                    onPieceDrop={onDrop}
                    arrows={[]}
                    alternateArrows={false}
                    boardHighlight={Utils.getBoardHighlight(winner)}
                />
            </div>
            <div className="card-stationary"></div>
            <div className="card-stationary"></div>
        </section>
    );
}

export default Home;

