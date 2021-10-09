import http from "../config/http-common";

const getSingleMatePuzzle = () => {
    return http.get("/single_move/MATE");
};

const ChapiService = {
    getSingleMatePuzzle
}

export default ChapiService;