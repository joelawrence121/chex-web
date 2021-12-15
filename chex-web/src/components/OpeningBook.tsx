import React, {useEffect, useState} from 'react';
import '../styles/OpeningBook.css';
import MainBoard from "./MainBoard";
import Utils from "../service/Utils";
import ChapiService from "../service/ChapiService";
import OpeningData from "../types/OpeningData";
import whitePawn from "./icons/white-pawn.png";
import blackPawn from "./icons/black-pawn.png";
import {Chess} from "chess.ts";
import refreshImg from "./icons/refresh.png";
import rightArrow from "./icons/right-arrow.png";
import DescriptionData from "../types/DescriptionData";
import Collapsible from "react-collapsible";
import Opening from "../types/Opening";

const OpeningBook: React.FC = () => {

    const [openingData, setOpeningData] = useState<OpeningData>();
    const [refresh, setRefresh] = useState<boolean>(false)

    useEffect(() => {
        ChapiService.getRandomOpening()
            .then(response => {
                setOpeningData(response.data as OpeningData);
                console.log(response.data)
            })
            .catch(e => {
                console.log(e)
            })
    }, [refresh])

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        return false;
    }

    function getToMove() {
        let chess = new Chess(openingData?.opening.epd)
        return (chess.turn() === 'w' ? whitePawn : blackPawn)
    }

    return (
        <section className="opening-animated-grid">
            <div className="opening-card no-background description">
                {openingData?.opening.name}
            </div>
            <div className="opening-main">
                <MainBoard
                    position={openingData?.opening.epd}
                    boardOrientation={"white"}
                    onPieceDrop={onDrop}
                    arrows={[['', '']]}
                    alternateArrows={true}
                    boardHighlight={Utils.getBoardHighlight(undefined)}
                />
            </div>
            <div className="opening-card no-background click random">
                <img className={"smaller"} src={refreshImg} alt="Restart" onClick={() => setRefresh(!refresh)}/>
            </div>
            <div className="opening-card no-background turn">
                <img className={"bigger"} src={getToMove()} alt={"to move"}/>
            </div>
            <div className="opening-card no-background click play">
                <img className={"smaller"} src={rightArrow} alt="Next"/>
            </div>
            <div className="opening-card no-background pgn">
                <p>{openingData?.opening.pgn}</p>
            </div>
            <div className="variation-list">
                {openingData?.variations.map((opening: Opening, index: number) =>
                    <Collapsible
                        key={index}
                        easing={"ease-in"}
                        trigger={opening.name}>
                        {opening.move_stack}
                    </Collapsible>
                )}
            </div>
        </section>
    );
}

export default OpeningBook;
