# Netlify 部署指南

## 📋 部署前准备

### 1. 后端 API 部署
确保你的后端 API 已经部署到可访问的地址（如 Heroku、Railway、Render 等）。

### 2. 配置环境变量

#### 方式一：在项目中创建 .env 文件（推荐本地开发）
在 `frontend` 目录下创建以下文件：

**`.env.development`** (本地开发)
```
VITE_API_BASE_URL=http://127.0.0.1:5000
```

**`.env.production`** (生产环境)
```
VITE_API_BASE_URL=https://your-backend-api.com
```

⚠️ **重要**: 将 `https://your-backend-api.com` 替换为你实际的后端 API 地址！

#### 方式二：在 Netlify 网站配置环境变量（推荐生产环境）
1. 登录 Netlify Dashboard
2. 选择你的网站
3. 进入 `Site settings` → `Environment variables`
4. 添加变量：
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-backend-api.com`（你的实际后端地址）

## 🚀 部署步骤

### 方式一：通过 Git 自动部署（推荐）

1. **将代码推送到 GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "准备部署到 Netlify"
   git push origin main
   ```

2. **在 Netlify 创建新站点**
   - 登录 https://app.netlify.com/
   - 点击 "Add new site" → "Import an existing project"
   - 选择你的 Git 仓库
   - 配置构建设置：
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/dist`
   - 点击 "Deploy site"

3. **配置环境变量**（如果没有使用 .env.production）
   - 在站点设置中添加 `VITE_API_BASE_URL` 环境变量

### 方式二：手动上传部署

1. **在本地构建**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **手动上传 dist 目录**
   - 在 Netlify Dashboard 点击 "Add new site" → "Deploy manually"
   - 将 `frontend/dist` 文件夹拖拽上传

## ⚙️ 已配置项

✅ SPA 路由重定向（解决刷新 404 问题）
✅ 静态资源缓存优化
✅ 安全响应头配置
✅ 环境变量支持

## 🔧 后续调整

### 如果后端 API 地址变更：
1. 在 Netlify Dashboard 更新环境变量 `VITE_API_BASE_URL`
2. 触发重新部署（或者会自动重新部署）

### 如果遇到 CORS 问题：
确保后端 API 允许来自 Netlify 域名的跨域请求。在后端添加 CORS 配置：
```python
# Flask 示例
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",  # 本地开发
    "https://your-site-name.netlify.app"  # Netlify 部署地址
])
```

### 自定义域名：
- 在 Netlify Dashboard 的 "Domain settings" 中添加自定义域名
- 更新后端 CORS 配置以包含新域名

## 📝 检查清单

部署前请确认：
- [ ] 后端 API 已部署且可访问
- [ ] 已配置正确的 `VITE_API_BASE_URL` 环境变量
- [ ] 后端已配置 CORS 允许 Netlify 域名访问
- [ ] 本地测试构建成功 (`npm run build`)
- [ ] `.gitignore` 包含 `node_modules` 和 `dist`
- [ ] `netlify.toml` 配置文件在 frontend 目录下

## 🐛 常见问题

### 1. 页面刷新后 404
- ✅ 已通过 `netlify.toml` 中的重定向规则解决

### 2. API 请求失败
- 检查 `VITE_API_BASE_URL` 是否配置正确
- 检查后端 CORS 配置
- 打开浏览器控制台查看具体错误

### 3. 环境变量不生效
- 确保环境变量名以 `VITE_` 开头
- 修改环境变量后需要重新构建部署
- 本地开发需要重启开发服务器

## 📞 更多帮助

- Netlify 文档: https://docs.netlify.com/
- Vite 环境变量: https://vitejs.dev/guide/env-and-mode.html

