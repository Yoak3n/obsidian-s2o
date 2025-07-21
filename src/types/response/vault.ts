interface GameVaultData {
  response: ResponseField
}

interface ResponseField {
  game_count : number
  games : Array<Game>
}
export interface Game {
  appid: number
  name: string
  playtime_forever: number
  rtime_last_played: number
}

export type GameVault = GameVaultData