import { App, TFolder, TFile, normalizePath } from "obsidian"
import { GameInfo, S2OSettings } from "src/types"
import { get_steam_game_achievement, get_steam_game_info, get_steam_player_games } from "./steam"
import { Game } from '../types/index'
import { sanitizeFilename } from '../utils/filename'
import { readExistingContentFromPath } from '../utils/fileContent'


export async function update_games_time(settings: S2OSettings, app: App) {
  const data = await get_steam_player_games(settings.steamID, settings.steamAPIKey)
  const games = data.response.games
  let count = 0
  const folderPath = normalizePath(settings.dir || '')
  const folder = app.vault.getAbstractFileByPath(folderPath)

  if (!folder) {
    console.error(`目标文件夹不存在: ${folderPath}`)
    return count
  } else if (!(folder instanceof TFolder)) {
    console.error(`路径存在但不是文件夹: ${folderPath}`)
    return count
  }

  const files = app.vault.getMarkdownFiles().filter(file => 
    file.path.startsWith(folderPath + '/')
  )

  const gameMap = new Map<number, GameInfo>()
  for (const gameInfo of games) {
    gameMap.set(gameInfo.appid, gameInfo)
  }

  // 更新每个文件
  for (const file of files) {
    try {
      const content = await app.vault.read(file)
      
      // 提取GameID
      const gameIdMatch = content.match(/GameID:\s*(\d+)/)
      if (!gameIdMatch) continue
      
      const gameId = parseInt(gameIdMatch[1])
      const gameInfo = gameMap.get(gameId)
      
      // 如果找到对应的游戏信息，更新文件
      if (gameInfo) {
        const playedHours = (gameInfo.playtime_forever / 60).toFixed(1)
        let lastPlayed = "从未游玩"
        
        if (gameInfo.rtime_last_played) {
          try {
            const dt = new Date(gameInfo.rtime_last_played * 1000)
            lastPlayed = `${dt.getFullYear()}年${dt.getMonth() + 1}月${dt.getDate()}日 ${dt.getHours()}:${dt.getMinutes()}`
          } catch (error) {
            lastPlayed = `无效时间戳: ${gameInfo.rtime_last_played}`
          }
        }
        
        let updatedContent = content
        
        const playedHoursRegex = /(PlayedHours:\s*)[^\n]+/
        if (playedHoursRegex.test(updatedContent)) {
          updatedContent = updatedContent.replace(playedHoursRegex, `$1${playedHours}`)
        }
        
        const lastPlayedRegex = /(LastPlayed:\s*)[^\n]+/
        if (lastPlayedRegex.test(updatedContent)) {
          updatedContent = updatedContent.replace(lastPlayedRegex, `$1${lastPlayed}`)
        }
        
        if (updatedContent !== content) {
          await app.vault.modify(file, updatedContent)
          count++
          console.log(`更新了游戏时间信息: ${gameInfo.name}`)
        }
      }
    } catch (error) {
      console.error(`处理文件时出错: ${file.path}`, error)
    }
  }
  return count
}


export async function update_games_achievement(settings: S2OSettings, app: App):Promise<number> {
  const folderPath = normalizePath(settings.dir || '')
  const folder = app.vault.getAbstractFileByPath(folderPath)
  let count =  0
  if (!folder) {
    console.error(`目标文件夹不存在: ${folderPath}`)
    return count
  } else if (!(folder instanceof TFolder)) {
    console.error(`路径存在但不是文件夹: ${folderPath}`)
    return count
  }

  const files = app.vault.getMarkdownFiles().filter(file => 
    file.path.startsWith(folderPath + '/')
  )

  // 更新每个文件的成就信息
  for (const file of files) {
    try {
      const content = await app.vault.read(file)
      
      // 提取GameID
      const gameIdMatch = content.match(/GameID:\s*(\d+)/)
      if (!gameIdMatch) continue
      
      const gameId = gameIdMatch[1]
      
      const achievementTotalMatch = content.match(/Achievements:\s*(\d+)\/(\d+)/)
      if (!achievementTotalMatch) {
        console.log(`游戏 ${gameId} 没有成就信息，跳过`)
        continue
      }
      
      const achievementTotal = parseInt(achievementTotalMatch[2])
      
      try {
        const achievementData = await get_steam_game_achievement(gameId, settings.steamID, settings.steamAPIKey)

        // 检查是否有错误或游戏没有成就
        if (achievementData.playerstats?.error) {
          console.log(`游戏 ${gameId} 没有成就数据或获取失败，跳过`)
          continue
        }
        
        const achievements = achievementData.playerstats?.achievements || []
        const achievementCount = achievements.filter((a: any) => a.achieved === 1).length
        
        // 使用正则表达式更新成就信息
        let updatedContent = content
        const achievementRegex = /(Achievements:\s*)\d+\/(\d+)/
        
        if (achievementRegex.test(updatedContent)) {
          updatedContent = updatedContent.replace(achievementRegex, `$1${achievementCount}/$2`)
        }
        
        if (updatedContent !== content) {
          await app.vault.modify(file, updatedContent)
          count++
          console.log(`更新了游戏成就信息: GameID ${gameId}, 成就: ${achievementCount}/${achievementTotal}`)
        }
        
      } catch (error) {
        console.error(`获取游戏 ${gameId} 成就信息时出错:`, error)
        continue
      }
      
    } catch (error) {
      console.error(`处理文件时出错: ${file.path}`, error)
    }
  }
  return count
}


export async function handleGames(settings: S2OSettings, game_data: Array<GameInfo>, app: App) {
  let games: Game[] = []
  // 确保目标文件夹存在
  const folderPath = normalizePath(settings.dir || '')
  let folder = app.vault.getAbstractFileByPath(folderPath)

  if (!folder) {
    // 如果文件夹不存在，创建它
    try {
      folder = await app.vault.createFolder(folderPath)
    } catch (error) {
      console.error(`Failed to create folder: ${folderPath}`, error)
      return []
    }
  } else if (!(folder instanceof TFolder)) {
    console.error(`Path exists but is not a folder: ${folderPath}`)
    return []
  }

  for (const gameInfo of game_data) {
    try {
      const game = new Game(gameInfo)

      await game.fetchMoreInfo(get_steam_game_info)
      if (settings.ignoreUtilities && (game.genres.includes('Utilities') || game.genres.includes('实用工具'))) {
        continue
      }
      // 如果需要获取成就信息
      if (settings.fetchAchievement) {
        await game.fetchAchievement(settings.steamID, settings.steamAPIKey, get_steam_game_achievement)
      }

      games.push(game)

      const fileName = `${sanitizeFilename(game.name)}.md`
      const filePath = normalizePath(`${folderPath}/${fileName}`)

      const existingFile = app.vault.getAbstractFileByPath(filePath)

      if (existingFile instanceof TFile) {
        const [beforeContent, afterContent] = await readExistingContentFromPath(filePath, app);

        let newContent = game.toString();
        if (beforeContent && beforeContent.trim() !== '') {
          newContent = beforeContent + newContent;
        }
        if (afterContent && afterContent.trim() !== '') {
          newContent = newContent + '\n' + afterContent;
        }

        // 更新现有文件
        await app.vault.modify(existingFile, newContent);
      } else {
        // 创建新文件
        await app.vault.create(filePath, game.toString());
      }
    } catch (error) {
      console.error(`Error processing game: ${gameInfo.name}`, error)
      continue
    }
  }

  return games
}
