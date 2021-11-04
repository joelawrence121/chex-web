import http from "../config/http-common";
import OpeningRequest from "../types/OpeningRequest";
import PlayRequest from "../types/PlayRequest";

const headers = {
    headers: {
        credentials: 'include',
    }
}

const getSingleMatePuzzle = (puzzle_type: string) => {
    return http.get("/single_move/" + puzzle_type, headers);
};

const getMoveDescription = (request: OpeningRequest) => {
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


const ChapiService = {
    getSingleMatePuzzle,
    getMoveDescription,
    getStockfishMove,
    getStatistics,
    getMateInNPuzzle
}

export default ChapiService;