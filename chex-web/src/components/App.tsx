import SingleMovePuzzle from "./SingleMovePuzzle";
import React from "react";
import NavbarScroller from "./NavbarScroller";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import CommentaryBox from "./CommentaryBox";
import Home from "./Home";
import MatePuzzle from "./MatePuzzle";

const navigation = {
    brand: {name: "Chexplanations", to: "/"},
    links: [
        {name: "Commentary", to: "/commentary"},
        {name: "Single Move Puzzles", to: "/puzzles"},
        {name: "Mate in N", to: "/mate"}
    ]
}

const App: React.FC = () => {
    const {brand, links} = navigation;
    return (
        <Router>
            <Switch>
                <Route path="/puzzles">
                    <NavbarScroller brand={brand} links={links}/>
                    <SingleMovePuzzle/>
                </Route>
                <Route path="/commentary">
                    <NavbarScroller brand={brand} links={links}/>
                    <CommentaryBox/>
                </Route>
                <Route path="/mate">
                    <NavbarScroller brand={brand} links={links}/>
                    <MatePuzzle/>
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