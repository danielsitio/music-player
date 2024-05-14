import Head from "next/head";
import { Inter } from "next/font/google";
import { GetStaticProps } from 'next'
import { ICommonTagsResult, IPicture } from "music-metadata";
import { useEffect, useState } from "react";
import Image from 'next/image'
import { getSongInfo, getSongMetadata } from "@/util/functions";
import { SongMetadata } from "@/util/types";

const inter = Inter({ subsets: ["latin"] });


type props = {
  songMetadata: SongMetadata,
}

export default function Home({ songMetadata }: props) {

  const { title, cover, duration } = songMetadata

  const [imgSrc, setImgSrc] = useState("")

  const imgData = songMetadata.cover.data

  useEffect(() => {
    let data: string = ""
    for (var i = 0; i < imgData.length; i++) {
      data += String.fromCharCode(imgData[i]);
    }

    setImgSrc(`data:${songMetadata.cover.format};base64,${btoa(data)}`)
    return () => {

    }
  }, [])


  return (
    <>
      <div>el titulo es {title}</div>
      <div>el la duracion es {duration}</div>
      <div>el formato de la imagen es {cover.format}</div>
      <Image src={imgSrc} alt="image" width={350} height={350} />
    </>)
}



export const getStaticProps = (async (context) => {

  const songMetadata = await getSongMetadata()

  return {
    props: {
      songMetadata: songMetadata
    }
  }
}) satisfies GetStaticProps<props>