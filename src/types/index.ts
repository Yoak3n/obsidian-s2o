export interface S2OSettings {
    auto_update: boolean;
	steamAPIKey: string;
    steamID: string;
    dir: string;

    fetchAchievement: boolean;
    ignoreUtilities: boolean;
}

export * from './response/vault'
export * from './items/game'
export * from './items/steamGame'
