import http from "../config/http-common";
import OpeningRequest from "../types/OpeningRequest";
import PlayRequest from "../types/PlayRequest";

const getSingleMatePuzzle = (puzzle_type: string) => {
    return http.get("/single_move/" + puzzle_type);
};

const getMoveDescription = (request : OpeningRequest) => {
    return http.post("/description", request)
}

const getStockfishMove = (request : PlayRequest) => {
    console.log(request)
    return http.post("/play", request)
}

const ChapiService = {
    getSingleMatePuzzle,
    getMoveDescription,
    getStockfishMove
}

export default ChapiService;