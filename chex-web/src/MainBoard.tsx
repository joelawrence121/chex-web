import {Chessboard} from "react-chessboard";
import React from "react";

interface BoardProps {
    position : string | undefined;
}

function MainBoard(props:BoardProps) {
    return (
        <Chessboard
            boardWidth={250}
            position= {props.position}
            customBoardStyle={{
                borderRadius: "5px",
                boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}
        />
    )
}

export default MainBoard;