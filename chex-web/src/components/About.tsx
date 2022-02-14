import React, {useEffect, useState} from 'react';
import '../styles/About.css';
import BarChart from "./BarChart";
import ChapiService from "../service/ChapiService";
import Statistics from "../types/Statistics";

const About: React.FC = () => {

    const BStyle = {height : '100%', width : '100%'}
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
        <section className="about-animated-grid">
            <div className="card-stationary a">
                <br/>
                <h2><a href={"https://github.com/joelawrence121"}>Created by Joseph Lawrence</a></h2>
                Third Year Project at the University of Manchester
            </div>
            <div className="card-stationary b">
                Puzzle Statistics
                <BarChart values={puzzleTypes} yValueFn={getYCount} xLabelFn={getXLabel} style={BStyle}/>
            </div>
        </section>
    );
}

export default About;

