import { App, Notice } from 'obsidian'

import { get_steam_player_games } from './steam'

import { GamesRangeSuggester } from '../components/index'
import type { GameInfo, GameRange, S2OSettings } from '../types/index'
import { handleGames } from './file';


type OptionsType = {
  [key: number]: GameInfo[];
};

async function make_options(games: Array<GameInfo>) :Promise<OptionsType>{
  // 游玩两百个小时以上的游戏
  const option1 = games.filter((value) => {
    if (value.playtime_forever >= 200 * 60) {
      return value
    }
  })
  // 最近2个月内游玩过的游戏
  const now = new Date().valueOf() / 1000
  const option2 = games.filter((value) => {
    // 60天的秒数：60天 * 24小时 * 3600秒
    if ((now - value.rtime_last_played) <= 60 * 24 * 3600 && value.rtime_last_played > 0) return value
  })
  // 仅游玩过的游戏
  const option3 = games.filter((value) => {
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

export async function fetch_games_data(settings: S2OSettings, app: App) {
  if (!settings.steamID || !settings.steamAPIKey || settings.steamAPIKey == '' || settings.steamID == '') {
    new Notice('请先配置Steam ID和Steam API Key')
    return
  }
  const data = await get_steam_player_games(settings.steamID, settings.steamAPIKey)
  const games = data.response.games
  const options = await make_options(games)
  const onSelected = ({ index }: GameRange) => {
    if ([1, 2, 3, 4].includes(index)) {
      handleGames(settings, options[index], app)
    }else{
      handleGames(settings, options[1], app)
    }
  }
  new GamesRangeSuggester(app, options, onSelected).open()
}

export * from './file'