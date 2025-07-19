import {get_steam_player_games} from './steam'
export async function fetch_games_data(steam_id :string,api_key: string){
  const data = await get_steam_player_games(steam_id ,api_key)
  console.log(data.response.games)
}