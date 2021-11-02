import React, {useEffect, useState} from 'react';
import '../styles/Home.css';
import BarChart from "./BarChart";
import ChapiService from "../service/ChapiService";
import Statistics from "../types/Statistics";

const Home: React.FC = () => {

    const [puzzleTypes, setPuzzleTypes] = useState<string[]>([])
    const [puzzleCounts, setPuzzleCounts] = useState<number[]>([])

    // retrieve statistics hook
    useEffect(() => {
        ChapiService.getStatistics()
            .then(response => {
                console.log(response)
                setPuzzleTypes((response.data as unknown as Statistics).types)
                setPuzzleCounts((response.data as unknown as Statistics).counts)
            })
            .catch(e => {
                console.log(e)
            })
    }, [])

    function getYCount(type: string): number {
        return puzzleCounts[puzzleTypes.indexOf(type)]
    }

    function getXLabel(type: string): string {
        return type
    }

    return (
        <section className="home-animated-grid">
            <div className="card-stationary a">
                <h2>Welcome to Chexplanations!</h2>
                COMP30030 & COMP30040
            </div>
            <div className="card-stationary b">
                <BarChart values={puzzleTypes} yValueFn={getYCount} xLabelFn={getXLabel}/>
            </div>
            <div className="card-stationary c"> </div>
        </section>
    );
}

export default Home;

