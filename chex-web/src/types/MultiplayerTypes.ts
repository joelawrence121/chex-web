import DescriptionData from "./DescriptionData";

export interface MultiplayerCreateRequest {
    player_name: string
}

export interface MultiplayerJoinRequest {
    player_name: string,
    game_id: string,
}

export interface MultiplayerMessageRequest {
    player_name: string,
    game_id: string,
    message: string
}

export interface MultiplayerPlayRequest {
    game_id: string,
    move: string,
    descriptions_on: boolean
}

export interface MultiplayerDrawRequest {
    game_id: string,
    draw_accepted: boolean
}

export interface Message {
    player: string,
    message: string
}

export default interface GameData {
    game_id: string,
    state: string,
    player_one: string,
    player_two: string,
    fen: string,
    turn: string,
    winner: string,
    fen_stack: string[],
    move_stack: string[],
    score_stack: number[],
    messages: Message[],
    message: string,
    draw_offered: boolean
    draw_response: string
    retired: boolean
    player_retired: string
    white_descriptions: DescriptionData[] | undefined
    black_descriptions: DescriptionData[] | undefined
}