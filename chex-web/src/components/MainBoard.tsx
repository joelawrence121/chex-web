import {Chessboard} from "react-chessboard";
import React from "react";

interface BoardProps {
    boardWidth: number
    position: string | undefined;
    boardOrientation: string | undefined;
    onPositionChange: (currentPosition: any) => void
    arrows: string[][]
}

function MainBoard(props: BoardProps) {

    return (
        <Chessboard
            boardWidth={props.boardWidth}
            position={props.position}
            boardOrientation={getBoardOrientation(props.boardOrientation)}
            getPositionObject={props.onPositionChange}
            customArrows={props.arrows}
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