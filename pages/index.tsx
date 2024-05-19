import { GetStaticProps } from 'next'
import { getAllSongsMetadata } from "@/util/functions";
import { Song } from "@/util/types";
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import styles from '@/styles/Home.module.css'

import Image from 'next/image'
import { MouseEventHandler } from 'react';


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
    <main className={styles.mainContainer}>

      <div className={styles.coverPart}>
        <img src={`data:${format};base64,${data}`} alt="image" width={350} height={350} />
      </div>

      <div className={styles.controls}>
        <div className={styles.topPart}>
          <div>00:{currentSongMinutes < 10 ? "0" + currentSongMinutes : currentSongMinutes}:{currentSongSeconds < 10 ? "0" + currentSongSeconds : currentSongSeconds}</div>
          <div className={styles.linetime} onClick={linetimeClickHandler}>
            <div style={{ left: proportionalCurrentTime + "%" }} className={styles.linetimeCurrentTimeIndicator} />
          </div>
          <div>00:0{Math.floor(duration / 60)}:{Math.floor(duration % 60)}</div>
        </div>
        <div className={styles.bottomPart}>
          <div className={styles.descriptionContainer}>
            <div>{title}</div>
            <div style={{ display: "flex" }}>
              <div>{artist}</div> - <div>{album}</div>
            </div>
          </div>
          <div>
            <button onClick={() => backwards(10)}>-10</button>
            <button onClick={controls.playPreviousSong}>prev</button>
            {
              state.isPlaying ? <button onClick={controls.pause}>pause</button> : <button onClick={controls.play}>play</button>
            }
            <button onClick={controls.playNextSong}>next</button>
            <button onClick={() => forward(10)}>+10</button>
            <button>loop</button>
          </div>
          <div>
            <button>info</button>
          </div>
        </div>
      </div>

      <audio ref={audioElementRef} autoPlay src={filepath} />
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