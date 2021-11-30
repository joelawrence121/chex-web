import DescriptionData from "../types/DescriptionData";
import React from "react";
import BoardHighlight from "../types/BoardHighlight";

const WHITE = "white"
const BLACK = "black"
const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

function getOtherUser(user : string) {
    if (user === WHITE) {
        return BLACK
    }
    return WHITE
}

function getTrigger(index: number, item: string): string {
    // 1. e2e4  1. b7b6   2. c2c4  2. d7d6
    return (Math.ceil((index + 1) / 2)).toString() + ": " + item;
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
    return BoardHighlight.normal();
}

const Utils = {
    WHITE,
    BLACK,
    INITIAL_FEN,
    getTrigger,
    formatDescription,
    getBoardHighlight,
    getOtherUser
}

export default Utils;