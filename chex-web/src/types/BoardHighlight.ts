const normal = () => {
    return [{backgroundColor: '#a1c3f5'}, {backgroundColor: '#365992'}]
}

const userWinner = () => {
    return [{backgroundColor: '#80ff80'}, {backgroundColor: '#3ba62f'}]
}

const stockfishWinner = () => {
    return [{backgroundColor: '#b0abf3'}, {backgroundColor: '#702fa6'}]
}

const BoardHighlight = {
    normal,
    userWinner,
    stockfishWinner
}

export default BoardHighlight;