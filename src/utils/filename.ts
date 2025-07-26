/**
 * 转义正则表达式中的特殊字符
 * @param string - 需要转义的字符串
 * @returns 转义后的字符串
 */
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $&表示匹配到的子串
}

/**
 * 清理文件名，替换非法字符
 * @param filename - 原始文件名
 * @returns 清理后的文件名
 */
export function sanitizeFilename(filename: string): string {
    const charReplacements: Record<string, string> = {
        ':': '：',    
        '<': '＜',    
        '>': '＞',    
        '"': '"',    
        '|': '｜',    
        '?': '？',    
        '*': '＊',    
        '\\': '＼',   
        '/': '／'     
    };
    
    // 逐个替换非法字符
    let sanitized = filename;
    for (const [illegalChar, replacement] of Object.entries(charReplacements)) {
        sanitized = sanitized.replace(new RegExp(escapeRegExp(illegalChar), 'g'), replacement);
    }
    
    // 去除首尾空格和点
    sanitized = sanitized.replace(/^[\s.]+|[\s.]+$/g, '');
    
    // 如果文件名为空，使用默认名称
    if (!sanitized) {
        sanitized = 'unnamed_game';
    }
    
    return sanitized;
}
