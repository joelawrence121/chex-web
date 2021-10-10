import http from "../config/http-common";

const getSingleMatePuzzle = (puzzle_type: string) => {
    return http.get("/single_move/" + puzzle_type);
};

const ChapiService = {
    getSingleMatePuzzle
}

export default ChapiService;