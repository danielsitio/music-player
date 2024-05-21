import { roundWith1Decimal } from "@/util/frontend-functions"
import { Song } from "@/util/types"
import { useCallback, useState } from "react"

export const useMusicPlayer = (playlist: Song[]): [(node: HTMLAudioElement) => void, Player] => {

  const [audioElement, setAudioElement] = useState<HTMLAudioElement | undefined>(undefined)

  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isRepeating, setIsRepeating] = useState<boolean>(false)
  const [isRandomized, setIsRandomized] = useState<boolean>(false)

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
        setIsMuted(node.muted)
        setIsRepeating(node.loop)
        node.pause()
      }
      node.ontimeupdate = () => timeUpdateHandler(node)
    }
  }, [currentSongIndex])

  const timeUpdateHandler = (audioElement: HTMLAudioElement) => {
    if (Math.floor(audioElement.currentTime) === Math.floor(playlist[currentSongIndex].duration) && audioElement.loop === false) setNextSong()
    updateCurrentSongTime(audioElement.currentTime)
  }
  const updateCurrentSongTime = (newTime: number) => {
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

  const randomize = () => setIsRandomized(true)
  const unrandomize = () => setIsRandomized(false)
  const toggleRandomize = () => setIsRandomized(!isRandomized)

  const play = () => audioElement?.play()
  const pause = () => audioElement?.pause()
  const loop = () => {
    audioElement!.loop = true
    setIsRepeating(true)
  }
  const unloop = () => {
    audioElement!.loop = false
    setIsRepeating(false)
  }
  const toggleLoop = () => {
    setIsRepeating(!audioElement!.loop)
    audioElement!.loop = !audioElement!.loop
  }
  const mute = () => {
    audioElement!.muted = true
    setIsMuted(true)
  }
  const unmute = () => {
    audioElement!.muted = false
    setIsMuted(false)
  }
  const playTime = (seconds: number) => {
    if (seconds >= 0 && seconds <= playlist[currentSongIndex].duration) audioElement!.currentTime = seconds
  }

  return [audioElementRef, {
    state: {
      currentSong: playlist[currentSongIndex],
      isPlaying: songIsPlaying,
      currentSongTime,
      bufferedContent,
      muted: isMuted,
      looping: isRepeating,
      randomized: isRandomized
    },
    controls: {
      play,
      pause,
      playNextSong: setNextSong,
      playPreviousSong: setPreviousSong,
      playTime,
      forward,
      backwards,
      mute,
      unmute,
      loop,
      unloop,
      toggleLoop,
      toggleRandomize
    }
  }]
}

type PlayerState = {
  currentSongTime: number
  isPlaying: boolean
  currentSong: Song,
  bufferedContent: number
  muted: boolean
  looping: boolean
  randomized: boolean
}
type PlayerControls = {
  play: () => void
  pause: () => void
  playNextSong: () => void
  playPreviousSong: () => void
  playTime: (seconds: number) => void
  forward: (seconds: number) => void
  backwards: (seconds: number) => void
  mute: () => void
  unmute: () => void
  loop: () => void
  unloop: () => void
  toggleLoop: () => void
  toggleRandomize: () => void
}
type Player = {
  state: PlayerState
  controls: PlayerControls
}
