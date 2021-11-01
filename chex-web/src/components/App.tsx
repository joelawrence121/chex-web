import SingleMovePuzzle from "./SingleMovePuzzle";
import React from "react";
import NavbarScroller from "./NavbarScroller";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import CommentaryBox from "./CommentaryBox";
import Home from "./Home";

const navigation = {
    brand: {name: "Chexplanations", to: "/"},
    links: [
        {name: "Commentary", to: "/commentary"},
        {name: "Single Move Puzzles", to: "/puzzles"}
    ]
}

const App: React.FC = () => {
    const {brand, links} = navigation;
    return (
        <Router>
            <Switch>
                <Route path="/puzzles">
                    <div className="App">
                        <NavbarScroller brand={brand} links={links}/>
                        <SingleMovePuzzle/>
                    </div>
                </Route>
                <Route path="/commentary">
                    <NavbarScroller brand={brand} links={links}/>
                    <CommentaryBox />
                </Route>
                <Route path="/">
                    <NavbarScroller brand={brand} links={links}/>
                    <Home />
                </Route>
            </Switch>
        </Router>
    )
}

export default App;