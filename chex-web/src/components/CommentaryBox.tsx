import React, {useEffect, useState} from 'react';
import '../styles/CommentaryBox.css';
import MainBoard from "./MainBoard";
import {Chess} from 'chess.ts'
import CommentaryList from "./CommentaryList";
import ChapiService from "../service/ChapiService";
import PlayData from "../types/PlayData";
import ProgressBar from "@ramonak/react-progress-bar";
import refresh from './icons/refresh.png';
import lightFilled from './icons/light-filled.png';
import lightUnfilled from './icons/light-unfilled.png';
import BoardHighlight from "../types/BoardHighlight";
import DescriptionData from "../types/DescriptionData";

const CommentaryBox: React.FC = () => {

    const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const [stockfishLevel, setStockfishLevel] = useState(6)
    const [chess, setChess] = useState(new Chess())
    const [fen, setFen] = useState(chess.fen())
    const [arrow, setArrow] = useState([['', '']])
    const [moveStack, setMoveStack] = useState<string[]>([])
    const [fenStack, setFenStack] = useState<string[]>([initialFen])
    const [descDataStack, setDescDataStack] = useState<DescriptionData[]>([])
    const [turn, setTurn] = useState(false)
    const [isStart, setIsStart] = useState(true)
    const [showHint, setShowHint] = useState(false)
    const [winner, setWinner] = useState<string | undefined>()

    function resetBoard() {
        setChess(new Chess())
        setFen(initialFen)
        setArrow([['', '']])
        setMoveStack([])
        setFenStack([initialFen])
        setDescDataStack([])
        setTurn(false)
        setIsStart(true)
        setShowHint(false)
        setWinner(undefined)
    }

    function getUser() {
        if (chess.turn() === 'b') {
            return 'human'
        } else {
            return 'stockfish'
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
                move: move,
                fen: chess.fen()
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
                fen: chess.fen(),
                difficulty: stockfishLevel
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
        console.log(fenStack)

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
                fen: chess.fen(),
                difficulty: stockfishLevel
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

    function getBoardHighlight() {
        if (!winner) {
            return BoardHighlight.normal();
        }
        if (winner == 'white') {
            return BoardHighlight.userWinner();
        }
        if (winner == 'black') {
            return BoardHighlight.stockfishWinner();
        }
        return BoardHighlight.normal();
    }

    return (
        <section className="commentary-animated-grid">
            <div className="commentary-card no-background" onClick={generateHint}>
                <img className={"smaller"} src={getHintIcon()} alt="Hint"/>
            </div>
            <div className="commentary-card" onClick={changeStockfishLevel}>
                Difficulty
                <ProgressBar className="difficulty-bar" completed={stockfishLevel * 10} bgColor="#365992"/>
            </div>
            <div className="commentary-card no-background" onClick={resetBoard}>
                <img className={"smaller"} src={refresh} alt="Refresh"/>
            </div>
            <div className="commentary-main">
                <MainBoard
                    boardWidth={500}
                    position={fen}
                    boardOrientation={"white"}
                    onPieceDrop={onDrop}
                    arrows={arrow}
                    alternateArrows={true}
                    boardHighlight={getBoardHighlight()}
                />
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
        </section>
    );
}

export default CommentaryBox;
