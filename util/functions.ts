import { parseFile } from "music-metadata"
import { SongMetadata } from "./types"

export const getSongInfo = async () => {
    return parseFile("./assets/Mike Schpitz and Phys Edison - Sly & The Family Jones.mp3")
        .then(({ common }) => common)
}

export const getSongMetadata = async (): Promise<SongMetadata> => {
    const { common, format } = await parseFile("./assets/Mike Schpitz and Phys Edison - Sly & The Family Jones.mp3")
    const imageDataJson = JSON.stringify(common.picture![0].data)
    const imageData = JSON.parse(imageDataJson)["data"]
    return {
        title: common.title!,
        duration: format.duration!,
        cover: {
            format: common.picture![0].format,
            data: imageData
        }
    }
}