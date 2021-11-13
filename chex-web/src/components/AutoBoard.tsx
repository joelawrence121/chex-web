import React, {useEffect, useState} from 'react';
import '../styles/Home.css';
import MainBoard from "./MainBoard";
import Utils from "../service/Utils";
import ChapiService from "../service/ChapiService";
import PlayData from "../types/PlayData";

interface AutoBoardProps {
    id: string
    boardWidth: number
    interval: number
}

function AutoBoard(props: AutoBoardProps) {

    const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const stockfishLevel = 8
    const [playData, setPlayData] = useState<PlayData>()
    const [winner, setWinner] = useState<string>()

    useEffect(() => {
        const interval = setInterval(() => {
            ChapiService.getStockfishMove({
                id: props.id,
                fen: playData ? playData.fen : initialFen,
                difficulty: stockfishLevel
            })
                .then(response => {
                    const stockfishResult = (response.data as unknown as PlayData)
                    // verify request id to prevent cross request contamination
                    if (stockfishResult.id === props.id) {
                        setPlayData(stockfishResult)
                        setWinner(stockfishResult.winner)
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }, props.interval);
        return () => clearInterval(interval);
    }, [playData]);

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        return false
    }

    return (
        <MainBoard
            boardWidth={props.boardWidth}
            position={playData ? playData.fen : initialFen}
            boardOrientation={"white"}
            onPieceDrop={onDrop}
            arrows={[]}
            alternateArrows={false}
            boardHighlight={Utils.getBoardHighlight(winner)}
        />

    );
}

export default AutoBoard;

