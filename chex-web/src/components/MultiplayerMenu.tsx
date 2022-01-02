import React from 'react';
import '../styles/AutoBoard.css';

import 'react-chat-widget/lib/styles.css';
import '../styles/MultiplayerBoard.css'

export enum MenuState {
    START, CREATING, JOINING, CREATE, JOIN, DONE, ERROR
}

interface MenuProps {
    menuState: MenuState
    setMenuState: (menuState: MenuState) => void
    setInputGameId: (gameId: string) => void
    setInputPlayerName: (playerName: string) => void
    inputGameId: string
    inputPlayerName: string
    errorMessage: string | undefined
}

function MultiplayerMenu(props: MenuProps) {

    const updateGameId = (e: React.ChangeEvent<HTMLInputElement>): void => {
        props.setInputGameId(e.target.value)
    }

    const updatePlayerName = (e: React.ChangeEvent<HTMLInputElement>): void => {
        props.setInputPlayerName(e.target.value)
    }

    function getMenu() {
        switch (props.menuState) {
            case MenuState.START:
                return <>
                    <button className="multiplayer-button" onClick={() => props.setMenuState(MenuState.CREATING)}>
                        Create new game
                    </button>
                    <br/><br/>
                    <button className="multiplayer-button" onClick={() => props.setMenuState(MenuState.JOINING)}>
                        Join game
                    </button>
                </>
            case MenuState.CREATING:
                return <>
                    <input
                        className="input-box"
                        placeholder="Type your name here..."
                        onChange={updatePlayerName}
                        value={props.inputPlayerName}/>
                    <button className="multiplayer-button" onClick={() => props.setMenuState(MenuState.CREATE)}>
                        Create
                    </button>
                </>
            case MenuState.JOINING:
                return <>
                    <input
                        className="input-box"
                        placeholder="Type your name here..."
                        onChange={updatePlayerName}
                        value={props.inputPlayerName}/>
                    <input
                        className="input-box"
                        placeholder="Type your game id here..."
                        onChange={updateGameId}
                        value={props.inputGameId}/>
                    <button className="multiplayer-button" onClick={() => props.setMenuState(MenuState.JOIN)}>
                        Join
                    </button>
                </>
            case MenuState.ERROR:
                return <>
                    <h2>{props.errorMessage}</h2>
                    <button className="multiplayer-button" onClick={() => props.setMenuState(MenuState.START)}>
                        Try again
                    </button>
                </>
            case MenuState.DONE:
                return <></>
        }
    }

    return (
        <>{getMenu()}</>
    )
}

export default MultiplayerMenu;

