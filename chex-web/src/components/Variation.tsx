import React from 'react';
import '../styles/OpeningBook.css';
import Opening from "../types/Opening";

interface VariationProps {
    original: Opening
    variation: Opening
    index: number
    onSelection: (index: number) => void,
}

function getPercentage(count: number, totalCount: number) {
    return Math.round(count / totalCount * 100)
}

function Variation(props: VariationProps) {

    function getStatistics() {
        let totalCount = props.variation.white + props.variation.draws + props.variation.black
        if (totalCount > 0) {
            return <>
                <li className={"statistic"}>
                    <pre>Master's games: &#9;{totalCount}</pre>
                </li>
                <li className={"statistic"}>
                    <pre>White wins: &#9;&#9;&#9;&#9;&#9;{props.variation.white} : {getPercentage(props.variation.white, totalCount)}%</pre>
                </li>
                <li className={"statistic"}>
                    <pre>Black wins: &#9;&#9;&#9;&#9;&#9;{props.variation.black} : {getPercentage(props.variation.black, totalCount)}%</pre>
                </li>
                <li className={"statistic"}>
                    <pre>Draws: &#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;&#9;{props.variation.draws} : {getPercentage(props.variation.draws, totalCount)}%</pre>
                </li>
            </>
        }
    }

    function formatPGN(pgn: string) {
        let pgn_move = pgn.replace(props.original.pgn, "...").replace(/[0-9][.]/g, ' ')
        if (props.variation.wiki_link) {
            return <a className="a opening variation" href={props.variation.wiki_link}>{pgn_move}</a>
        }
        return pgn_move
    }

    function getShowDetails() {
        return <button onClick={() => props.onSelection(props.index)}>Show Variation</button>
    }

    return (
        <ul>
            <li>{formatPGN(props.variation.pgn)}</li>
            <li>{getShowDetails()}</li>
            {getStatistics()}
        </ul>
    );
}

export default Variation;
