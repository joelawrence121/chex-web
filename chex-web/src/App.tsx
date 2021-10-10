import React, {useEffect, useState} from 'react';
import './styles/App.css';
import Puzzle from "./Puzzle";
import ChapiService from "./services/ChapiService";
import PuzzleData from "./types/PuzzleData";

const singleMoveTypes = new Map([
    ["MATE", "MATE IN 1"],
    ["GAIN", "ADVANTAGE GAIN"],
    ["SWING", "ADVANTAGE SWING"]
])

const App: React.FC = () => {

    // piece of state just to trigger rerender on button press
    const [random, setRandom] = useState(Math.random());
    const [solutionVisible, setSolutionVisible] = useState(false);
    const [puzzle, setPuzzle] = useState<PuzzleData>();

    const reRender = () => setRandom(Math.random());

    useEffect(() => {
        ChapiService.getSingleMatePuzzle()
            .then(response => {
                setPuzzle(response.data);
                setSolutionVisible(false)
                console.log(response.data)
            })
            .catch(e => {
                console.log(e)
            })
    }, [random])

    function getMoveType(key: string | undefined) {
        if (singleMoveTypes.has(key as string)) {
            return singleMoveTypes.get(key as string)
        }
        return ""
    }

    const toggleSolution = () => setSolutionVisible(!solutionVisible);
    function getSolution() {
        return (solutionVisible ? puzzle?.move : "Show Solution")
    }

    return (
        <section className="animated-grid">
            <div className="card">a</div>
            <div className="card"><h2>{puzzle?.to_move} TO MOVE</h2></div>
            <div className="card" onClick={reRender}>NEW</div>
            <div className="card"><h2>{getMoveType(puzzle?.type)}</h2></div>
            <div className="card">c</div>
            <div className="card" onClick={toggleSolution}>{getSolution()}</div>
            <div className="card">g</div>
            <div className="card">e</div>
            <div className="main"><Puzzle position={puzzle?.starting_fen}/>
            </div>
        </section>
    );
}

export default App;
