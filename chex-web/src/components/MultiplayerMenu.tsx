import React from 'react';
import '../styles/AutoBoard.css';

import 'react-chat-widget/lib/styles.css';
import '../styles/MultiplayerBoard.css'

export enum MenuState {
    START, CREATING, JOINING, CREATE, JOIN, WAITING, PLAYING, ERROR,
    DRAW_OFFERED, DRAW_RECEIVED, DRAW_ACCEPTED, DRAW_REJECTED, RETIRE, RESET_DRAW, FINISHED
}

interface MenuProps {
    menuState: MenuState
    setMenuState: (menuState: MenuState) => void
    setInputGameId: (gameId: string) => void
    setInputPlayerName: (playerName: string) => void
    handleRetirement: () => void
    handleDrawAccepted: () => void
    handleDrawRejected: () => void
    otherPlayer: string
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
                props.setInputGameId("")
                return <>
                    <h2>{props.errorMessage}</h2>
                    <button className="multiplayer-button" onClick={() => props.setMenuState(MenuState.START)}>
                        Try again
                    </button>
                </>
            case MenuState.WAITING:
                return <></>
            case MenuState.PLAYING:
                return <>
                    <button className="multiplayer-button" onClick={() => props.handleRetirement()}>
                        Retire
                    </button>
                    <br/><br/>
                    <button className="multiplayer-button" onClick={() => props.setMenuState(MenuState.DRAW_OFFERED)}>
                        Offer Draw
                    </button>
                </>
            case MenuState.DRAW_OFFERED:
                return <>
                    <button className="multiplayer-button" onClick={() => props.handleRetirement()}>
                        Retire
                    </button>
                    <h2>Draw offered...</h2>
                </>
            case MenuState.DRAW_RECEIVED:
                return <>
                    <button className="multiplayer-button" onClick={() => props.handleRetirement()}>
                        Retire
                    </button>
                    <h2>{props.otherPlayer} offers a draw</h2>
                    <h2>Accept?</h2>
                    <button className="multiplayer-button" onClick={() => props.handleDrawAccepted()}>
                        Accept
                    </button>
                    <br/>
                    <button className="multiplayer-button" onClick={() => props.handleDrawRejected()}>
                        Reject
                    </button>
                </>
        }
    }

    return (
        <>{getMenu()}</>
    )
}

export default MultiplayerMenu;

