import React, { useEffect, useState } from 'react'

import {HomeIcon,SearchIcon, LibraryIcon, PlusCircleIcon, RssIcon} from '@heroicons/react/outline'

import {HeartIcon} from '@heroicons/react/solid'

import {useSession} from 'next-auth/react'

import useSpotify from '../hooks/useSpotify'

import { useRecoilState } from 'recoil'
import { playListIdState } from '../atoms/playListAtom'


function Sidebar() {
    const spotifyApi = useSpotify()
    const {data: session } = useSession()
    const [playLists, setPlayLists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([])
    const [playListId, setPlayListId] = useRecoilState(playListIdState)

    useEffect(() => {
        if(spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                setPlayLists(data.body.items)
            })
        }
    }, [session, spotifyApi])

    useEffect(()=> console.log(playListId), [playListId])

    return (
    <div className='text-gray-500 p-5 text-xm lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-45'>
        <div className='space-y-4'>
            <button className='flex item-center space-x-2 hover:text-white'>
                <HomeIcon className="h-5 w-5" />
                <p>Home</p>
            </button>
            <button className='flex item-center space-x-2 hover:text-white '>
                <SearchIcon className="h-5 w-5" />
                <p>Search</p>
            </button>
            <button className='flex item-center space-x-2 hover:text-white '>
                <LibraryIcon className="h-5 w-5" />
                <p>Your Library</p>
            </button>

            <hr className='border-t-[0.1px] border-gray-900' />

            <button className='flex item-center space-x-2 hover:text-white'>
                <PlusCircleIcon className="h-5 w-5" />
                <p>Create Playlist</p>
            </button>
            <button className='flex item-center space-x-2 hover:text-white '>
                <HeartIcon className="h-5 w-5 text-red-500" />
                <p>Liked Songs</p>
            </button>
            <button className='flex item-center space-x-2 hover:text-white '>
                <RssIcon className="h-5 w-5 text-green-500" />
                <p>Your episodes</p>
            </button>

            <hr className='border-t-[0.1px] border-gray-900' />

            { playLists.map((p) => (
                <p key={p.id}
                className='cursor-pointer hover:text-white'
                onClick={() => setPlayListId(p.id)} >
                    {p.name}
                </p>
            )) }
        </div>

    </div>
    )
}

export default Sidebar