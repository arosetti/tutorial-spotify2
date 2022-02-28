import {atom, RecoilState} from 'recoil'

export const playListState = atom<SpotifyApi.SinglePlaylistResponse | null>({
  key: "playListState",
  default: null,
})

export const playListIdState = atom({
  key: "playListIdState",
  default: '3TPqC8lTa9gUa6oZr239zo',
})