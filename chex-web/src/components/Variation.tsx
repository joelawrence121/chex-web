import React from 'react';
import '../styles/OpeningBook.css';
import Opening from "../types/Opening";

interface VariationProps {
    original: Opening
    variation: Opening
}

function Variation(props: VariationProps) {

    return (
        <>
            {formatPGN(props.variation.pgn)}
        </>
    );

    function formatPGN(pgn: string) {
        return pgn.replace(props.original.pgn, "...").replace(/[0-9]./g, '')
    }
}

export default Variation;
