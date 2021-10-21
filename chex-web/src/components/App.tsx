import SingleMovePuzzle from "./SingleMovePuzzle";
import React from "react";
import NavbarScroller from "./NavbarScroller";

const navigation = {
    brand: { name: "Chexplanations", to: "/" },
    links: [
        { name: "Commentary", to: "/commentary" },
        { name: "Single Move Puzzles", to: "/puzzles" }
    ]
}

const App: React.FC = () => {
    const { brand, links } = navigation;
    return (
        <div className="App">
            <NavbarScroller brand={brand} links={links}/>
            <SingleMovePuzzle />
        </div>
    )
}

export default App;