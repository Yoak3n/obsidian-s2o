import { App, PluginSettingTab, Setting } from 'obsidian'

import S2oPlugin from '../main'
import { S2OSettings } from '../types';
import { FolderSuggest } from './suggesters/FolderSuggester';

export const DEFAULT_SETTINGS: S2OSettings = {
	steamAPIKey: '',
	steamID: '',
	dir: ''
}


export class S2OSettingTab extends PluginSettingTab {
	plugin: S2oPlugin

	constructor(app: App, plugin: S2oPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this

		containerEl.empty();
		new Setting(containerEl)
			.setName('Steam')
			.setHeading()

		new Setting(containerEl)
			.setName('Steam API Key')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your Steam API Key')
				.setValue(this.plugin.settings.steamAPIKey)
				.onChange(async (value) => {
					this.plugin.settings.steamAPIKey = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Steam ID')
			.setDesc('Specify the user')
			.addText(text => text
				.setPlaceholder('Enter your Steam ID')
				.setValue(this.plugin.settings.steamID)
				.onChange(async (value) => {
					this.plugin.settings.steamID = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Output')
			.setHeading()

		new Setting(containerEl)
			.setName('Output Directory')
			.setDesc('Specify the output directory')
			.addSearch((search) => {
				try {
					new FolderSuggest(this.app, search.inputEl);
				} catch (err) {
					console.log(err);
				}
				search.setPlaceholder('Enter the output directory')
					.setValue(this.plugin.settings.dir)
					.onChange(async (value) => {
						this.plugin.settings.dir = value;
						await this.plugin.saveSettings();
					})
			}


			)
		// .addText(text => text
		// 	.setPlaceholder('Enter the output directory')
		// 	.setValue(this.plugin.settings.dir)
		// 	.onChange(async (value) => {
		// 		this.plugin.settings.dir = value;
		// 		await this.plugin.saveSettings();
		// 	}));
	}
}