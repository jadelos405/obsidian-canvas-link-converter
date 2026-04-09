import { Plugin, MarkdownView, Editor } from 'obsidian';

export default class CanvasLinkConverter extends Plugin {
  // 防抖定时器，用于避免频繁转换canvas链接
  private debounceTimer: NodeJS.Timeout | null = null;

  // 插件加载时执行
  async onload() {
    console.log('Canvas Link Converter plugin loaded');
    
    // 监听编辑器变化事件，实现实时转换
    this.registerEvent(
      this.app.workspace.on('editor-change', (editor: Editor, info: any) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
          this.handleEditorChange(editor, view);
        }
      })
    );
  }

  async onunload() {
    console.log('Canvas Link Converter plugin unloaded');
    // 清理防抖定时器
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  // 处理编辑器变化事件
  private handleEditorChange(editor: Editor, view: MarkdownView) {
    // 使用防抖机制，避免频繁转换
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = setTimeout(() => {
      try {
        this.convertCanvasLinksInEditor(editor, view);
      } catch (error) {
        console.error('Canvas Link Converter error:', error);
      }
    }, 200);
  }

  // 在编辑器中转换canvas链接
  private convertCanvasLinksInEditor(editor: Editor, view: MarkdownView) {
    // 获取当前文件对象
    const file = view.file;

    // 检查是否有文件
    if (!file) return;
    
    // 获取当前编辑器内容
    const content = editor.getValue();
    
    // 只转换属性区域内的canvas链接
    const convertedContent = this.convertCanvasLinksInFrontmatter(content);
    
    // 如果内容有变化，更新编辑器
    if (convertedContent !== content) {
      // 记录当前光标位置
      const cursor = editor.getCursor();
      editor.setValue(convertedContent);
      // 恢复光标位置
      editor.setCursor(cursor);
    }
  }

  // 只在属性区域内转换canvas链接
  private convertCanvasLinksInFrontmatter(content: string): string {
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
  private convertCanvasLinks(content: string): string {
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