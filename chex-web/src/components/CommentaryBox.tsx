import React, {useState} from 'react';
import '../styles/CommentaryBox.css';
import MainBoard from "./MainBoard";
import {Chess} from 'chess.ts'
import CommentaryList from "./CommentaryList";

const CommentaryBox: React.FC = () => {

    const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    const [chess, setChess] = useState(new Chess())
    const [fen, setFen] = useState(chess.fen())
    const [moveCommentary, setMoveCommentary] = useState<string[]>([])

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        let move = chess.move({
            to: targetSquare,
            from: sourceSquare,
        })
        if (move == null) return false;
        setFen(chess.fen())

        const newList = moveCommentary.slice()
        newList.push(sourceSquare + targetSquare)
        setMoveCommentary(newList)
        return true
    }

    function resetBoard() {
        setChess(new Chess())
        setFen(initialFen)
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
