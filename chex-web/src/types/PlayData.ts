export default interface PlayData {
    id: string
    fen: string,
    move: string | undefined,
    winner: string | undefined
    score: number | undefined
}