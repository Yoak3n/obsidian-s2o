import { App, PluginSettingTab, Setting } from 'obsidian'

import S2oPlugin from '../main'
import { S2OSettings } from '../types';
import { FolderSuggest } from './suggesters/FolderSuggester';
import { ProxyAgent, setGlobalDispatcher } from 'undici';

export const DEFAULT_SETTINGS: S2OSettings = {
    steamAPIKey: '',
    steamID: '',
    dir: '',
    enableProxy: false,
    proxy: '',
    fetchAchievement: false,
    ignoreUtilities: false,
    auto_update: false,
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
            .setHeading()
            .setName('General')
        new Setting(containerEl)
            .setName('Auto Update')
            .setDesc('Auto update on startup')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.auto_update)
                toggle.onChange(async (value) => {
                    this.plugin.settings.auto_update = value;
                    await this.plugin.saveSettings();
                })
            })
        new Setting(containerEl)
            .setName('Proxy')
            .setDesc('Set proxy for network requests (e.g., http://127.0.0.1:7890)')
            .addText(text => text
                .setPlaceholder('Enter your proxy')
                .setValue(this.plugin.settings.proxy)
                .onChange(async (value) => {
                    this.plugin.settings.proxy = value;
                    await this.plugin.saveSettings();
                }));
        new Setting(containerEl)
            .setName('Enable Proxy')
            .setDesc('Enable proxy.Restart Obsidian after disabling the proxy.')
            .setTooltip('Restart Obsidian after disabling the proxy.')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.enableProxy)
                toggle.onChange(async (value) => {
                    this.plugin.settings.enableProxy = value;
                    await this.plugin.saveSettings();
                })
            })

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
            .setName('Fetch Achievement')
            .setDesc('Fetch the user\'s achievement')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.fetchAchievement)
                toggle.onChange(async (value) => {
                    this.plugin.settings.fetchAchievement = value;
                    await this.plugin.saveSettings();
                })
            })
        new Setting(containerEl)
            .setName('Ignore utilities')
            .setDesc('Ignore the utilities games')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.ignoreUtilities)
                toggle.onChange(async (value) => {
                    this.plugin.settings.ignoreUtilities = value;
                    await this.plugin.saveSettings();
                })
            })


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
            })
    }
}