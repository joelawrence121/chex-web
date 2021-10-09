import React, {useEffect, useState} from 'react';
import './styles/App.css';
import Puzzle from "./Puzzle";
import ChapiService from "./services/ChapiService";
import PuzzleData from "./types/PuzzleData";

const App: React.FC = () => {
    const [puzzle, setPuzzle] = useState<PuzzleData>();

    useEffect(() => {
        ChapiService.getSingleMatePuzzle()
            .then(response => {
                setPuzzle(response.data);
                console.log(response.data)
            })
            .catch(e => {
                console.log(e)
            })
    }, [])

    return (
        <section className="animated-grid">
            <div className="card">a</div>
            <div className="card">b</div>
            <div className="card">c</div>
            <div className="card">d</div>
            <div className="card">e</div>
            <div className="card">f</div>
            <div className="card">g</div>
            <div className="card">h</div>
            <div className="main"><Puzzle position={puzzle?.starting_fen}/>
            </div>
        </section>
    );
}

export default App;
