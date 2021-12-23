import React, {useEffect, useState} from 'react';
import '../styles/AutoBoard.css';
import {Message} from "../types/MultiplayerTypes";
import {addResponseMessage, addUserMessage, deleteMessages, Widget} from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';
import '../styles/MultiplayerBoard.css'
import ChapiService from "../service/ChapiService";

interface ChatProps {
    messages: Message[]
    player: string
    gameId: string | undefined
}

function MultiplayerChat(props: ChatProps) {

    const [previousMessages, setPreviousMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState<string>()

    // update with new messages
    useEffect(() => {
        for (let i = previousMessages.length; i < props.messages.length; i++) {
            if (props.messages[i].player === props.player) {
                addUserMessage(props.messages[i].message)
            } else {
                addResponseMessage(props.messages[i].message);
            }
        }
        setPreviousMessages(props.messages.slice())
    }, [props.messages]);

    // send new message
    useEffect(() => {
        if (newMessage && props.gameId) {
            ChapiService.postMultiplayerMessage({
                player_name: props.player,
                message: newMessage,
                game_id: props.gameId
            })
        }
    }, [newMessage])

    const handleNewUserMessage = (newMessage: string) => {
        setNewMessage(newMessage)
        deleteMessages(1)
    };

    return (
        <>
            <Widget
                title={"Chat"}
                subtitle={''}
                showTimeStamp={false}
                handleNewUserMessage={handleNewUserMessage}
            />
        </>
    )
}

export default MultiplayerChat;

