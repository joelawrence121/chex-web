import React from 'react';
import '../styles/Home.css';
import AutoBoard from "./AutoBoard";

const Home: React.FC = () => {

    const BOARD_WIDTH = 500
    const INTERVAL = 1000

    return (
        <section className="home-animated-grid">
            <div className="home-stationary a">
                <h1>Welcome to Chexplanations!</h1>
            </div>
            <div className="home-stationary b">
                <AutoBoard id={"board1"} boardWidth={BOARD_WIDTH} interval={INTERVAL}/>
            </div>
            <div className="home-stationary c">
                <AutoBoard id={"board2"} boardWidth={BOARD_WIDTH} interval={INTERVAL}/>
            </div>
            <div className="home-stationary d">
                <AutoBoard id={"board3"} boardWidth={BOARD_WIDTH} interval={INTERVAL}/>
            </div>
            <div className="home-stationary"></div>
        </section>
    );
}

export default Home;

