'use strict';

var obsidian = require('obsidian');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class CanvasLinkConverter extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        // 防抖定时器
        this.debounceTimer = null;
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Canvas Link Converter plugin loaded');
            // 监听编辑器变化事件，实现实时转换
            this.registerEvent(this.app.workspace.on('editor-change', (editor, info) => {
                const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                if (view) {
                    this.handleEditorChange(editor, view);
                }
            }));
        });
    }
    onunload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Canvas Link Converter plugin unloaded');
            // 清理防抖定时器
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }
        });
    }
    // 处理编辑器变化事件
    handleEditorChange(editor, view) {
        // 使用防抖机制，避免频繁转换
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
            try {
                this.convertCanvasLinksInEditor(editor, view);
            }
            catch (error) {
                console.error('Canvas Link Converter error:', error);
            }
        }, 200);
    }
    // 在编辑器中转换canvas链接
    convertCanvasLinksInEditor(editor, view) {
        const file = view.file;
        if (!file)
            return;
        // 获取当前编辑器内容
        const content = editor.getValue();
        // 只转换属性区域内的canvas链接
        const convertedContent = this.convertCanvasLinksInFrontmatter(content);
        // 如果内容有变化，更新编辑器
        if (convertedContent !== content) {
            const cursor = editor.getCursor();
            editor.setValue(convertedContent);
            // 恢复光标位置
            editor.setCursor(cursor);
        }
    }
    // 只在属性区域内转换canvas链接
    convertCanvasLinksInFrontmatter(content) {
        // 分割内容为frontmatter和正文
        const parts = content.split(/^---\s*$/m);
        // 如果没有frontmatter，直接返回
        if (parts.length < 3) {
            return content;
        }
        // 提取frontmatter部分
        const frontmatter = parts[1];
        // 转换frontmatter中的canvas链接
        const convertedFrontmatter = this.convertCanvasLinks(frontmatter);
        // 重新组合内容
        return `${parts[0]}---\n${convertedFrontmatter}---\n${parts.slice(2).join('---\n')}`;
    }
    // 核心转换逻辑：将[[*.canvas]]转换为[[*.canvas|*]]
    convertCanvasLinks(content) {
        // 匹配模式：[[文件名.canvas]] 转换为 [[文件名.canvas|文件名]]
        // 使用正则表达式，确保只匹配未格式化的canvas链接
        return content.replace(/\[\[(.*?)\.canvas\]\]/g, (match, fileName) => {
            // 检查是否已经是格式化链接（包含|）
            if (match.includes('|')) {
                return match; // 已经格式化，不转换
            }
            // 转换为带别名的链接
            return `[[${fileName}.canvas|${fileName}]]`;
        });
    }
}

