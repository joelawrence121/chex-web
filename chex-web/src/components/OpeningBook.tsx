import React from 'react';
import '../styles/OpeningBook.css';
import MainBoard from "./MainBoard";
import Utils from "../service/Utils";

const OpeningBook: React.FC = () => {

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        return false;
    }

    return (
        <section className="opening-animated-grid">
            <div className="opening-card no-background description">
                The Orangutan Opening
            </div>
            <div className="opening-main">
                <MainBoard
                    position={Utils.INITIAL_FEN}
                    boardOrientation={"white"}
                    onPieceDrop={onDrop}
                    arrows={[['', '']]}
                    alternateArrows={true}
                    boardHighlight={Utils.getBoardHighlight(undefined)}
                />
            </div>
            <div className="opening-card no-background click random">
                Random
            </div>
            <div className="opening-card no-background click play">
                Play
            </div>
            <div className="opening-card no-background pgn">
                1. Nc3
            </div>
            <div className="variation-list">
                List
            </div>
        </section>
    );
}

export default OpeningBook;
