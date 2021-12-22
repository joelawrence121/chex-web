import http from "../config/http-common";
import DescriptionRequest from "../types/DescriptionRequest";
import PlayRequest from "../types/PlayRequest";
import AggregationRequest from "../types/AggregationRequest";
import axios from "axios";
import OpeningMoveStackRequest from "../types/OpeningMoveStackRequest";
import {MultiplayerCreateRequest, MultiplayerJoinRequest, MultiplayerMessageRequest} from "../types/MultiplayerTypes";

const headers = {
    headers: {
        credentials: 'include',
    }
}

const getSingleMatePuzzle = (puzzle_type: string) => {
    return http.get("/single_move/" + puzzle_type, headers);
};

const getMoveDescription = (request: DescriptionRequest) => {
    return http.post("/description", request, headers)
}

const getStockfishMove = (request: PlayRequest) => {
    return http.post("/play", request, headers)
}

const getStatistics = () => {
    return http.get("/statistics", headers)
}

const getMateInNPuzzle = (n: number) => {
    return http.get("/mate_in/" + n, headers);
};

const getDescriptionAggregation = (request: AggregationRequest) => {
    return axios.create({
        baseURL: "http://127.0.0.1:5005/",
        headers: {
            "Content-type": "application/json"
        }
    }).post("/aggregation", request, headers);
}

const getRandomOpening = () => {
    return http.get("/random_opening", headers);
};

const getOpeningById = (id: number) => {
    return http.get("/opening/" + id, headers);
};

const getOpeningByMoveStack = (openingByMoveStackRequest: OpeningMoveStackRequest) => {
    return http.post("/opening", openingByMoveStackRequest, headers);
};

const createNewMultiplayerGame = (multiplayerCreateRequest: MultiplayerCreateRequest) => {
    return http.post("/multiplayer/create", multiplayerCreateRequest, headers);
};

const joinMultiplayerGame = (multiplayerJoinRequest: MultiplayerJoinRequest) => {
    return http.post("/multiplayer/join", multiplayerJoinRequest, headers);
};

const postMultiplayerMessage = (multiplayerMessageRequest: MultiplayerMessageRequest) => {
    return http.post("/multiplayer/message", multiplayerMessageRequest, headers);
};

const pollMultiplayerGame = (multiplayerPollRequest: MultiplayerJoinRequest) => {
    return http.post("/multiplayer/poll", multiplayerPollRequest, headers);
};

const ChapiService = {
    getSingleMatePuzzle,
    getMoveDescription,
    getStockfishMove,
    getStatistics,
    getMateInNPuzzle,
    getDescriptionAggregation,
    getRandomOpening,
    getOpeningById,
    getOpeningByMoveStack,
    createNewMultiplayerGame,
    joinMultiplayerGame,
    postMultiplayerMessage,
    pollMultiplayerGame
}

export default ChapiService;