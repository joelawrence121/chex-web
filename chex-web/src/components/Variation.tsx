import React from 'react';
import '../styles/OpeningBook.css';
import Opening from "../types/Opening";

interface VariationProps {
    original: Opening
    variation: Opening
    index: number
    onSelection: (index: number) => void,
}

function Variation(props: VariationProps) {

    return (
        <ul>
            <li>{formatPGN(props.variation.pgn)}</li>
            <li>{getShowDetails()}</li>
        </ul>
    );

    function formatPGN(pgn: string) {
        let pgn_move = pgn.replace(props.original.pgn, "...").replace(/[0-9]./g, '')
        if (props.variation.wiki_link) {
            return <a className="a opening variation" href={props.variation.wiki_link}>{pgn_move}</a>
        }
        return pgn_move
    }

    function getShowDetails() {
        return <button onClick={() => props.onSelection(props.index)}>Show Variation</button>
    }
}

export default Variation;
