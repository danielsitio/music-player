import { GetStaticProps } from 'next'
import { getAllSongsMetadata } from "@/util/functions";
import { Song } from "@/util/types";
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import styles from '@/styles/Home.module.css'

import Image from 'next/image'


type props = {
  songs: Song[],
}

export default function Home({ songs }: props) {

  const [audioElementRef, { state, controls }] = useMusicPlayer(songs)

  return (
    <main className={styles.mainContainer}>
      <div className={styles.topPart}>
        <img src={`data:${state.currentSong.cover.format};base64,${state.currentSong.cover.data}`} alt="image" width={350} height={350} />
      </div>
      <div className='bottom-part'>
        <button onClick={controls.playPreviousSong}>prev</button>
        {
          state.isPlaying ? <button onClick={controls.pause}>pause</button> : <button onClick={controls.play}>play</button>
        }
        <button onClick={controls.playNextSong}>next</button>
      </div>
      <audio ref={audioElementRef} src={state.currentSong.filepath} autoPlay style={{ display: "none" }}></audio>
      <Image fill src={`data:${state.currentSong.cover.format};base64,${state.currentSong.cover.data}`} alt='' className={styles.backgroundCover} />
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