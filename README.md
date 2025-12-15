# Steam2Obsidian (S2O)

![GitHub release](https://img.shields.io/github/v/release/Yoak3n/obsidian-s2o)


一个将Steam游戏数据导入Obsidian的插件，支持自动更新游戏时长、成就和游戏信息。

## 功能特点

- 从Steam API获取您的游戏库数据
- 将游戏信息导入为Obsidian笔记
- 自动更新游戏时长和最后游玩时间
- 自动更新游戏成就进度
- 支持按游戏时长、最近游玩时间等筛选游戏
- 可选择是否忽略工具类游戏
- 支持自动更新功能

## 安装

### 从Obsidian社区插件市场安装
（测试阶段，暂不支持从社区插件市场安装）
1. 打开Obsidian设置
2. 进入「第三方插件」选项卡
3. 关闭「安全模式」
4. 点击「浏览」按钮
5. 搜索「Steam2Obsidian」
6. 点击安装
7. 安装完成后启用插件

### 手动安装

1. 使用[BRAT](https://github.com/TfTHacker/obsidian42-brat)插件安装
2. 点击「Add beta plugin」按钮
3. 输入插件仓库地址「https://github.com/Yoak3n/obsidian-s2o」
4. 点击「Add」按钮
5. 重启Obsidian
6. 在设置中启用插件

## 使用方法

### 配置插件

1. 打开Obsidian设置
2. 进入「Steam2Obsidian」设置选项卡
3. 填写以下必要信息：
   - **Steam API Key**：您的Steam API密钥（可从[Steam开发者网站](https://steamcommunity.com/dev/apikey)获取）
   - **Steam ID**：您的Steam ID（可使用[SteamID查询工具](https://steamid.io/)查询）
   - **输出目录**：游戏笔记将保存的Obsidian目录路径
4. 可选配置：
   - **设置代理**：部分api请求不稳定，需要使用代理
   - **获取成就**：是否获取游戏成就信息
   - **忽略工具**：是否忽略「实用工具」类别的游戏
   - **自动更新**：是否启用每次打开Obsidian时自动更新游戏时长和成就信息

### 导入游戏数据

1. 点击Obsidian左侧边栏的Steam图标，或使用命令面板执行「Steam2Obsidian: 获取Steam游戏列表并导入」命令
2. 在弹出的选择器中选择要导入的游戏范围：
   - 仅游玩时间超过100小时的游戏
   - 仅最近两个月游玩的游戏
   - 仅游玩过的游戏
   - 所有游戏
3. 插件将自动获取游戏信息并创建或更新笔记

### 更新游戏数据

- 点击Obsidian左侧边栏的更新图标，或使用命令面板执行「Steam2Obsidian: 更新游戏时长」命令可更新所有游戏的游玩时长和最后游玩时间
- 使用命令面板执行「Steam2Obsidian: 更新游戏成就」命令可更新所有游戏的成就进度

## 笔记格式

每个游戏笔记包含以下元数据：

```yaml
GameID: 游戏ID
Genres: [游戏类型]
Platforms: [支持平台]
MetacriticScore: 评分（如果有）
PlayedHours: 游玩时长
LastPlayed: 最后游玩时间
Achievements: 已获得成就/总成就数
Cover: 游戏封面图片URL
Description: 游戏简介
```

您可以在笔记的元数据区域下方添加自己的笔记内容，插件更新时会保留您添加的内容。

## 常见问题

### 如何获取Steam API Key？

1. 访问[Steam开发者网站](https://steamcommunity.com/dev/apikey)
2. 登录您的Steam账户
3. 填写域名（可以填写任意域名，如`localhost`）
4. 同意条款并点击「注册」
5. 复制生成的API密钥

### 如何查找我的Steam ID？

1. 访问[SteamID查询工具](https://steamid.io/)
2. 输入您的Steam个人资料URL或用户名
3. 查找「steamID64」字段，这就是您需要的Steam ID

### 为什么有些游戏没有成就信息？

不是所有Steam游戏都支持成就系统。如果游戏没有成就系统，或者Steam API无法获取该游戏的成就信息，则不会显示成就数据。

### 为什么有些游戏没有封面图片？

如果游戏没有封面图片，或者Steam API无法获取该游戏的封面图片，则不会显示封面图片。请确保网络连接正常。

## 支持与反馈

如果您遇到问题或有改进建议，请在GitHub仓库提交Issue。

---

**注意**：本插件需要访问Steam API，请确保您的API密钥安全，不要分享给他人。
