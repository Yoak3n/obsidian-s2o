import { Notice, Plugin } from 'obsidian';

import { S2OSettings } from './types'
import { S2OSettingTab, DEFAULT_SETTINGS } from './settings/index'
import { fetch_games_data,update_games_time, update_games_achievement } from './service/index'


export default class S2oPlugin extends Plugin {
	settings: S2OSettings;
	statusBarItemEl: HTMLElement;
	async onload() {
		await this.loadSettings();


		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', '更新游戏时长和成就', (evt: MouseEvent) => {
			this.updateGamesInfo()
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		this.statusBarItemEl = this.addStatusBarItem();
		this.statusBarItemEl.setText('');
		
		this.addCommand({
			id: 'get_steam_player_games',
			name: '获取Steam游戏列表并导入',
			callback: () => fetch_games_data(this.settings,this.app)
			
		})
		this.addCommand({
			id: 'update_steam_player_games',
			name: '更新游戏时长和成就',
			callback: () => this.updateGamesInfo()
		})
		
		this.addSettingTab(new S2OSettingTab(this.app, this));
		if (this.settings.auto_update) {
			console.log('5秒后自动更新游戏信息')
			setTimeout(() => this.updateGamesInfo(), 5000)
		}
		
	}

	onunload() {
		// window.fetch = this.originalFetch;	
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async updateStatusBarText(text: string) {
		this.statusBarItemEl.setText(text);
	}
	
	async updateGamesInfo(){
		const tc = await this.updateGamesTime()
		if (this.settings.fetchAchievement) {
			const ac = await this.updateGamesAchievement()
			new Notice(`成功更新${tc}个游戏的时长信息和${ac}个游戏的成就信息`)
		}else{
			new Notice(`成功更新${tc}个游戏的时长信息`)
		}
	}

	async updateGamesTime() {
		this.updateStatusBarText('更新游戏时间...')
		const tc = await update_games_time(this.settings,this.app)
		this.updateStatusBarText('游戏时间更新完成')
		setTimeout(() => {
			this.updateStatusBarText('')
		}, 3000)
		return tc
	}
	async updateGamesAchievement() {
		this.updateStatusBarText('更新游戏成就...')
		const ac = await update_games_achievement(this.settings,this.app)
		this.updateStatusBarText('游戏成就更新完成')
		setTimeout(() => {
			this.updateStatusBarText('')
		}, 3000)
		return ac
	}
}

