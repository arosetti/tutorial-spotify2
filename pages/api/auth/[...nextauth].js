import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { refreshAccessToken } from "spotify-web-api-node/src/server-methods"

import spotifyApi, { LOGIN_URL } from '../../../lib/spotify'

async function myRefreshAccessToken(token) {
  try{
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)
    const {body: refreshedToken} = await spotifyApi.refreshAccessToken()
    return {
      ... token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now + refreshedToken.expires_in*1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
      error: undefined
    }
  } catch (error) {
    console.error(error)
    return {
      ...token,
      error:'RefreshAccessTokenError'
    }
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({token,account,user}) {
      // initial sign in
      if(account && user) {
        return {
          ...token,
          accessToken:account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        }
      }

      // token still valid?
      if(Date.now() < token.accessTokenExpires) {
        return token
      }

      // try refresh
      return await myRefreshAccessToken(token)
    },
    async session({session,token}){
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken
      session.user.username = token.username
      return session
    }
  }
})