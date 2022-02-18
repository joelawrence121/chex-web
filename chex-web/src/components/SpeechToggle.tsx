import React from "react";
import SpeechMode from "../types/SpeechMode";
import audio from "./icons/audio.png";
import mute from "./icons/mute.png";

interface SpeechToggleProps {
    speechMode: SpeechMode
    setSpeechMode: (speechMode: SpeechMode) => void
    setSpeechText: (speechText: string) => void
}

function SpeechToggle(props: SpeechToggleProps) {

    const speechModes = [SpeechMode.OFF, SpeechMode.MOVES, SpeechMode.DESCRIPTIONS, SpeechMode.FULL];

    function toggleSpeechMode() {
        const nextMode = speechModes[(speechModes.indexOf(props.speechMode) + 1) % speechModes.length]
        speechSynthesis.cancel()
        if (nextMode != SpeechMode.OFF) {
            props.setSpeechText(nextMode.valueOf())
        }
        props.setSpeechMode(nextMode)
    }

    return (
        <>
            <img onClick={toggleSpeechMode} className="tiny" src={props.speechMode != SpeechMode.OFF ? audio : mute}
               alt="Enable Sound"/>
            <p className="config-desc">{props.speechMode.valueOf()}</p>
        </>
    )
}

export default SpeechToggle;