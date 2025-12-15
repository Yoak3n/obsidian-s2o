// import fetch,{type Response} from 'node-fetch'
import {requestUrl, RequestUrlResponse} from 'obsidian'
import type { GameVault} from 'src/types'


const OPTION = {
  'method': 'GET',
  'headers': {
    'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7,en-US;q=0.6,en-GB;q=0.5',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
  },
  'timeout': 30,
}

async function make_requests_with_retry(uri: URL, option: any, max_retries: number = 5, retry_delay: number = 1.0) :Promise<RequestUrlResponse | null>{
  const retry_status_codes = [403, 429, 500, 502, 503, 504]
  for (let attempt = 0; attempt < max_retries; attempt++) {
    try {
      const res = await requestUrl({
        url:uri.href,
        ...option,
      })
      if (res.status == 200 || !retry_status_codes.includes(res.status)) {
        return res
      }
      if (attempt < max_retries){
        const wait_time = retry_delay * (2 ** attempt)
        console.log(`Retry attempt ${attempt+1} for ${uri} failed with status ${res.status}. Retrying in ${wait_time} seconds...`);
        await new Promise(resolve => setTimeout(resolve, wait_time*1000))
      }else{
        console.error(`Max retries reached for ${uri}. Status: ${res.status}`)
        return res
      }
    } catch (e) {
      console.error(e)
    }
  }
  return null 
}


export async function get_steam_player_games(steam_id :string,api_key: string){
  console.log('[S2O]fetch steam player\'s game list...')
  const uri = new URL('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/')
  uri.searchParams.append('key',api_key)
  uri.searchParams.append('steamid',steam_id)
  uri.searchParams.append('include_appinfo','true')
  uri.searchParams.append('format','json')

  const res = await make_requests_with_retry(uri,OPTION)
  if (res == null || res?.status != 200){
    throw Error(`Failed to get vault:${res?.text}`)
  }
  
  return await res.json as GameVault
}

export async function get_steam_game_achievement(app_id:string, steam_id:string, api_key:string):Promise<any>{
  const uri = new URL('http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/')
  uri.searchParams.append('key',api_key)
  uri.searchParams.append('steamid',steam_id)
  uri.searchParams.append('appid',app_id)

  const res = await make_requests_with_retry(uri,OPTION)  

  if (res == null || res?.status != 200){
    return { playerstats: { error: 'Failed to fetch achievements' } }
  }
  
  try {
    return await res.json
  } catch (error) {
    console.error(`Error parsing achievement data for game ${app_id}:`, error)
    return { playerstats: { error: 'Failed to parse achievements data' } }
  }
}

export async function get_steam_game_info(app_id:string){
  const uri = new URL('https://store.steampowered.com/api/appdetails')
  uri.searchParams.append('appids',app_id)

  const res = await make_requests_with_retry(uri, OPTION)  
  if (res == null || res?.status != 200){
    return { success: false, data: null }
  }
  
  // 需要使用appid来获取对应游戏信息
  const data = await res.json as any
  const gameData = data[app_id]
  
  return {
    success: gameData?.success || false,
    data: gameData?.data || null
  }
}

