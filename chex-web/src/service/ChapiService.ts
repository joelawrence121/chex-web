import http from "../config/http-common";
import OpeningRequest from "../types/OpeningRequest";

const getSingleMatePuzzle = (puzzle_type: string) => {
    return http.get("/single_move/" + puzzle_type);
};

const getMoveDescription = (request : OpeningRequest) => {
    return http.post("/description", request)
}

const ChapiService = {
    getSingleMatePuzzle,
    getMoveDescription
}

export default ChapiService;