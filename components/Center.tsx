import React, { useEffect, useState } from 'react'

import { ChevronDownIcon } from '@heroicons/react/outline'

import { signOut, useSession } from 'next-auth/react'

import {shuffle} from 'lodash'

import { useRecoilState } from 'recoil'
import { playListState, playListIdState } from '../atoms/playListAtom'

import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
]

function Center() {
  const {data:session} = useSession()
  const spotifyApi = useSpotify()
  const [color,setColor] = useState<string|undefined>(undefined)
  const [playListId] = useRecoilState(playListIdState)
  const [playList, setPlayList ]= useRecoilState<SpotifyApi.SinglePlaylistResponse|null>(playListState)

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playListId])

  useEffect(() => {
    spotifyApi.getPlaylist(playListId)
      .then((data) => setPlayList(data.body))
      .catch((err)=> console.log("something went wrong", err))
  }, [spotifyApi, playListId])

  console.log(playList)

  return (
    <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
      <header className='absolute top-5 right-8'>
        <div className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white' onClick={()=> signOut()}>
          <img className='rounded-full w-10 h-10' src={session?.user?.image ?? undefined} alt="" />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className='h-5 w-5'/>
        </div>
      </header>

      <section className={`flex items-end space-x-7 bg-gradient-to-b to black ${color} h-80 text-white p-8`}>
        <img className='h-44 w-44 shadow-2xl' src={playList?.images?.[0]?.url || undefined} alt="" />
        <div>
          <p>PLAYLIST</p>
          <h2 className='text-2xl md:text-3xl xl:text-5xl'>{playList?.name}</h2>
        </div>
      </section>

      <div>
        <Songs/>
      </div>
    </div>
  )
}

export default Center