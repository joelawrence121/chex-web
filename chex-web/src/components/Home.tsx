import React from 'react';
import '../styles/Home.css';

const Home: React.FC = () => {

    return (
        <section className="home-animated-grid">
            <div className="card-stationary-a">
                <h2>Welcome to Chexplanations!</h2>
                COMP30030 & COMP30040
            </div>
            <div className="card-stationary">
            </div>
            <div className="card-stationary"></div>
            <div className="card-stationary"></div>
        </section>
    );
}

export default Home;
