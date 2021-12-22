import React, {useEffect, useState} from 'react';
import '../styles/CommentaryBox.css';
import MainBoard from "./MainBoard";
import {Chess} from 'chess.ts'
import CommentaryList from "./CommentaryList";
import ChapiService from "../service/ChapiService";
import PlayData from "../types/PlayData";
import ProgressBar from "@ramonak/react-progress-bar";
import refresh from './icons/refresh.png';
import undo from './icons/undo.png';
import lightFilled from './icons/light-filled.png';
import lightUnfilled from './icons/light-unfilled.png';
import autoFilled from './icons/auto-filled.png';
import autoUnfilled from './icons/auto-unfilled.png';
import DescriptionData from "../types/DescriptionData";
import RecentDescription from "./RecentDescription";
import Utils from "../service/Utils";
import AdvantageGraph from "./AdvantageGraph";
import AggregationData from "../types/AggregationData";

const CommentaryBox: React.FC = () => {

    const BOARD_ID = "commentaryBox"
    const [stockfishLevel, setStockfishLevel] = useState(2)
    const [chess, setChess] = useState(new Chess())
    const [fen, setFen] = useState(chess.fen())
    const [arrows, setArrows] = useState([['', '']])
    const [moveStack, setMoveStack] = useState<string[]>([])
    const [winner, setWinner] = useState<string | undefined>()
    const [fenStack, setFenStack] = useState<string[]>([Utils.INITIAL_FEN])
    const [descDataStack, setDescDataStack] = useState<DescriptionData[]>([])
    const [turn, setTurn] = useState(false)
    const [trigger, setTrigger] = useState(false)
    const [isStart, setIsStart] = useState(true)
    const [stockfishTakeoverEnabled, setStockfishTakeoverEnabled] = useState(false)
    const [hintEnabled, setHintEnabled] = useState(false)
    const [aggregationEnabled, setAggregationEnabled] = useState<boolean>(true)
    const [aggregationData, setAggregationData] = useState<AggregationData>()
    const [aggregationChange, setAggregationChange] = useState<boolean>(false)

    function resetBoard() {
        setChess(new Chess())
        setFen(Utils.INITIAL_FEN)
        setArrows([['', '']])
        setMoveStack([])
        setFenStack([Utils.INITIAL_FEN])
        setDescDataStack([])
        setTurn(false)
        setIsStart(true)
        setHintEnabled(false)
        setWinner(undefined)
    }

    function undoMove() {
        setArrows([['', '']])
        setHintEnabled(false)
        setTurn(false)
        const newMoveStack = moveStack.slice(0, -2)
        setMoveStack(newMoveStack)
        const newFenStack = fenStack.slice(0, -2)
        setFenStack(newFenStack)
        const newFen = newFenStack[newFenStack.length - 1]
        setFen(newFen)
        setIsStart(true)
        setWinner(undefined)
        setChess(new Chess(newFen))
        const newDescDataStack = descDataStack.slice(0, -2)
        setDescDataStack(newDescDataStack)
    }

    function getUser() {
        if (chess.turn() === 'b') {
            return Utils.WHITE
        } else {
            return Utils.BLACK
        }
    }

    // move description hook
    useEffect(() => {
        let user = getUser();
        const moveStackCopy = moveStack.slice()
        const move = moveStackCopy.pop()
        if (!isStart) {
            ChapiService.getMoveDescription({
                user: user,
                moveStack: moveStack,
                uci: move,
                fen: chess.fen(),
                fenStack: fenStack
            })
                .then(response => {
                    let descriptionData = response.data as unknown as DescriptionData
                    if (descriptionData) {
                        let newDescDataStack = descDataStack.slice()
                        newDescDataStack.push(descriptionData)
                        setDescDataStack(newDescDataStack)
                        setAggregationChange(true)
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [moveStack])

    // move aggregation hook
    useEffect(() => {
        if (aggregationChange && aggregationEnabled) {
            let index = descDataStack.length - 1
            if (index > -1 && index) {
                let original = descDataStack[index].descriptions[0]
                console.log(original)
                ChapiService.getDescriptionAggregation({
                    index: index,
                    original: original,
                })
                    .then(response => {
                        console.log(response)
                        let aggregationData = response.data as unknown as AggregationData
                        if (aggregationData) {
                            setAggregationData(aggregationData)
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }
        }
    }, [descDataStack, aggregationChange, aggregationEnabled])

    // move aggregation update hook
    useEffect(() => {
        if (aggregationData && aggregationData.index < descDataStack.length) {
            let newDescDataStack = descDataStack.slice()
            newDescDataStack[aggregationData.index].descriptions.push(aggregationData.aggregation)
            setDescDataStack(newDescDataStack)
            setAggregationChange(false)
        }
    }, [aggregationData])

    // stockfish move hook
    useEffect(() => {
        if ((!isStart || stockfishTakeoverEnabled) && !winner) {
            ChapiService.getStockfishMove({
                id: BOARD_ID,
                fen: chess.fen(),
                difficulty: stockfishLevel,
                time_limit: 0.5,
                wait: !stockfishTakeoverEnabled
            })
                .then(response => {
                    const stockfishResult = (response.data as unknown as PlayData)
                    setFen(stockfishResult.fen)
                    setChess(new Chess(stockfishResult.fen))
                    // move will be null when game is over
                    if (stockfishResult.move) {
                        const newMoveStack = moveStack.slice()
                        newMoveStack.push(stockfishResult.move)
                        setMoveStack(newMoveStack)
                    }
                    setWinner(stockfishResult.winner)
                    const newFenStack = fenStack.slice()
                    newFenStack.push(stockfishResult.fen)
                    setFenStack(newFenStack)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [turn, trigger])

    useEffect(() => {
        const interval = setInterval(() => {
            if (stockfishTakeoverEnabled) {
                setTurn(!turn)
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [turn]);

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        let move = chess.move({
            to: targetSquare,
            from: sourceSquare,
        })

        // if invalid move
        if (move == null) return false;
        if (isStart) setIsStart(false)

        // user's turn
        setFen(chess.fen())
        const newMoveStack = moveStack.slice()
        newMoveStack.push(sourceSquare + targetSquare)
        setMoveStack(newMoveStack)
        const newFenStack = fenStack.slice()
        newFenStack.push(chess.fen())
        setFenStack(newFenStack)
        setHintEnabled(false)

        // trigger stockfish's turn
        setTurn(!turn)
        return true
    }

    function generateHint() {
        if (!hintEnabled) {
            ChapiService.getStockfishMove({
                id: BOARD_ID,
                fen: chess.fen(),
                difficulty: 9,
                time_limit: 1.5,
                wait: false
            })
                .then(response => {
                    console.log(response)
                    setArrows(Utils.sliceMove((response.data as unknown as PlayData).move))
                })
                .catch(e => {
                    console.log(e)
                })
        } else {
            setArrows([['', '']])
        }
        setHintEnabled(!hintEnabled)
    }

    function onCollapsibleOpening(index: number) {
        setFen(fenStack[index])
    }

    function onCollapsibleOpen(index: number) {
        let arrows = Utils.sliceMove(moveStack[index])
        setArrows(arrows)
    }

    function onCollapsibleClosing() {
        setArrows([['', '']])
        let latestFen = fenStack[fenStack.length - 1]
        setChess(new Chess(latestFen))
        fenStack.forEach(fen => setFen(fen))
    }

    function triggerStockfishTakeover() {
        if (!stockfishTakeoverEnabled) {
            setStockfishTakeoverEnabled(true)
            setTurn(!turn)
        } else {
            setStockfishTakeoverEnabled(false)
            if (turn) {
                setTrigger(!trigger)
            }
            setTurn(true)
        }
    }

    return (
        <section className="commentary-animated-grid">
            <div className="commentary-main-desc" onClick={() => setAggregationEnabled(!aggregationEnabled)}>
                <RecentDescription
                    descDataStack={descDataStack}
                    moveStack={moveStack}
                    fenStack={fenStack}
                    aggregationEnabled={aggregationEnabled}
                />
            </div>
            <div className="commentary-card no-background graph">
                <AdvantageGraph moveStack={moveStack} dataStack={descDataStack} playStack={undefined} width={600}/>
            </div>
            <div className="commentary-card difficulty" onClick={() => setStockfishLevel((stockfishLevel % 10 + 1))}>
                Difficulty
                <ProgressBar className="difficulty-bar" completed={stockfishLevel * 10} bgColor="#365992"/>
            </div>
            <div className="commentary-list">
                <CommentaryList
                    descDataStack={descDataStack}
                    moveStack={moveStack}
                    fenStack={fenStack}
                    onOpening={onCollapsibleOpening}
                    onOpen={onCollapsibleOpen}
                    onClosing={onCollapsibleClosing}
                />
            </div>
            <div className="commentary-main">
                <MainBoard
                    position={fen}
                    boardOrientation={"white"}
                    onPieceDrop={onDrop}
                    arrows={arrows}
                    alternateArrows={true}
                    boardHighlight={Utils.getBoardHighlight(winner)}
                />
            </div>
            <div className="commentary-card no-background hint" onClick={generateHint}>
                <img className={"smaller"} src={hintEnabled ? lightFilled : lightUnfilled} alt="Hint"/>
            </div>
            <div className="commentary-card no-background restart" onClick={resetBoard}>
                <img className={"smaller"} src={refresh} alt="Restart"/>
            </div>
            <div className="commentary-card no-background undo" onClick={undoMove}>
                <img src={undo} alt="Undo"/>
            </div>
            <div className="commentary-card no-background x" onClick={triggerStockfishTakeover}>
                <img
                    className={"smaller"}
                    src={stockfishTakeoverEnabled ? autoFilled : autoUnfilled}
                    alt="Stockfish Takeover"/>
            </div>
        </section>
    );
}

export default CommentaryBox;
