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
import Collapsible from "react-collapsible";
import Opening from "../types/Opening";
import Variation from "./Variation";

const OpeningBook: React.FC = () => {

    const [openingData, setOpeningData] = useState<OpeningData>();
    const [refresh, setRefresh] = useState<boolean>(false)
    const [arrows, setArrows] = useState([['', '']])
    const [variationId, setVariationId] = useState<number>()
    const [chess, setChess] = useState(new Chess(Utils.INITIAL_FEN))
    const [isStart, setIsStart] = useState(true)
    const [moveStackString, setMoveStackString] = useState<string>("")

    useEffect(() => {
        if (!isStart) {
            ChapiService.getRandomOpening()
                .then(response => {
                    let openingDataResponse = response.data as OpeningData
                    setOpeningData(openingDataResponse);
                    let newChess = new Chess(openingDataResponse.opening.epd)
                    setChess(newChess)
                    setMoveStackString(openingDataResponse.opening.move_stack)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [refresh])

    useEffect(() => {
        if (variationId) {
            ChapiService.getOpeningById(variationId)
                .then(response => {
                    let openingDataResponse = response.data as OpeningData
                    setOpeningData(openingDataResponse);
                    setMoveStackString(openingDataResponse.opening.move_stack)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [variationId])

    useEffect(() => {
        if (moveStackString) {
            console.log(moveStackString)
            ChapiService.getOpeningByMoveStack({move_stack: moveStackString})
                .then(response => {
                    let openingDataResponse = response.data as unknown as OpeningData
                    console.log(openingDataResponse)
                    if (openingDataResponse.opening) {
                        setOpeningData(openingDataResponse);
                        setMoveStackString(openingDataResponse.opening.move_stack)
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [moveStackString])

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        let newChess = new Chess(chess.fen())
        let move = newChess.move({
            to: targetSquare,
            from: sourceSquare,
        })
        if (move != null) {
            setChess(newChess)
            let newMoveStackString = ""
            if (moveStackString.length == 0) {
                newMoveStackString = sourceSquare + targetSquare
            } else {
                newMoveStackString = moveStackString + " " + sourceSquare + targetSquare
            }
            setMoveStackString(newMoveStackString)
            return true
        }
        return false
    }

    function getToMove() {
        let chess = new Chess(openingData?.opening.epd)
        return (chess.turn() === 'w' ? whitePawn : blackPawn)
    }

    function onCollapsibleOpening(index: number) {
        let variation = openingData!.variations[index]
        let moves = variation.move_stack.replace(openingData!.opening.move_stack + ' ', '').split(" ")
        setArrows(Utils.sliceMove(moves[0]))
    }

    function onCollapsibleClosing() {
        setArrows([])
    }

    function formatTitle() {
        if (openingData && openingData.opening.wiki_link) {
            return <h4><a href={openingData?.opening.wiki_link}>{openingData?.opening.name}</a></h4>
        }
        return <h4>{openingData?.opening.name}</h4>
    }

    function onSelection(index: number) {
        setVariationId(openingData?.variations[index].id)
    }

    return (
        <section className="opening-animated-grid">
            <div className="opening-card no-background description">
                {openingData ? formatTitle() : <h4></h4>}
            </div>
            <div className="opening-main">
                <MainBoard
                    position={chess.fen()}
                    boardOrientation={"white"}
                    onPieceDrop={onDrop}
                    arrows={arrows}
                    alternateArrows={true}
                    boardHighlight={Utils.getBoardHighlight(undefined)}
                />
            </div>
            <div className="opening-card no-background click random">
                <img className={"smaller"} src={refreshImg} alt="Restart" onClick={() => {
                    setRefresh(!refresh);
                    setIsStart(false)
                }}/>
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
                {openingData?.variations.map((variation: Opening, index: number) =>
                    <Collapsible
                        classParentString="OpeningCollapsible"
                        key={index}
                        easing={"ease-in"}
                        trigger={variation.name}
                        onOpening={() => onCollapsibleOpening(index)}
                        onClosing={() => onCollapsibleClosing()}>
                        <Variation
                            original={openingData?.opening}
                            variation={variation}
                            index={index}
                            onSelection={onSelection}
                        />
                    </Collapsible>
                )}
            </div>
        </section>
    );
}

export default OpeningBook;
