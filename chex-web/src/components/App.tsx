import SingleMovePuzzle from "./SingleMovePuzzle";
import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import CommentaryBox from "./CommentaryBox";
import About from "./About";
import MatePuzzle from "./MatePuzzle";
import Home from "./Home";
import OpeningBook from "./OpeningBook";
import MultiplayerBoard from "./MultiplayerBoard";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import NavigationBar from "./NavigationBar";

const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/commentary">
                    <NavigationBar />
                    <CommentaryBox/>
                </Route>
                <Route path="/puzzles">
                    <NavigationBar />
                    <SingleMovePuzzle/>
                </Route>
                <Route path="/mate">
                    <NavigationBar />
                    <MatePuzzle/>
                </Route>
                <Route path="/about">
                    <NavigationBar />
                    <About/>
                </Route>
                <Route path="/openings">
                    <NavigationBar />
                    <OpeningBook/>
                </Route>
                <Route path="/multiplayer">
                    <NavigationBar />
                    <MultiplayerBoard/>
                </Route>
                <Route path="/">
                    <NavigationBar />
                    <Home/>
                </Route>
            </Switch>
        </Router>
    )
}

export default App;