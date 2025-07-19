import fetch,{type Response} from 'node-fetch'
import type { GameVault } from 'src/types'
async function make_requests_with_retry(uri: string, option: any, max_retries: number = 5, retry_delay: number = 1.0) :Promise<Response | null>{
  const retry_status_codes = [403, 429, 500, 502, 503, 504]
  for (let attempt = 0; attempt < max_retries; attempt++) {
    try {
      const res = await fetch(uri, option)
      if (res.status == 200 || !retry_status_codes.includes(res.status)) {
        return res
      }
      if (attempt < max_retries){
        const wait_time = retry_delay * (2 ** attempt)
        setTimeout(()=>{},wait_time*1000)
      }else{
        return res
      }
    } catch (e) {
      console.error(e)
    }
  }
  return null 
}


export async function get_steam_player_games(steam_id :string,api_key: string){
  console.log('fetch steam play\'s game list...')
  const uri  = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${api_key}&steamid=${steam_id}&include_appinfo=true&format=json`
  const option = {
    'method': 'GET',
    'headers': {
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
    },
    'timeout': 30,
  }
  const res = await make_requests_with_retry(uri,option)
  if (res?.status != 200){
    throw Error(`Failed to get vault:${res?.body}`)
  }
  return await res.json() as GameVault
}