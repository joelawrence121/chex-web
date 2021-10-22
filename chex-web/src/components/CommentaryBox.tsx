import React from 'react';
import '../styles/CommentaryBox.css';
import MainBoard from "./MainBoard";

const CommentaryBox: React.FC = () => {

    function onPositionChange(currentPosition: any) {
        console.log(currentPosition)
    }

    return (
        <section className="commentary-animated-grid">
            <div className="commentary-card">a</div>
            <div className="commentary-card">b</div>
            <div className="commentary-card">c</div>
            <div className="commentary-main">
                <MainBoard
                    boardWidth = {600}
                    position={"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}
                    boardOrientation={"white"}
                    onPositionChange={onPositionChange}
                    arrows={[]}
                />
            </div>
            <div className="commentary-card-stationary">e</div>
        </section>
    );
}

export default CommentaryBox;
