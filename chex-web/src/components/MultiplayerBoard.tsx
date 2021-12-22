import React, {useState} from 'react';
import '../styles/MultiplayerBoard.css';
import MainBoard from "./MainBoard";
import Utils from "../service/Utils";
import {Chess} from "chess.ts";

const MultiplayerBoard: React.FC = () => {

    const [chess, setChess] = useState(new Chess(Utils.INITIAL_FEN))

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        return false
    }

    return (
        <section className="multiplayer-animated-grid">
            <div className="multiplayer-card no-background n"></div>
            <div className="multiplayer-card no-background time">Time</div>
            <div className="multiplayer-card no-background join">Join</div>
            <div className="multiplayer-card no-background chat">Chat</div>
            <div className="multiplayer-main">
                <MainBoard
                    position={chess.fen()}
                    boardOrientation={"white"}
                    onPieceDrop={onDrop}
                    arrows={[]}
                    alternateArrows={true}
                    boardHighlight={Utils.getBoardHighlight(undefined)}
                />
            </div>
            <div className="multiplayer-card no-background list">Moves</div>
            <div className="multiplayer-card no-background k"></div>
            <div className="multiplayer-card no-background graph">Graph</div>
            <div className="multiplayer-card no-background turn">Turn</div>
        </section>
    );
}

export default MultiplayerBoard;
