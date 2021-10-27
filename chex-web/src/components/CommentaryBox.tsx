import React, {useEffect, useState} from 'react';
import '../styles/CommentaryBox.css';
import MainBoard from "./MainBoard";
import {Chess} from 'chess.ts'
import CommentaryList from "./CommentaryList";
import ChapiService from "../service/ChapiService";

const CommentaryBox: React.FC = () => {

    const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const [chess, setChess] = useState(new Chess())
    const [fen, setFen] = useState(chess.fen())
    const [moveStack, setMoveStack] = useState<string[]>([])
    const [moveCommentary, setMoveCommentary] = useState<string[]>([])

    function getUser() {
        if (chess.turn() === 'b') {
            return 'human'
        } else {
            return 'stockfish'
        }
    }

    useEffect(() => {
        let user = getUser();
        const moveStackCopy = moveStack.slice()
        const move = moveStackCopy.pop()
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
    }, [moveStack])

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        let move = chess.move({
            to: targetSquare,
            from: sourceSquare,
        })
        if (move == null) return false;
        setFen(chess.fen())

        const newList = moveStack.slice()
        newList.push(sourceSquare + targetSquare)
        setMoveStack(newList)
        return true
    }

    function resetBoard() {
        setChess(new Chess())
        setFen(initialFen)
        setMoveStack([])
        setMoveCommentary([])
    }

    return (
        <section className="commentary-animated-grid">
            <div className="commentary-card">Hint</div>
            <div className="commentary-card">Difficulty</div>
            <div className="commentary-card" onClick={resetBoard}>
                New Game
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
