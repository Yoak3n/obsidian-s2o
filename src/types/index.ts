export interface S2OSettings {
    auto_update: boolean;
	steamAPIKey: string;
    steamID: string;
    dir: string;

    fetchAchievement: boolean;
    ignoreUtilities: boolean;
}
export interface GameRange {
  title :string
  index: number
}
export * from './response/vault'
export * from './items/game'
