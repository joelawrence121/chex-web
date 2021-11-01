import React, {useEffect, useState} from 'react';
import '../styles/CommentaryBox.css';
import MainBoard from "./MainBoard";
import {Chess} from 'chess.ts'
import CommentaryList from "./CommentaryList";
import ChapiService from "../service/ChapiService";
import PlayData from "../types/PlayData";

const CommentaryBox: React.FC = () => {

    const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const [stockfishLevel, setStockfishLevel] = useState(1)
    const [chess, setChess] = useState(new Chess())
    const [fen, setFen] = useState(chess.fen())
    const [moveStack, setMoveStack] = useState<string[]>([])
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
                    const newList = moveStack.slice()
                    newList.push((response.data as unknown as PlayData).move)
                    setMoveStack(newList)
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
        const newList = moveStack.slice()
        newList.push(sourceSquare + targetSquare)
        setMoveStack(newList)

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
        setStockfishLevel((stockfishLevel % 9 + 1))
    }

    return (
        <section className="commentary-animated-grid">
            <div className="commentary-card">
                <h1 className="text">Hint</h1>
            </div>
            <div className="commentary-card" onClick={changeStockfishLevel}>
                <h1 className="text">Stockfish Level: {stockfishLevel}</h1>
            </div>
            <div className="commentary-card" onClick={resetBoard}>
                <h1 className="text">New Game</h1>
            </div>
            <div className="commentary-main">
                <MainBoard
                    boardWidth={400}
                    position={fen}
                    boardOrientation={"white"}
                    onPieceDrop={onDrop}
                    arrows={[]}
                />
            </div>
            <div className="commentary-card-stationary">
                <CommentaryList commentaryList={moveCommentary}/>
            </div>
        </section>
    );
}

export default CommentaryBox;
