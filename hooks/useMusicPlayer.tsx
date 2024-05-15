import { Song } from "@/util/types"
import { useCallback, useState } from "react"

export const useMusicPlayer = (playlist: Song[]): [(node: HTMLAudioElement) => void, Player] => {

  const [audioElement, setAudioElement] = useState<HTMLAudioElement | undefined>(undefined)


  const [currentSongTime, setCurrentSongTime] = useState<number>(0)
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0)
  const [songIsPlaying, setSongIsPlaying] = useState<boolean>(false)

  const audioElementRef = useCallback((node: HTMLAudioElement | null) => {
    if (node !== null) {
      setAudioElement(node)
      node.onplaying = () => setSongIsPlaying(true)
      node.onpause = () => setSongIsPlaying(false)
    }
  }, [])

  const setSong = (songIndex: number) => {
    if (playlist[songIndex]) setCurrentSongIndex(songIndex)
  }

  const setNextSong = () => {
    const nextSongIndex = currentSongIndex + 1
    if (playlist[nextSongIndex]) setCurrentSongIndex(nextSongIndex)
  }

  const setPreviousSong = () => {
    const previousSongIndex = currentSongIndex - 1
    if (playlist[previousSongIndex]) setCurrentSongIndex(previousSongIndex)
  }

  const play = () => {
    audioElement?.play()
  }
  const pause = () => {
    audioElement?.pause()
  }
  <audio src={playlist[0].filepath}></audio>

  return [audioElementRef, {
    state: {
      currentSong: playlist[currentSongIndex],
      isPlaying: songIsPlaying,
      currentSongTime
    },
    controls: {
      play,
      pause,
      playNextSong: setNextSong,
      playPreviousSong: setPreviousSong
    }
  }]
}

type PlayerState = {
  currentSongTime: number
  isPlaying: boolean
  currentSong: Song
}
type PlayerControls = {
  play: () => void
  pause: () => void
  playNextSong: () => void
  playPreviousSong: () => void
}
type Player = {
  state: PlayerState
  controls: PlayerControls
}
