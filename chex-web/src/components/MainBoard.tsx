import {Chessboard} from "react-chessboard";
import React from "react";
import {Chess} from "chess.ts";

interface BoardProps {
    boardWidth: number
    position: string | undefined;
    boardOrientation: string | undefined;
    onPieceDrop: (sourceSquare: any, targetSquare: any, piece: any) => boolean
    arrows: string[][]
}

function MainBoard(props: BoardProps) {

    return (
        <Chessboard
            boardWidth={props.boardWidth}
            position={props.position}
            boardOrientation={getBoardOrientation(props.boardOrientation)}
            customArrows={props.arrows}
            onPieceDrop={props.onPieceDrop}
            customLightSquareStyle={{backgroundColor: '#a1c3f5'}}
            customDarkSquareStyle={{backgroundColor: '#365992'}}
            customDropSquareStyle={{boxShadow: 'inset 0 0 1px 6px rgba(255,255,255,0.75)'}}
            customArrowColor={getArrowColour(props.position)}
            customBoardStyle={{
                borderRadius: "5px",
                boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}/>
    )

    function getArrowColour(position: string | undefined) {
        let chess = new Chess(position)
        if (chess.turn() == "w") {
            return "#60efda";
        }
        return "#5118c4";
    }

    function getBoardOrientation(boardOrientation: string | undefined): 'white' | 'black' {
        if (boardOrientation === 'BLACK') {
            return 'black'
        }
        return 'white'
    }
}

export default MainBoard;