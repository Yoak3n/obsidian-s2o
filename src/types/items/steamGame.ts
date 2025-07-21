import { GameInfo } from '../response/vault';
import { filterInvalidGenres } from '../../utils/filters';

export class Game {
    game_id: number;
    name: string;
    playtime: number;
    last_played_timestamp: number | null;
    achievement_total: number | null = null;
    achievement_count: number | null = null;
    platforms: string[] = [];
    genres: string[] = [];
    cover: string = '';
    description: string = '';
    score: number | null = null;
    review_total: number | null = null;

    constructor(data: GameInfo) {
        this.game_id = data.appid;
        this.name = data.name;
        this.playtime = data.playtime_forever;
        this.last_played_timestamp = data.rtime_last_played || null;
    }

    /**
     * 将时间戳转换为可读的时间格式
     */
    formatLastPlayed(): string {
        if (!this.last_played_timestamp) {
            return "从未游玩";
        }
        try {
            const dt = new Date(this.last_played_timestamp * 1000);
            return `${dt.getFullYear()}年${dt.getMonth() + 1}月${dt.getDate()}日 ${dt.getHours()}:${dt.getMinutes()}`;
        } catch (error) {
            return `无效时间戳: ${this.last_played_timestamp}`;
        }
    }

    /**
     * 获取分隔线内的游戏信息内容
     */
    toString(): string {
        let output = `---
GameID: ${this.game_id}
Genres: [${this.genres.join(',')}]
Platforms: [${this.platforms.join(',')}]
PlayedHours: ${(this.playtime / 60).toFixed(1)}
LastPlayed: ${this.formatLastPlayed()}
Cover: ${this.cover}
Description: ${this.description}
---`;

        const lines = output.split('\n');
        
        if (this.score !== null) {
            lines.splice(3, 0, `MetacriticScore: ${this.score}`);
        }
        
        // 需要考虑Score是否已插入来确定正确的索引位置
        let achievement_index = 5;
        if (this.score !== null) {
            achievement_index += 1;
        }
        
        if (this.achievement_count !== null) {
            lines.splice(achievement_index, 0, `Achievements: ${this.achievement_count}/${this.achievement_total}`);
        }
        
        if (this.review_total !== null) {
            lines.splice(achievement_index + 2, 0, `Reviews: ${this.review_total}`);
        }
        
        return lines.join('\n');
    }

    /**
     * 获取更多游戏信息
     */
    async fetchMoreInfo(getGameInfo: (appId: string) => Promise<any>): Promise<void> {
        console.log(`Fetching more info for game ${this.name} (${this.game_id})`);
        try {
            const res = await getGameInfo(this.game_id.toString());
            if (!res.success) {
                throw new Error(`Failed to fetch info for game ${this.name} (${this.game_id})`);
            }
            
            const data = res.data;
            
            // 游戏名
            this.name = data.name;
            
            // 平台
            this.platforms = [];
            for (const key in data.platforms) {
                if (data.platforms[key]) {
                    this.platforms.push(key);
                }
            }
            
            // 类型
            if (data.genres) {
                const genreDescriptions = data.genres.map((g: any) => g.description);
                this.genres = filterInvalidGenres(genreDescriptions);
            }
            
            // 封面
            this.cover = data.header_image;
            
            // 描述
            if (data.short_description) {
                // 清理HTML标签
                this.description = data.short_description.replace(/<.*?>/g, '').replace(':', '：');
            }
            
            // 评分
            this.score = data.metacritic?.score || null;
            
            // 成就总数
            this.achievement_total = data.achievements?.total || null;
            
            // 评价总数
            this.review_total = data.recommendations?.total || null;
        } catch (error) {
            console.error(`Error fetching more info for game ${this.game_id}:`, error);
        }
    }

    /**
     * 获取游戏成就信息
     */
    async fetchAchievement(steamId: string, apiKey: string, getGameAchievement: (appId: string, steamId: string, apiKey: string) => Promise<any>): Promise<void> {
        console.log(`Fetching achievement info for game ${this.name} (${this.game_id})`);
        if (this.achievement_total === null) {
            return;
        }
        
        try {
            const res = await getGameAchievement(this.game_id.toString(), steamId, apiKey);
            const playerstats = res.playerstats;
            
            if (playerstats?.error === 'Requested app has no stats') {
                return;
            }
            
            const achievements = playerstats?.achievements || [];
            this.achievement_count = achievements.filter((a: any) => a.achieved === 1).length;
        } catch (error) {
            console.error(`Error fetching achievements for game ${this.game_id}:`, error);
        }
    }
}