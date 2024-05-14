import { Inter } from "next/font/google";
import { GetStaticProps } from 'next'
import Image from 'next/image'
import { getAllSongsMetadata } from "@/util/functions";
import { SongMetadata } from "@/util/types";
import { useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });


type props = {
  songsMetadata: SongMetadata[],
}

export default function Home({ songsMetadata }: props) {

  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0)

  const playerControls = useRef<HTMLAudioElement>(null)

  const nextSong = () => {
    const nextSongIndex = currentSongIndex + 1
    if (songsMetadata[nextSongIndex]) setCurrentSongIndex(nextSongIndex)
  }
  const play = () => {
    playerControls.current?.play()
  }
  const pause = () => {
    playerControls.current?.pause()
  }

  return (
    <div>
      <audio ref={playerControls} autoPlay src={songsMetadata[currentSongIndex].filepath}></audio>
      <Image src={`data:${songsMetadata[currentSongIndex].cover.format};base64,${songsMetadata[currentSongIndex].cover.data}`} alt="image" width={350} height={350} />
      <button onClick={play}>play</button>
      <button onClick={pause}>pause</button>
      <button onClick={nextSong}>next</button>
    </div>
  )
}



export const getStaticProps = (async (context) => {

  const songMetadata = await getAllSongsMetadata()
  getAllSongsMetadata()
  return {
    props: {
      songsMetadata: songMetadata
    }
  }
}) satisfies GetStaticProps<props>