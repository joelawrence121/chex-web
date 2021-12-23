import React from 'react';
import '../styles/Home.css';
import AutoBoard from "./AutoBoard";

const Home: React.FC = () => {

    const INTERVAL = 1000

    return (
        <section className="home-animated-grid">
            <div className="home-stationary a">
                <h1 style={{userSelect: "none"}}>Welcome to Chexplanations!</h1>
            </div>
            <div className="home-stationary b">
                <AutoBoard id={"board1"} interval={INTERVAL}/>
            </div>
            <div className="home-stationary c">
                <AutoBoard id={"board2"} interval={INTERVAL}/>
            </div>
            <div className="home-stationary d">
                <AutoBoard id={"board3"} interval={INTERVAL}/>
            </div>
            <div className="home-stationary"></div>
        </section>
    );
}

export default Home;

