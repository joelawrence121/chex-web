import React, {useEffect, useState} from 'react';
import '../styles/AutoBoard.css';
import MainBoard from "./MainBoard";
import Utils from "../service/Utils";
import ChapiService from "../service/ChapiService";
import PlayData from "../types/PlayData";
import AdvantageGraph from "./AdvantageGraph";
import ProgressBar from "@ramonak/react-progress-bar";

interface AutoBoardProps {
    id: string
    boardWidth: number
    interval: number
}

function AutoBoard(props: AutoBoardProps) {

    const stockfishLevel = 8
    const [playData, setPlayData] = useState<PlayData>()
    const [prevScore, setPrevScore] = useState(0)
    const [playDataStack, setPlayDataStack] = useState<PlayData[]>([])
    const [winner, setWinner] = useState<string>()

    useEffect(() => {
        const interval = setInterval(() => {
            if (!winner) {
                ChapiService.getStockfishMove({
                    id: props.id,
                    fen: playData ? playData.fen : Utils.INITIAL_FEN,
                    difficulty: stockfishLevel,
                    time_limit: 0.2
                })
                    .then(response => {
                        const stockfishResult = (response.data as unknown as PlayData)
                        // verify request id to prevent cross request contamination
                        if (stockfishResult.id === props.id) {
                            setPlayData(stockfishResult)
                            setWinner(stockfishResult.winner)
                            let newPlayDataStack = playDataStack.slice()
                            newPlayDataStack.push(stockfishResult)
                            setPlayDataStack(newPlayDataStack)
                            if (stockfishResult.score) {
                                setPrevScore(stockfishResult.score)
                            }
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }
        }, props.interval);
        return () => clearInterval(interval);
    }, [playData, playDataStack]);

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        return false
    }

    return (
        <>
            <MainBoard
                boardWidth={props.boardWidth}
                position={playData ? playData.fen : Utils.INITIAL_FEN}
                boardOrientation={"white"}
                onPieceDrop={onDrop}
                arrows={[]}
                alternateArrows={false}
                boardHighlight={Utils.getBoardHighlight(winner)}/>
            <ProgressBar className="advantage-bar" completed={50 - prevScore * 50} bgColor="#365992"
                         isLabelVisible={false}/>
            <AdvantageGraph moveStack={undefined}
                            dataStack={undefined}
                            playStack={playDataStack}
                            width={500}/>
        </>
    )
}

export default AutoBoard;

