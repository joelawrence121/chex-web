import SingleMovePuzzle from "./SingleMovePuzzle";
import React from "react";
import NavbarScroller from "./NavbarScroller";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import CommentaryBox from "./CommentaryBox";
import About from "./About";
import MatePuzzle from "./MatePuzzle";
import Home from "./Home";
import OpeningBook from "./OpeningBook";
import MultiplayerBoard from "./MultiplayerBoard";

const navigation = {
    brand: {name: "Chexplanations", to: "/"},
    links: [
        {name: "About", to: "/about"},
        {name: "Commentary", to: "/commentary"},
        {name: "Single Move Puzzles", to: "/puzzles"},
        {name: "Mate in N", to: "/mate"},
        {name: "Openings", to: "/openings"},
        {name: "Multiplayer", to: "/multiplayer"}
    ]
}

const App: React.FC = () => {
    const {brand, links} = navigation;
    return (
        <Router>
            <Switch>
                <Route path="/commentary">
                    <NavbarScroller brand={brand} links={links}/>
                    <CommentaryBox/>
                </Route>
                <Route path="/puzzles">
                    <NavbarScroller brand={brand} links={links}/>
                    <SingleMovePuzzle/>
                </Route>
                <Route path="/mate">
                    <NavbarScroller brand={brand} links={links}/>
                    <MatePuzzle/>
                </Route>
                <Route path="/about">
                    <NavbarScroller brand={brand} links={links}/>
                    <About/>
                </Route>
                <Route path="/openings">
                    <NavbarScroller brand={brand} links={links}/>
                    <OpeningBook/>
                </Route>
                <Route path="/multiplayer">
                    <NavbarScroller brand={brand} links={links}/>
                    <MultiplayerBoard/>
                </Route>
                <Route path="/">
                    <NavbarScroller brand={brand} links={links}/>
                    <Home/>
                </Route>
            </Switch>
        </Router>
    )
}

export default App;