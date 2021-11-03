import React, {useEffect, useState} from 'react';
import '../styles/CommentaryBox.css';
import MainBoard from "./MainBoard";
import {Chess} from 'chess.ts'
import CommentaryList from "./CommentaryList";
import ChapiService from "../service/ChapiService";
import PlayData from "../types/PlayData";
import ProgressBar from "@ramonak/react-progress-bar";

const CommentaryBox: React.FC = () => {

    const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const [stockfishLevel, setStockfishLevel] = useState(1)
    const [chess, setChess] = useState(new Chess())
    const [fen, setFen] = useState(chess.fen())
    const [arrow, setArrow] = useState([['', '']])
    const [moveStack, setMoveStack] = useState<string[]>([])
    const [fenStack, setFenStack] = useState<string[]>([initialFen])
    const [moveCommentary, setMoveCommentary] = useState<string[]>([])
    const [turn, setTurn] = useState(false)
    const [isStart, setIsStart] = useState(true)

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
                    let newMoveCommentary = moveCommentary.slice()
                    newMoveCommentary.push(response.data.toString())
                    setMoveCommentary(newMoveCommentary)
                })
                .catch(e => {
                    setMoveCommentary(["Chapi isn't happy :("])
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
                    setFen((response.data as unknown as PlayData).fen)
                    setChess(new Chess((response.data as unknown as PlayData).fen))
                    const newMoveStack = moveStack.slice()
                    newMoveStack.push((response.data as unknown as PlayData).move)
                    setMoveStack(newMoveStack)
                    const newFenStack = fenStack.slice()
                    newFenStack.push((response.data as unknown as PlayData).fen)
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

        // trigger stockfish's turn
        setTurn(!turn)
        return true
    }

    function resetBoard() {
        setChess(new Chess())
        setFen(initialFen)
        setMoveStack([])
        setMoveCommentary([])
        setIsStart(true)
    }

    function changeStockfishLevel() {
        setStockfishLevel((stockfishLevel % 10 + 1))
    }

    function sliceMove(move: string) {
        return [[move.slice(0, 2) as string, move.slice(2, 5) as string]]
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
        setFen(latestFen)
        setChess(new Chess(latestFen))
    }

    return (
        <section className="commentary-animated-grid">
            <div className="commentary-card">
                <h1 className="text">Hint</h1>
            </div>
            <div className="commentary-card" onClick={changeStockfishLevel}>
                Difficulty
                <ProgressBar className="difficulty-bar"
                             completed={stockfishLevel * 10}
                             bgColor = "#365992"/>
            </div>
            <div className="commentary-card" onClick={resetBoard}>
                <h1 className="text">New Game</h1>
            </div>
            <div className="commentary-main">
                <MainBoard
                    boardWidth={500}
                    position={fen}
                    boardOrientation={"white"}
                    onPieceDrop={onDrop}
                    arrows={arrow}
                />
            </div>
            <div className="commentary-list">
                <CommentaryList
                    commentaryList={moveCommentary}
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
