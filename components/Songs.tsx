import React from 'react'
import { useRecoilValue } from 'recoil'
import { playListState } from '../atoms/playListAtom'
import Song from './Song'

function Songs() {
  const playList = useRecoilValue(playListState)

  return (
    <div className='flex flex-col space-x-1 pb-28 text-white p-8'>
      { playList?.tracks.items.map((t,i) => (
        <Song key={t.track.id} order={i} track={t}/>
      ))}
    </div>
  )
}

export default Songs