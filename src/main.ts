import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { S2OSettings } from './types'
import { S2OSettingTab, DEFAULT_SETTINGS } from './settings/index'
import { fetch_games_data,update_games_time, update_games_achievement } from './service/index'


export default class S2oPlugin extends Plugin {
	settings: S2OSettings;
	statusBarItemEl: HTMLElement;
	async onload() {
		await this.loadSettings();


		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Steam2Obsidian Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		this.statusBarItemEl = this.addStatusBarItem();
		this.statusBarItemEl.setText('');
		
		this.addCommand({
			id: 'get_steam_player_games',
			name: 'Get Steam Player Games',
			callback: () => {
				fetch_games_data(this.settings,this.app)
			}
		})

		
		this.addSettingTab(new S2OSettingTab(this.app, this));
		if (this.settings.auto_update) {
			this.updateGamesTime();
			if (this.settings.fetchAchievement) {
				this.updateGamesAchievement()
			}
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
	
	async updateGamesTime() {
		this.updateStatusBarText('更新游戏时间...')
		await update_games_time(this.settings,this.app)
		this.updateStatusBarText('游戏时间更新完成')
		setTimeout(() => {
			this.updateStatusBarText('')
		}, 3000)
	}
	async updateGamesAchievement() {
		this.updateStatusBarText('更新游戏成就...')
		await update_games_achievement(this.settings,this.app)
		this.updateStatusBarText('游戏成就更新完成')
		setTimeout(() => {
			this.updateStatusBarText('')
		}, 3000)
	}
}

