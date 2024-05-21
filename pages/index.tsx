import { GetStaticProps } from 'next'
import { getAllSongsMetadata } from "@/util/functions";
import { Song } from "@/util/types";
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import styles from '@/styles/Home.module.css'
import { MouseEventHandler } from 'react';

import { Inter } from 'next/font/google'


import { FaRegCirclePlay, FaRegCirclePause } from "react-icons/fa6";
import { IoIosFastforward, IoIosRewind, IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";




const inter = Inter({ subsets: ["latin"] })


type props = {
  songs: Song[],
}

export default function Home({ songs }: props) {

  const [audioElementRef, { state, controls }] = useMusicPlayer(songs)

  const { currentSong, currentSongTime, bufferedContent } = state
  const { artist, title, album, cover, filepath, duration } = currentSong
  const { format, data } = cover

  const { backwards, forward, playTime } = controls

  const currentSongSeconds = Math.floor(currentSongTime % 60)
  const currentSongMinutes = Math.floor(currentSongTime / 60)

  const proportionalCurrentTime = Math.floor((currentSongTime * 100) / duration)

  const linetimeClickHandler: MouseEventHandler = (event) => {
    const element = event.target as HTMLDivElement
    const startPoint = element.getBoundingClientRect().left
    const endPoint = element.getBoundingClientRect().left + element.getBoundingClientRect().width
    const distanceFromStartToEnd = endPoint - startPoint
    const distanceClickedFromStartPoint = event.clientX - startPoint
    const porcentualTimeClicked = Math.floor((distanceClickedFromStartPoint * 100) / distanceFromStartToEnd)
    console.log("el tiempo porcentual es " + porcentualTimeClicked + " y la duracion es " + duration)
    const timeClicked = Math.floor((duration / 100) * porcentualTimeClicked)
    playTime(timeClicked)
  }

  return (
    <main className={`${styles.mainContainer} ${inter.className}`}>

      <div className={styles.coverPart}>
        <img className={styles.cover} src={`data:${format};base64,${data}`} alt="image" />
      </div>

      <div className={styles.controls}>

        <div className={styles.topPart}>
          <div className={styles.currentTime}>00:{currentSongMinutes < 10 ? "0" + currentSongMinutes : currentSongMinutes}:{currentSongSeconds < 10 ? "0" + currentSongSeconds : currentSongSeconds}</div>
          <div className={styles.linetime} onClick={linetimeClickHandler}>
            <div style={{ left: proportionalCurrentTime + "%" }} className={styles.linetimeCurrentTimeIndicator} />
          </div>
          <div className={styles.duration}>00:0{Math.floor(duration / 60)}:{Math.floor(duration % 60)}</div>
        </div>

        <div className={styles.bottomPart}>

          <div className={styles.descriptionContainer}>
            <div className={styles.title}>{title}</div>
            <div className={styles.artistAlbum}>
              <div>{artist + " ⋅ " + album}</div>
            </div>
          </div>

          <div className={styles.controlButtons}>
            <IoMdSkipBackward size={20} onClick={controls.playPreviousSong} />
            <IoIosRewind size={25} onClick={() => backwards(10)} />
            {
              state.isPlaying ? <FaRegCirclePause size={45} onClick={controls.pause} /> : <FaRegCirclePlay size={45} onClick={controls.play} />
            }
            <IoIosFastforward size={25} onClick={() => forward(10)} />
            <IoMdSkipForward size={20} onClick={controls.playNextSong} />

          </div>

          <div className={styles.optionButtons}>
            <button>info</button>
            <button>screen</button>
            <button>volume</button>
          </div>
        </div>
      </div>

      <audio ref={audioElementRef} autoPlay src={filepath} muted />
      <img src={`data:${format};base64,${data}`} alt='' className={styles.backgroundCover} />
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