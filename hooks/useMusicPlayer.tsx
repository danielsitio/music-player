import { roundWith1Decimal } from "@/util/frontend-functions"
import { Song } from "@/util/types"
import { useCallback, useState } from "react"


const a = {
  loop: true,
  getLoop: function () {
    return this
  }
}

export const useMusicPlayer = (playlist: Song[]): [(node: HTMLAudioElement) => void, Player] => {

  const [audioElement, setAudioElement] = useState<HTMLAudioElement | undefined>(undefined)

  const [playingFirstSong, setPlayingFirstSong] = useState(true)
  const [playingLastSong, setLastSong] = useState(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isRepeating, setIsRepeating] = useState<boolean>(false)
  const [isRandomized, setIsRandomized] = useState<boolean>(false)

  const [currentSongTime, setCurrentSongTime] = useState<number>(0)
  const [currentSongSeconds, setCurrentSongSeconds] = useState<number>(0)
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0)
  const [songIsPlaying, setSongIsPlaying] = useState<boolean>(false)
  const [bufferedContent, setBufferedContent] = useState<number>(0)

  const audioElementRef = useCallback((node: HTMLAudioElement | null) => {
    if (node !== null) {
      if (!audioElement) {
        setAudioElement(node)
        node.onplaying = () => setSongIsPlaying(true)
        node.onpause = () => setSongIsPlaying(false)
        const loopDescriptors = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "loop")
        const mutedDescriptors = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "muted")
        const currentTimeDescriptors = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "currentTime")
        Object.defineProperty(node, "loop", {
          get() {
            return loopDescriptors?.get?.call(node)
          },
          set(v) {
            setIsRepeating(v)
            loopDescriptors?.set?.call(node, v)
          },

        })

        Object.defineProperty(node, "muted", {
          get() {
            return mutedDescriptors?.get?.call(node)
          },
          set(v) {
            setIsMuted(v)
            return mutedDescriptors?.set?.call(node, v)
          },
        })
        Object.defineProperty(node, "currentTime", {
          get() {
            return currentTimeDescriptors?.get?.call(node)
          },
          set(v) {
            console.log("se esta cambiando el currenttime")
            currentTimeDescriptors?.set?.call(node, v)
          },
        })
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
    const roundedTime = Math.floor(newTime)
    setCurrentSongTime(newTime)
    if (roundedTime !== currentSongSeconds) setCurrentSongSeconds(roundedTime)
  }

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

  const forward = (seconds: number) => {
    if (audioElement!.currentTime + seconds >= playlist[currentSongIndex].duration) audioElement!.currentTime = playlist[currentSongIndex].duration - 1
    else audioElement!.currentTime = audioElement!.currentTime + seconds
  }
  const backwards = (seconds: number) => {
    if (audioElement!.currentTime - seconds <= 0) audioElement!.currentTime = 0
    else audioElement!.currentTime = audioElement!.currentTime - seconds
  }
  const toggleRandomize = () => setIsRandomized(!isRandomized)
  const play = () => audioElement?.play()
  const pause = () => audioElement?.pause()
  const loop = () => audioElement!.loop = true
  const unloop = () => audioElement!.loop = false
  const toggleLoop = () => audioElement!.loop = !audioElement!.loop
  const mute = () => audioElement!.muted = true
  const unmute = () => audioElement!.muted = false
  const playTime = (seconds: number) => {
    if (seconds <= 0) backwards(-1)
    else if (seconds >= playlist[currentSongIndex].duration) forward(9999)
    else audioElement!.currentTime = seconds
  }

  return [audioElementRef, {
    state: {
      currentSong: playlist[currentSongIndex],
      isPlaying: songIsPlaying,
      currentSongTime,
      currentSongSeconds,
      bufferedContent,
      muted: isMuted,
      looping: isRepeating,
      randomized: isRandomized,
      currentSongIndex
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
  currentSongSeconds: number
  currentSongIndex: number
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
