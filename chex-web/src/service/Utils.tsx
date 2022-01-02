import DescriptionData from "../types/DescriptionData";
import React from "react";
import BoardHighlight from "../types/BoardHighlight";
import {Chess} from "chess.ts";

const WHITE = "white"
const BLACK = "black"
const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

function sliceMove(move: string | undefined): [string[]] {
    if (move) {
        return [[move.slice(0, 2) as string, move.slice(2, 5) as string]]
    }
    return [['', '']]
}

function getTrigger(index: number, moveStack: string[], fenStack: string[]): string {
    // Create san notation move headers
    // 1. e3  1. h7   2. Bd4  2. a4
    let chess = new Chess(fenStack[index])
    let move = chess.move({from: sliceMove(moveStack[index])[0][0], to: sliceMove(moveStack[index])[0][1]})
    return (Math.ceil((index + 1) / 2)).toString() + ": " + move?.san;
}

function formatDescription(description: string, descData: DescriptionData) {
    if (descData.opening && description.includes(descData.opening) && descData.link) {
        // replace any occurrences of 'opening' with link to opening
        const link = <a href={descData.link}>{descData.opening}</a>;
        description = description.replace(descData.opening, "$")
        const index = description.indexOf("$");
        return <p>{description.substr(0, index)}{link}{description.substr(index + 1)}</p>
    }
    return <p>{description}</p>
}

function getBoardHighlight(winner: string | undefined) {
    if (!winner) {
        return BoardHighlight.normal();
    }
    if (winner === 'white') {
        return BoardHighlight.userWinner();
    }
    if (winner === 'black') {
        return BoardHighlight.stockfishWinner();
    }
    if (winner === 'stale') {
        return BoardHighlight.stalemate()
    }
    return BoardHighlight.normal();
}

const Utils = {
    WHITE,
    BLACK,
    INITIAL_FEN,
    getTrigger,
    formatDescription,
    getBoardHighlight,
    sliceMove
}

export default Utils;