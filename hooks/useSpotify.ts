import React, { useEffect } from 'react'

import { signIn, useSession } from 'next-auth/react'

import spotifyApi from '../lib/spotify'

function useSpotify() {
    const {data:session} = useSession()

useEffect(()=> {
  if(session) {
    if(session.error === 'RefreshAccessTokenError') {
      signIn()
    }
    spotifyApi.setAccessToken((session?.user as any ).accessToken)
  }
}, [session])

  return spotifyApi
}

export default useSpotify