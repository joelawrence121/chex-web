import {Chessboard} from "react-chessboard";
import React from "react";

interface BoardProps {
    position : string | undefined;
}

function MainBoard(props:BoardProps) {
    return (
        <Chessboard
            boardWidth={400}
            position= {props.position}
        />
    )
}

export default MainBoard;