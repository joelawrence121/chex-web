import React, {useEffect, useState} from 'react';
import './styles/App.css';
import Puzzle from "./Puzzle";
import ChapiService from "./services/ChapiService";
import PuzzleData from "./types/PuzzleData";

enum PuzzleType {
    MATE = "MATE",
    GAIN = "GAIN",
    SWING = "SWING"
}

const PUZZLE_TYPE_DESCRIPTIONS = new Map([
    [PuzzleType.MATE.valueOf(), "MATE IN 1"],
    [PuzzleType.GAIN.valueOf(), "ADVANTAGE GAIN"],
    [PuzzleType.SWING.valueOf(), "ADVANTAGE SWING"]
])

const App: React.FC = () => {
    // piece of state just to trigger rerender on button press
    const [random, setRandom] = useState(Math.random());
    const [solutionVisible, setSolutionVisible] = useState(false);
    const [puzzle, setPuzzle] = useState<PuzzleData>();
    const [puzzleType, changePuzzleType] = useState(PuzzleType.MATE);

    const reRender = () => setRandom(Math.random());

    useEffect(() => {
        ChapiService.getSingleMatePuzzle(puzzleType.valueOf())
            .then(response => {
                setPuzzle(response.data);
                setSolutionVisible(false)
                console.log(response.data)
            })
            .catch(e => {
                console.log(e)
            })
    }, [random, puzzleType])

    function getMoveType(key: string | undefined) {
        if (PUZZLE_TYPE_DESCRIPTIONS.has(key as string)) {
            return PUZZLE_TYPE_DESCRIPTIONS.get(key as string)
        }
        return ""
    }

    const toggleSolution = () => setSolutionVisible(!solutionVisible);

    function getSolution() {
        return (solutionVisible ? puzzle?.move : "Show Solution")
    }

    function switchPuzzleType() {
        const puzzleTypes = [PuzzleType.MATE, PuzzleType.GAIN, PuzzleType.SWING]
        changePuzzleType(puzzleTypes[(puzzleTypes.indexOf(puzzleType) + 1) % 3])
    }

    return (
        <section className="animated-grid">
            <div className="card">a</div>
            <div className="card"><h2>{puzzle?.to_move} TO MOVE</h2></div>
            <div className="card">c</div>
            <div className="card" onClick={toggleSolution}>{getSolution()}</div>
            <div className="card" onClick={reRender}>NEW</div>
            <div className="card" onClick={switchPuzzleType}><h2>{getMoveType(puzzle?.type)}</h2></div>
            <div className="card">g</div>
            <div className="card">e</div>
            <div className="main"><Puzzle position={puzzle?.starting_fen}/>
            </div>
        </section>
    );
}

export default App;
