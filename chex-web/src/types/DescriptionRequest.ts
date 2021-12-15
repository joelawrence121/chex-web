export default interface DescriptionRequest {
    user: string,
    moveStack: string[],
    uci: string | undefined,
    fen: string,
    fenStack: string[]
}