export type Song = {
    filepath: string
    title: string
    duration: number
    cover: Image
    album: string
    artist: string
}
export type Image = {
    format: string
    data: string
}