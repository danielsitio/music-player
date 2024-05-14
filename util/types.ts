export type SongMetadata = {
    filepath: string
    title: string
    duration: number
    cover: Image

}
export type Image = {
    format: string
    data: string
}