module.exports = CanvasLinkConverter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbHVnaW4sIE1hcmtkb3duVmlldywgRWRpdG9yIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNMaW5rQ29udmVydGVyIGV4dGVuZHMgUGx1Z2luIHtcbiAgLy8g6Ziy5oqW5a6a5pe25ZmoXG4gIHByaXZhdGUgZGVib3VuY2VUaW1lcjogTm9kZUpTLlRpbWVvdXQgfCBudWxsID0gbnVsbDtcblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgY29uc29sZS5sb2coJ0NhbnZhcyBMaW5rIENvbnZlcnRlciBwbHVnaW4gbG9hZGVkJyk7XG4gICAgXG4gICAgLy8g55uR5ZCs57yW6L6R5Zmo5Y+Y5YyW5LqL5Lu277yM5a6e546w5a6e5pe26L2s5o2iXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKCdlZGl0b3ItY2hhbmdlJywgKGVkaXRvcjogRWRpdG9yLCBpbmZvOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVFZGl0b3JDaGFuZ2UoZWRpdG9yLCB2aWV3KTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgb251bmxvYWQoKSB7XG4gICAgY29uc29sZS5sb2coJ0NhbnZhcyBMaW5rIENvbnZlcnRlciBwbHVnaW4gdW5sb2FkZWQnKTtcbiAgICAvLyDmuIXnkIbpmLLmipblrprml7blmahcbiAgICBpZiAodGhpcy5kZWJvdW5jZVRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5kZWJvdW5jZVRpbWVyKTtcbiAgICB9XG4gIH1cblxuICAvLyDlpITnkIbnvJbovpHlmajlj5jljJbkuovku7ZcbiAgcHJpdmF0ZSBoYW5kbGVFZGl0b3JDaGFuZ2UoZWRpdG9yOiBFZGl0b3IsIHZpZXc6IE1hcmtkb3duVmlldykge1xuICAgIC8vIOS9v+eUqOmYsuaKluacuuWItu+8jOmBv+WFjemikee5gei9rOaNolxuICAgIGlmICh0aGlzLmRlYm91bmNlVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmRlYm91bmNlVGltZXIpO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmRlYm91bmNlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuY29udmVydENhbnZhc0xpbmtzSW5FZGl0b3IoZWRpdG9yLCB2aWV3KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NhbnZhcyBMaW5rIENvbnZlcnRlciBlcnJvcjonLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSwgMjAwKTtcbiAgfVxuXG4gIC8vIOWcqOe8lui+keWZqOS4rei9rOaNomNhbnZhc+mTvuaOpVxuICBwcml2YXRlIGNvbnZlcnRDYW52YXNMaW5rc0luRWRpdG9yKGVkaXRvcjogRWRpdG9yLCB2aWV3OiBNYXJrZG93blZpZXcpIHtcbiAgICBjb25zdCBmaWxlID0gdmlldy5maWxlO1xuICAgIGlmICghZmlsZSkgcmV0dXJuO1xuICAgIFxuICAgIC8vIOiOt+WPluW9k+WJjee8lui+keWZqOWGheWuuVxuICAgIGNvbnN0IGNvbnRlbnQgPSBlZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICBcbiAgICAvLyDlj6rovazmjaLlsZ7mgKfljLrln5/lhoXnmoRjYW52YXPpk77mjqVcbiAgICBjb25zdCBjb252ZXJ0ZWRDb250ZW50ID0gdGhpcy5jb252ZXJ0Q2FudmFzTGlua3NJbkZyb250bWF0dGVyKGNvbnRlbnQpO1xuICAgIFxuICAgIC8vIOWmguaenOWGheWuueacieWPmOWMlu+8jOabtOaWsOe8lui+keWZqFxuICAgIGlmIChjb252ZXJ0ZWRDb250ZW50ICE9PSBjb250ZW50KSB7XG4gICAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKCk7XG4gICAgICBlZGl0b3Iuc2V0VmFsdWUoY29udmVydGVkQ29udGVudCk7XG4gICAgICAvLyDmgaLlpI3lhYnmoIfkvY3nva5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3IoY3Vyc29yKTtcbiAgICB9XG4gIH1cblxuICAvLyDlj6rlnKjlsZ7mgKfljLrln5/lhoXovazmjaJjYW52YXPpk77mjqVcbiAgcHJpdmF0ZSBjb252ZXJ0Q2FudmFzTGlua3NJbkZyb250bWF0dGVyKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgLy8g5YiG5Ymy5YaF5a655Li6ZnJvbnRtYXR0ZXLlkozmraPmlodcbiAgICBjb25zdCBwYXJ0cyA9IGNvbnRlbnQuc3BsaXQoL14tLS1cXHMqJC9tKTtcbiAgICBcbiAgICAvLyDlpoLmnpzmsqHmnIlmcm9udG1hdHRlcu+8jOebtOaOpei/lOWbnlxuICAgIGlmIChwYXJ0cy5sZW5ndGggPCAzKSB7XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG4gICAgXG4gICAgLy8g5o+Q5Y+WZnJvbnRtYXR0ZXLpg6jliIZcbiAgICBjb25zdCBmcm9udG1hdHRlciA9IHBhcnRzWzFdO1xuICAgIC8vIOi9rOaNomZyb250bWF0dGVy5Lit55qEY2FudmFz6ZO+5o6lXG4gICAgY29uc3QgY29udmVydGVkRnJvbnRtYXR0ZXIgPSB0aGlzLmNvbnZlcnRDYW52YXNMaW5rcyhmcm9udG1hdHRlcik7XG4gICAgXG4gICAgLy8g6YeN5paw57uE5ZCI5YaF5a65XG4gICAgcmV0dXJuIGAke3BhcnRzWzBdfS0tLVxcbiR7Y29udmVydGVkRnJvbnRtYXR0ZXJ9LS0tXFxuJHtwYXJ0cy5zbGljZSgyKS5qb2luKCctLS1cXG4nKX1gO1xuICB9XG5cbiAgLy8g5qC45b+D6L2s5o2i6YC76L6R77ya5bCGW1sqLmNhbnZhc11d6L2s5o2i5Li6W1sqLmNhbnZhc3wqXV1cbiAgcHJpdmF0ZSBjb252ZXJ0Q2FudmFzTGlua3MoY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyDljLnphY3mqKHlvI/vvJpbW+aWh+S7tuWQjS5jYW52YXNdXSDovazmjaLkuLogW1vmlofku7blkI0uY2FudmFzfOaWh+S7tuWQjV1dXG4gICAgLy8g5L2/55So5q2j5YiZ6KGo6L6+5byP77yM56Gu5L+d5Y+q5Yy56YWN5pyq5qC85byP5YyW55qEY2FudmFz6ZO+5o6lXG4gICAgcmV0dXJuIGNvbnRlbnQucmVwbGFjZSgvXFxbXFxbKC4qPylcXC5jYW52YXNcXF1cXF0vZywgKG1hdGNoLCBmaWxlTmFtZSkgPT4ge1xuICAgICAgLy8g5qOA5p+l5piv5ZCm5bey57uP5piv5qC85byP5YyW6ZO+5o6l77yI5YyF5ZCrfO+8iVxuICAgICAgaWYgKG1hdGNoLmluY2x1ZGVzKCd8JykpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoOyAvLyDlt7Lnu4/moLzlvI/ljJbvvIzkuI3ovazmjaJcbiAgICAgIH1cbiAgICAgIC8vIOi9rOaNouS4uuW4puWIq+WQjeeahOmTvuaOpVxuICAgICAgcmV0dXJuIGBbWyR7ZmlsZU5hbWV9LmNhbnZhc3wke2ZpbGVOYW1lfV1dYDtcbiAgICB9KTtcbiAgfVxufSJdLCJuYW1lcyI6WyJQbHVnaW4iLCJNYXJrZG93blZpZXciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFcUIsTUFBQSxtQkFBb0IsU0FBUUEsZUFBTSxDQUFBO0FBQXZELElBQUEsV0FBQSxHQUFBOzs7UUFFVSxJQUFhLENBQUEsYUFBQSxHQUEwQixJQUFJLENBQUM7S0E0RnJEO0lBMUZPLE1BQU0sR0FBQTs7QUFDVixZQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQzs7QUFHbkQsWUFBQSxJQUFJLENBQUMsYUFBYSxDQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLENB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
