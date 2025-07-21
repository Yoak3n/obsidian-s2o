import { App } from 'obsidian'

import { get_steam_player_games } from './steam'
import {GamesRangeSuggester} from '../components/index'
import type {Game} from '../types/index'


class SteamDataService {

}
export async function fetch_games_data(steam_id: string, api_key: string,app:App) {
  const data = await get_steam_player_games(steam_id, api_key)
  const games = data.response.games
  const options = await make_options(games)
  console.log(typeof options)
  const onSelected = ({index}: {index: number,title:string})=>{

    switch (index){
      case 1:
        console.log(options[1])
        break
      case 2:
        console.log(options[2])
        break
      case 3:
        console.log(options[3])
        break
      case 4:
        console.log(options[4])
        break
      default:
        console.log(options[1])
    }

  }
  new GamesRangeSuggester(app,options,onSelected).open()
}

async function make_options(games:Array<Game>){
    // 游玩两百个小时以上的游戏
  const option1 = games.filter((value)=>{
    if (value.playtime_forever >= 200 * 60 ){
      return value
    }
  })
  // 最近2个月内游玩过的游戏
  const now = new Date().valueOf()/1000
  const option2 = games.filter((value)=>{
    if ((now - value.rtime_last_played)>= 60*24*3600 ) return value
  })
  // 仅游玩过的游戏
  const option3 = games.filter((value)=>{
    if (value.playtime_forever > 0) return value
  })
  const option4 = games

  return {
    1: option1,
    2: option2,
    3: option3,
    4: option4
  }
}
