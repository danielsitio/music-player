// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ICommonTagsResult, parseFile } from 'music-metadata'

type Song = {
  title: string
  duration: number,
}
type a = ICommonTagsResult

export default function handler(req: NextApiRequest, res: NextApiResponse<ICommonTagsResult>) {
  parseFile("./assets/Mike Schpitz and Phys Edison - Sly & The Family Jones.mp3", { duration: true })
    .then(({ common, format, native, quality }) => {
      const { duration, } = format
      const { title, album, picture } = common!
      res.status(200).json(common!)
    })
    .catch(e => console.log("error : " + e.message))
}
