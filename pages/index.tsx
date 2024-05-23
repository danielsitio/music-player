import { GetStaticProps } from 'next'
import { getAllSongsMetadata } from "@/util/functions";
import { Song } from "@/util/types";
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import styles from '@/styles/Home.module.css'
import { MouseEventHandler } from 'react';

import { Inter } from 'next/font/google'


import { FaRegCirclePlay, FaRegCirclePause } from "react-icons/fa6";
import { IoMdSkipBackward, IoMdSkipForward, IoMdInformationCircleOutline, IoMdExpand, IoMdVolumeHigh, IoMdVolumeOff, IoMdRewind, IoMdFastforward, IoMdRepeat, IoMdShuffle } from "react-icons/io";
import { motion } from 'framer-motion';




const inter = Inter({ subsets: ["latin"] })


type props = {
  songs: Song[],
}

export default function Home({ songs }: props) {

  const [audioElementRef, { state, controls }] = useMusicPlayer(songs)

  const { currentSong, currentSongTime, currentSongSeconds, muted, looping, randomized, currentSongIndex } = state
  const { artist, title, album, cover, filepath, duration } = currentSong
  const { format, data } = cover

  const { backwards, forward, playTime, mute, unmute, playNextSong, playPreviousSong, toggleLoop, toggleRandomize } = controls

  const songsSeconds = Math.floor(currentSongSeconds % 60)
  const currentSongMinutes = Math.floor(currentSongSeconds / 60)

  const proportionalCurrentTime = (currentSongTime * 100) / duration

  const linetimeClickHandler: MouseEventHandler = (event) => {
    const element = event.target as HTMLDivElement
    const startPoint = element.getBoundingClientRect().left
    const endPoint = element.getBoundingClientRect().left + element.getBoundingClientRect().width
    const distanceFromStartToEnd = endPoint - startPoint
    const distanceClickedFromStartPoint = event.clientX - startPoint
    const porcentualTimeClicked = (distanceClickedFromStartPoint * 100) / distanceFromStartToEnd
    console.log("el tiempo porcentual del click es " + porcentualTimeClicked + " y la del tiempo es " + proportionalCurrentTime)
    const timeClicked = (duration / 100) * porcentualTimeClicked
    playTime(timeClicked)
  }

  return (
    <main className={`${styles.mainContainer} ${inter.className}`}>

      <div className={styles.coverPart}>
        <img className={styles.cover} src={`data:${format};base64,${data}`} alt="image" />
      </div>

      <div className={styles.controls}>

        <div className={styles.topPart}>
          <div className={styles.currentTime}>00:{currentSongMinutes < 10 ? "0" + currentSongMinutes : currentSongMinutes}:{songsSeconds < 10 ? "0" + songsSeconds : songsSeconds}</div>
          <div className={styles.linetime} onClick={linetimeClickHandler}>
            <motion.div transition={{ duration: 1, ease: "linear" }} style={{ left: proportionalCurrentTime + "%" }} className={styles.linetimeCurrentTimeIndicator} />
          </div>
          <div className={styles.duration}>00:0{Math.floor(duration / 60)}:{Math.floor(duration % 60)}</div>
        </div>

        <div className={styles.bottomPart}>

          <div className={styles.descriptionContainer}>
            <div className={styles.title}>{title}</div>
            <div>
              <div><p className={styles.artistAlbum}>{artist + " ⋅ " + album}</p></div>
            </div>
          </div>

          <div className={styles.controlButtons}>
            <IoMdShuffle className={`${styles.icon} ${randomized ? "" : styles.iconInactive}`} onClick={toggleRandomize} size={18} />
            <IoMdSkipBackward className={`${styles.icon} ${currentSongIndex === 0 ? styles.iconInactive : ""}`} size={18} onClick={playPreviousSong} />
            <IoMdRewind className={`${styles.icon}`} size={18} onClick={() => backwards(10)} />
            {
              state.isPlaying ? <FaRegCirclePause size={45} onClick={controls.pause} /> : <FaRegCirclePlay size={45} onClick={controls.play} />
            }
            <IoMdFastforward className={`${styles.icon}`} size={18} onClick={() => forward(10)} />
            <IoMdSkipForward className={`${styles.icon} ${currentSongIndex === songs.length - 1 ? styles.iconInactive : ""}`} size={18} onClick={playNextSong} />
            <IoMdRepeat className={`${styles.icon} ${looping ? "" : styles.iconInactive}`} onClick={toggleLoop} size={18} />

          </div>

          <div className={styles.optionButtons}>
            {
              muted ? <IoMdVolumeOff className={`${styles.icon}`} onClick={unmute} size={18} /> : <IoMdVolumeHigh className={`${styles.icon}`} onClick={mute} size={18} />
            }
            <IoMdInformationCircleOutline className={`${styles.icon}`} size={18} />
            <IoMdExpand className={`${styles.icon}`} size={18} />
          </div>
        </div>
      </div>

      <audio ref={audioElementRef} autoPlay src={filepath} />
      <img src={`data:${format};base64,${data}`} alt='' className={styles.backgroundCover} />
      <div className={styles.modal}></div>
    </main>
  )
}






export const getStaticProps = (async (context) => {

  const songMetadata = await getAllSongsMetadata()
  getAllSongsMetadata()
  return {
    props: {
      songs: songMetadata
    }
  }
}) satisfies GetStaticProps<props>