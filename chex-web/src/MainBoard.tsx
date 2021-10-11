import {Chessboard} from "react-chessboard";
import React from "react";

interface BoardProps {
    position: string | undefined;
    boardOrientation: string | undefined;
}

function MainBoard(props: BoardProps) {

    return (
        <Chessboard
            boardWidth={400}
            animationDuration={500}
            showBoardNotation={true}
            position={props.position}
            boardOrientation={getBoardOrientation(props.boardOrientation)}
            customBoardStyle={{
                borderRadius: "5px",
                boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}/>
    )

    function getBoardOrientation(boardOrientation: string | undefined): 'white' | 'black' {
        if (boardOrientation === 'BLACK') {
            return 'black'
        }
        return 'white'
    }
}

export default MainBoard;