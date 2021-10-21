import SingleMovePuzzle from "./SingleMovePuzzle";
import React from "react";
import NavbarScroller from "./NavbarScroller";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

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
                    <h1>Commentary</h1>
                </Route>
                <Route path="/">
                    <NavbarScroller brand={brand} links={links}/>
                    <h1>Home</h1>
                </Route>
            </Switch>
        </Router>
    )
}

export default App;