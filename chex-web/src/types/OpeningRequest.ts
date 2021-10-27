export default interface OpeningRequest {
    user: string,
    moveStack: string[],
    move: string | undefined,
    fen: string
}