import { GetStaticProps } from 'next'
import Image from 'next/image'
import { getAllSongsMetadata } from "@/util/functions";
import { Song } from "@/util/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';



type props = {
  songs: Song[],
}

export default function Home({ songs }: props) {

  const [audioElementRef, { state, controls }] = useMusicPlayer(songs)

  return (
    <div>
      <audio ref={audioElementRef} src={state.currentSong.filepath} autoPlay></audio>
      <span>{state.currentSong.title}</span>
      <img src={`data:${state.currentSong.cover.format};base64,${state.currentSong.cover.data}`} alt="image" width={350} height={350} />
      <button onClick={controls.playPreviousSong}>prev</button>
      {
        state.isPlaying ? <button onClick={controls.pause}>pause</button> : <button onClick={controls.play}>play</button>
      }
      <button onClick={controls.playNextSong}>next</button>
    </div>
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