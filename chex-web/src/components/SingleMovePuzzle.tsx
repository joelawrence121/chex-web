import React, {useEffect, useState} from 'react';
import '../styles/SingleMovePuzzle.css';
import MainBoard from "./MainBoard";
import ChapiService from "../service/ChapiService";
import PuzzleData from "../types/PuzzleData";
import PuzzleType from "../types/PuzzleType";
import {Chess} from "chess.ts";

const PUZZLE_TYPE_DESCRIPTIONS = new Map([
    [PuzzleType.MATE.valueOf(), "MATE IN 1"],
    [PuzzleType.GAIN.valueOf(), "GAIN"],
    [PuzzleType.SWING.valueOf(), "SWING"],
    [PuzzleType.PIN.valueOf(), "PIN"]
])

const SingleMovePuzzle: React.FC = () => {

    // piece of state just to trigger rerender on button press
    const [random, setRandom] = useState(Math.random());
    const [solutionVisible, setSolutionVisible] = useState(false);
    const [arrow, setArrow] = useState([['', '']])
    const [puzzle, setPuzzle] = useState<PuzzleData>();
    const [puzzleType, changePuzzleType] = useState(PuzzleType.MATE);
    const [chess, setChess] = useState(new Chess())
    const [fen, setFen] = useState<string>()

    const reRender = () => setRandom(Math.random());

    useEffect(() => {
        ChapiService.getSingleMatePuzzle(puzzleType.valueOf())
            .then(response => {
                setPuzzle(response.data);
                setFen((response.data as PuzzleData).starting_fen)
                chess.load((response.data as PuzzleData).starting_fen)
                setChess(chess)
                setSolutionVisible(false)
                console.log(response.data)
            })
            .catch(e => {
                console.log(e)
            })
    }, [random, puzzleType])

    function getArrows() {
        function sliceMove(solution: string | undefined) {
            return [solution?.slice(0, 2) as string, solution?.slice(2, 5) as string]
        }
        let solution = puzzle?.move
        let arrows = [sliceMove(solution)]
        // if pin puzzle type we want to show the follow move by the other player
        if (puzzle?.type === PuzzleType.PIN.valueOf()) {
            arrows.push(sliceMove(puzzle?.follow_move))
        }
        return arrows
    }

    function toggleSolution() {
        if (!solutionVisible) {
            setArrow(getArrows())
        } else {
            setArrow([])
        }
        setSolutionVisible(!solutionVisible);
    }

    function getMoveType(key: string | undefined) {
        if (PUZZLE_TYPE_DESCRIPTIONS.has(key as string)) {
            return PUZZLE_TYPE_DESCRIPTIONS.get(key as string)
        }
        return ""
    }

    function getSolution() {
        return (solutionVisible ? puzzle?.move : "Show Solution")
    }

    function switchPuzzleType() {
        const puzzleTypes = [PuzzleType.MATE, PuzzleType.GAIN, PuzzleType.SWING, PuzzleType.PIN]
        changePuzzleType(puzzleTypes[(puzzleTypes.indexOf(puzzleType) + 1) % puzzleTypes.length])
    }

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        let move = chess.move({
            to: targetSquare,
            from: sourceSquare,
        })
        if (move == null) return false;
        setFen(chess.fen())
        return true
    }

    return (
        <section className="animated-grid">
            <div className="card-t"><h2>{puzzle?.to_move} TO MOVE</h2></div>
            <div className="card" onClick={switchPuzzleType}>
                <h2>{getMoveType(puzzle?.type)}</h2>
            </div>
            <div className="card"></div>
            <div className="card" onClick={toggleSolution}>{getSolution()}</div>
            <div className="card" onClick={reRender}>NEW</div>
            <div className="main">
                <MainBoard
                    boardWidth={600}
                    position={fen}
                    boardOrientation={puzzle?.to_move as string}
                    onPieceDrop={onDrop}
                    arrows={arrow}
                />
            </div>
        </section>
    );
}

export default SingleMovePuzzle;
