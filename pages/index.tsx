import { Inter } from "next/font/google";
import { GetStaticProps } from 'next'
import { useEffect, useState } from "react";
import Image from 'next/image'
import { getAllSongsMetadata } from "@/util/functions";
import { SongMetadata } from "@/util/types";

const inter = Inter({ subsets: ["latin"] });


type props = {
  songsMetadata: SongMetadata[],
}

export default function Home({ songsMetadata }: props) {

  const [imgSrc, setImgSrc] = useState("")

  useEffect(() => {

    /* let data = parseImageData(songsMetadata[0].cover!.data)

    setImgSrc(`data:${songsMetadata[0].cover!.format};base64,${btoa(data)}`) */
    return () => {

    }
  }, [])


  return (
    <>
      {
        songsMetadata.map(({ filepath, title, duration, cover }) =>
          <div>
            <h1>{title}</h1>
            <Image src={`data:${cover.format};base64,${cover.data}`} alt="image" width={350} height={350} />
          </div>
        )
      }
    </>)
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


const parseImageData = (imageData: number[]): string => {
  let data: string = ""
  for (let i = 0; i < imageData.length; i++) {
    data += String.fromCharCode(imageData[i]);
  }
  return data
}