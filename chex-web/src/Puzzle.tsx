import {Chessboard} from "react-chessboard";
import React from "react";

interface PuzzleProps {
    position : string | undefined;
}

function Puzzle(props:PuzzleProps) {
    return (
        <Chessboard
            boardWidth={400}
            position= {props.position}
        />
    )
}

export default Puzzle;