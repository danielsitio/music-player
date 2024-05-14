export type SongMetadata = {
    title: string
    duration: number
    cover: Image

}
export type Image = {
    format: string
    data: Array<number>
}