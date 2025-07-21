interface GameInfoData {
    success: boolean
    data: {
        name: string
        short_description: string
        header_image: string
        achievements?: {
            total: number
        }
        metacritic?: {
            score: number
        }
        recommendations: {
            total: number
        }
    }
}

export type GameInfo = GameInfoData