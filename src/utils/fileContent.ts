import { App, normalizePath, TFile } from 'obsidian';

/**
 * 读取现有文件内容，返回分隔线前后的内容
 * @param content - 文件内容字符串
 * @returns 分隔线前后的内容 [前内容, 后内容]
 */
export function readExistingContent(content: string): [string, string] {
    if (!content) {
        return ['', ''];
    }
    
    try {
        const lines = content.split('\n');
        let firstSeparator = -1;
        let lastSeparator = -1;
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '---') {
                if (firstSeparator === -1) {
                    firstSeparator = i;
                } else {
                    lastSeparator = i;
                    break; // 找到第二个分隔符后停止
                }
            }
        }
        
        if (firstSeparator === -1 || lastSeparator === -1 || firstSeparator === lastSeparator) {
            return ['', ''];
        }
        
        // 一般情况下，第一个分隔线之前不应该存在内容，会破坏md文件的元数据结构
        const beforeContent = lines.slice(0, firstSeparator).join('\n').trim();
        const afterContent = lines.slice(lastSeparator + 1).join('\n').trim();
        
        return [beforeContent, afterContent];
    } catch (error) {
        console.error(`Error reading existing content: ${error}`);
        return ['', ''];
    }
}

/**
 * 从文件路径读取内容，返回分隔线前后的内容
 * @param filePath 文件路径
 * @param app Obsidian App实例
 * @returns 分隔线前后的内容 [前内容, 后内容]
 */
export async function readExistingContentFromPath(filePath: string, app: App): Promise<[string, string]> {
    try {
        const normalizedPath = normalizePath(filePath);
        const file = app.vault.getAbstractFileByPath(normalizedPath);
        if (!(file instanceof TFile)) {
            return ['', ''];
        }
        
        const content = await app.vault.read(file);
        return readExistingContent(content);
    } catch (error) {
        console.error(`Error reading existing content from ${filePath}: ${error}`);
        return ['', ''];
    }
}