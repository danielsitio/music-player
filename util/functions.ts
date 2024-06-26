import { parseFile } from "music-metadata"
import { Song } from "./types"
import { existsSync, readdirSync } from 'fs'
import { join, sep } from 'path'

export const getSongMetadata = async (songPath: string): Promise<Song> => {
    const { common, format } = await parseFile(songPath)

    const { title, album, artist } = common
    const { duration } = format

    const imageDataJson = JSON.stringify(common.picture![0].data)
    const imageData = JSON.parse(imageDataJson)["data"]
    return {
        filepath: songPath.split(sep).pop()!,
        title: title!,
        duration: duration!,
        album: album!,
        artist: artist!,
        cover: {
            format: "image/jpeg",
            data: btoa(parseImageData(imageData))
        }
    }
}
export const getAllSongsMetadata = async (): Promise<Song[]> => {

    let songsMetadata: Song[] = []
    let songFiles = findFiles("./public", ".mp3")
    for (const songFile of songFiles!) {
        const songMetadata = await getSongMetadata(songFile)
        songsMetadata.push(songMetadata)
    }
    return songsMetadata
}


const findFiles = (startPath: string, filter: string): string[] | undefined => {

    if (!existsSync(startPath)) return

    let files: string[] = []

    let filesFound = readdirSync(startPath);
    filesFound.forEach(fileFound => {
        let filename = join(startPath, fileFound)
        if (filename.endsWith(filter)) files.push(filename)
    })
    return files
};


const parseImageData = (imageData: number[]): string => {
    let data: string = ""
    for (let i = 0; i < imageData.length; i++) {
        data += String.fromCharCode(imageData[i]);
    }
    return data
}
