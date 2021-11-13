export default interface SinglePuzzleData {
    id?: any | null,
    gain: number,
    starting_fen: string,
    ending_fen: string,
    type: string,
    move: string,
    to_move: string,
    follow_move: string
}