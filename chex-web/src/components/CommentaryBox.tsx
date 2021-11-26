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
import DescriptionData from "../types/DescriptionData";
import RecentDescription from "./RecentDescription";
import Utils from "../service/Utils";
import AdvantageGraph from "./AdvantageGraph";

const CommentaryBox: React.FC = () => {

    const BOARD_ID = "commentaryBox"
    const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const [stockfishLevel, setStockfishLevel] = useState(2)
    const [chess, setChess] = useState(new Chess())
    const [fen, setFen] = useState(chess.fen())
    const [arrow, setArrow] = useState([['', '']])
    const [moveStack, setMoveStack] = useState<string[]>([])
    const [fenStack, setFenStack] = useState<string[]>([INITIAL_FEN])
    const [descDataStack, setDescDataStack] = useState<DescriptionData[]>([])
    const [turn, setTurn] = useState(false)
    const [isStart, setIsStart] = useState(true)
    const [showHint, setShowHint] = useState(false)
    const [winner, setWinner] = useState<string | undefined>()

    function resetBoard() {
        setChess(new Chess())
        setFen(INITIAL_FEN)
        setArrow([['', '']])
        setMoveStack([])
        setFenStack([INITIAL_FEN])
        setDescDataStack([])
        setTurn(false)
        setIsStart(true)
        setShowHint(false)
        setWinner(undefined)
    }

    function undoMove() {
        setArrow([['', '']])
        setShowHint(false)
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
                    let newDescDataStack = descDataStack.slice()
                    newDescDataStack.push(descriptionData)
                    setDescDataStack(newDescDataStack)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [moveStack])

    // stockfish move hook
    useEffect(() => {
        if (!isStart) {
            ChapiService.getStockfishMove({
                id: BOARD_ID,
                fen: chess.fen(),
                difficulty: stockfishLevel,
                time_limit: 0.5
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
    }, [turn])

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
        setShowHint(false)

        // trigger stockfish's turn
        setTurn(!turn)
        return true
    }

    function sliceMove(move: string | undefined) {
        if (move) {
            return [[move.slice(0, 2) as string, move.slice(2, 5) as string]]
        }
        return [['', '']]
    }

    function generateHint() {
        if (!showHint) {
            ChapiService.getStockfishMove({
                id: BOARD_ID,
                fen: chess.fen(),
                difficulty: 9,
                time_limit: 1.5
            })
                .then(response => {
                    console.log(response)
                    setArrow(sliceMove((response.data as unknown as PlayData).move))
                })
                .catch(e => {
                    console.log(e)
                })
        } else {
            setArrow([['', '']])
        }
        setShowHint(!showHint)
    }

    function changeStockfishLevel() {
        setStockfishLevel((stockfishLevel % 10 + 1))
    }

    function onCollapsibleOpening(index: number) {
        setFen(fenStack[index])
    }

    function onCollapsibleOpen(index: number) {
        let arrows = sliceMove(moveStack[index])
        setArrow(arrows)
    }

    function onCollapsibleClosing() {
        setArrow([['', '']])
        let latestFen = fenStack[fenStack.length - 1]
        setChess(new Chess(latestFen))
        fenStack.forEach(fen => setFen(fen))
    }

    function getHintIcon() {
        return showHint ? lightFilled : lightUnfilled;
    }

    return (
        <section className="commentary-animated-grid">
            <div className="commentary-main-desc">
                <RecentDescription descDataStack={descDataStack} moveStack={moveStack}/>
            </div>
            <div className="commentary-card no-background graph">
                <AdvantageGraph moveStack={moveStack} dataStack={descDataStack}/>
            </div>
            <div className="commentary-card difficulty" onClick={changeStockfishLevel}>
                Difficulty
                <ProgressBar className="difficulty-bar" completed={stockfishLevel * 10} bgColor="#365992"/>
            </div>
            <div className="commentary-list">
                <CommentaryList
                    descDataStack={descDataStack}
                    moveStack={moveStack}
                    onOpening={onCollapsibleOpening}
                    onOpen={onCollapsibleOpen}
                    onClosing={onCollapsibleClosing}
                />
            </div>
            <div className="commentary-main">
                <MainBoard
                    boardWidth={600}
                    position={fen}
                    boardOrientation={"white"}
                    onPieceDrop={onDrop}
                    arrows={arrow}
                    alternateArrows={true}
                    boardHighlight={Utils.getBoardHighlight(winner)}
                />
            </div>
            <div className="commentary-card no-background hint" onClick={generateHint}>
                <img className={"smaller"} src={getHintIcon()} alt="Hint"/>
            </div>
            <div className="commentary-card no-background restart" onClick={resetBoard}>
                <img className={"smaller"} src={refresh} alt="Restart"/>
            </div>
            <div className="commentary-card no-background undo" onClick={undoMove}>
                <img src={undo} alt="Undo"/>
            </div>
            <div className="commentary-card no-background x" onClick={resetBoard}>
                <img className={"smaller"} src={refresh} alt="Restart"/>
            </div>
        </section>
    );
}

export default CommentaryBox;
