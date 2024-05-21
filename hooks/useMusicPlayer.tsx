import { roundWith1Decimal } from "@/util/frontend-functions"
import { Song } from "@/util/types"
import { useCallback, useState } from "react"

export const useMusicPlayer = (playlist: Song[]): [(node: HTMLAudioElement) => void, Player] => {

  const [audioElement, setAudioElement] = useState<HTMLAudioElement | undefined>(undefined)


  const [currentSongTime, setCurrentSongTime] = useState<number>(0)
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0)
  const [songIsPlaying, setSongIsPlaying] = useState<boolean>(false)
  const [bufferedContent, setBufferedContent] = useState<number>(0)

  const audioElementRef = useCallback((node: HTMLAudioElement | null) => {
    if (node !== null) {
      if (!audioElement) {
        setAudioElement(node)
        node.onplaying = () => setSongIsPlaying(true)
        node.onpause = () => setSongIsPlaying(false)
      }
      console.log(Math.round(playlist[currentSongIndex].duration * 10) / 10)
      node.ontimeupdate = () => updateCurrentSongTime(node.currentTime)
    }
  }, [currentSongIndex])


  const updateCurrentSongTime = (newTime: number) => {
    if (Math.floor(newTime) === Math.floor(playlist[currentSongIndex].duration)) setNextSong()
    const roundedNewTime = Math.floor(newTime)
    if (roundedNewTime !== currentSongTime) setCurrentSongTime(roundedNewTime)
  }

  const setSong = (songIndex: number) => {
    if (playlist[songIndex]) setCurrentSongIndex(songIndex)
  }

  const setNextSong = () => {
    const nextSongIndex = currentSongIndex + 1
    if (playlist[nextSongIndex]) {
      setCurrentSongIndex(nextSongIndex)
      setCurrentSongTime(0)
    }
  }

  const setPreviousSong = () => {
    const previousSongIndex = currentSongIndex - 1
    if (playlist[previousSongIndex]) {
      setCurrentSongIndex(previousSongIndex)
      setCurrentSongTime(0)
    }
  }

  const forward = (seconds: number) => audioElement!.currentTime = audioElement!.currentTime + seconds
  const backwards = (seconds: number) => audioElement!.currentTime = audioElement!.currentTime - seconds

  const play = () => {
    audioElement?.play()
  }
  const pause = () => {
    audioElement?.pause()
  }
  const playTime = (seconds: number) => {
    if (seconds >= 0 && seconds <= playlist[currentSongIndex].duration) audioElement!.currentTime = seconds
  }
  <audio src={playlist[0].filepath}></audio>

  return [audioElementRef, {
    state: {
      currentSong: playlist[currentSongIndex],
      isPlaying: songIsPlaying,
      currentSongTime,
      bufferedContent
    },
    controls: {
      play,
      pause,
      playNextSong: setNextSong,
      playPreviousSong: setPreviousSong,
      playTime,
      forward,
      backwards
    }
  }]
}

type PlayerState = {
  currentSongTime: number
  isPlaying: boolean
  currentSong: Song,
  bufferedContent: number
}
type PlayerControls = {
  play: () => void
  pause: () => void
  playNextSong: () => void
  playPreviousSong: () => void
  playTime: (seconds: number) => void
  forward: (seconds: number) => void
  backwards: (seconds: number) => void
}
type Player = {
  state: PlayerState
  controls: PlayerControls
}
