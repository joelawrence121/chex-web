export default interface DescriptionRequest {
    user: string,
    moveStack: string[],
    move: string | undefined,
    fen: string,
    fenStack: string[]
}