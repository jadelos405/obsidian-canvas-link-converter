# Canvas Link Converter

Obsidian 插件 - Canvas 链接自动转换工具

## 功能说明

大约在obsidian的v1.10.0及以前的版本中，当在属性区域（Frontmatter）中输入 `[[*.canvas]]` 格式的链接时，插件会自动将其转换为 `[[*.canvas|*]]` 格式。

然而，在obsidian的v1.10.0及以后的版本中，obsidian官方**移除**了这样的功能，此插件旨在恢复这样的功能。

### 转换示例

| 输入 | 输出 |
|------|------|
| `[[my-canvas.canvas]]` | `[[my-canvas.canvas\|my-canvas]]` |
| `[[example.canvas]]` | `[[example.canvas\|example]]` |
| `[[my-canvas.canvas\|alias]]` | `[[my-canvas.canvas\|alias]]`（已格式化的链接保持不变） |

## 安装方式

### 方式一：手动安装

1. 下载项目的发行版的文件或文件夹
2. 将文件或文件夹复制到 Obsidian 插件目录：
   - Windows: `%vault_path%/.obsidian/plugins/`
   - macOS: `~/.obsidian/plugins/`
3. 在 Obsidian 设置中刷新插件列表，并启用插件

### 方式二：开发模式安装

```bash
# 克隆项目
git clone https://github.com/yourusername/obsidian-canvas-link-converter.git

# 安装依赖
npm install

# 构建插件
npm run build
```

## 使用方法

1. 确保插件已启用
2. 在任意 Markdown 文件的属性区域（YAML frontmatter）中输入 Canvas 链接
3. 插件会自动实时转换未格式化的链接

### 示例

```yaml
---
canvas-links:
  - [[my-project.canvas]]
  - [[notes.canvas]]
---
```

保存后，链接会自动转换为：

```yaml
---
canvas-links:
  - [[my-project.canvas|my-project]]
  - [[notes.canvas|notes]]
---
```

## 开发

### 项目结构

```
obsidian-canvas-link-converter/
├── src/
│   └── main.ts          # 插件主代码
├── releases/
│   └── v1.0.0/          # 发布版本
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
└── manifest.json       # Obsidian 插件清单
```

### 构建命令

```bash
# 开发模式（监听文件变化）
npm run dev

# 生产构建
npm run build

# 代码检查
npm run lint
```

## 技术特性

- **实时转换**：编辑时自动转换，无需手动触发
- **仅处理属性区域**：只转换 frontmatter 中的链接，不影响正文内容
- **防抖机制**：200ms 防抖，避免频繁转换
- **智能识别**：已格式化的链接不会被重复转换

## 版本要求

- Obsidian 版本：0.15.0 或更高

## 许可证

MIT License
