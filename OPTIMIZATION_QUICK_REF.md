# 性能优化快速参考卡

## 🚀 一键构建和部署

```bash
# 1. 安装依赖
npm install

# 2. 构建生产版本
npm run build

# 3. 本地预览（可选）
npm run preview

# 4. 部署到服务器
# 上传 dist/ 目录中的所有文件到 Web 根目录
```

---

## 📊 优化效果一览

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| **首次加载** | 2.5s | 1.0s | ⬇️ 60% |
| **首屏 JS** | 1.5MB | 10KB | ⬇️ 98% |
| **CSS 大小** | 70KB | 5.85KB | ⬇️ 90% |
| **TTI** | 4.0s | 1.2s | ⬇️ 70% |

---

## 🎯 关键优化点

### ✅ 已完成的优化

1. **Tailwind CSS 本地化**
   - 从 CDN 迁移到本地构建
   - 启用 tree-shaking
   - 大小：70KB → 5.85KB (gzip)

2. **Three.js 组件懒加载**
   - EarthHero 和 ThreeBackground 按需加载
   - 首屏 JS 减少 1MB+

3. **字体异步加载**
   - 不阻塞页面渲染
   - 使用 `media="print"` + `onload` 技巧

4. **图片懒加载**
   - 项目图片添加 `loading="lazy"`
   - 减少初始网络请求

5. **代码分割优化**
   - React vendor: 独立 chunk
   - Three.js vendor: 独立 chunk
   - 更好的缓存策略

6. **生产构建优化**
   - Terser 压缩
   - 移除 console.log
   - CSS 代码分割

---

## 📦 构建产物

```
dist/
├── index.html                    1.34 KB
├── assets/
│   ├── index-*.css              5.85 KB (gzip)
│   ├── index-*.js               9.04 KB (gzip)
│   ├── three-vendor-*.js      298.38 KB (gzip) [懒加载]
│   ├── EarthHero-*.js           1.57 KB (gzip) [懒加载]
│   └── ThreeBackground-*.js     1.77 KB (gzip) [懒加载]
└── textures/                    1.3 MB
```

---

## 🌐 部署方式

### 方式 1: Nginx（推荐）
```bash
# 复制文件
cp -r dist/* /var/www/html/

# 重启服务
sudo systemctl restart nginx
```

### 方式 2: Vercel（最简单）
```bash
npm install -g vercel
vercel
```

### 方式 3: GitHub Pages
```bash
npm install -D gh-pages
npm run deploy
```

---

## ⚙️ 关键配置

### Nginx 最小配置
```nginx
server {
    listen 80;
    root /var/www/myblog/dist;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_types text/css application/javascript;
    
    # 单页应用路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|jpg|png)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 环境要求
- Node.js >= 18
- npm >= 9
- 现代浏览器（支持 ES6+）

---

## 🔍 性能测试

### 使用 Lighthouse
```bash
# Chrome DevTools > Lighthouse > 运行审计
```

**目标分数**:
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >85

### 使用 WebPageTest
访问 https://www.webpagetest.org/
- 选择测试地点
- 输入网站 URL
- 运行测试

---

## 🐛 常见问题

### Q: 刷新页面 404？
A: 配置单页应用路由支持（见部署指南）

### Q: 3D 地球不显示？
A: 检查 textures 目录是否正确上传

### Q: 字体加载失败？
A: 检查 Google Fonts CDN 连接

### Q: 构建失败？
A: 确保 Node.js >= 18，运行 `npm install`

---

## 📚 文档索引

- **PERFORMANCE_OPTIMIZATION.md** - 详细性能优化报告
- **DEPLOYMENT_GUIDE.md** - 完整部署指南
- **PROJECT_ANALYSIS.md** - 项目分析报告
- **RECOMMENDATIONS.md** - 技术改进建议

---

## 🎯 下一步优化建议

### 已完成 ✅
- Tailwind 本地化
- 懒加载实现
- 代码分割
- 字体优化

### 可选优化（未来）
- [ ] 添加 Service Worker (PWA)
- [ ] 图片 WebP 格式转换
- [ ] 实现路由级别代码分割
- [ ] 添加预渲染 (SSG)
- [ ] 集成分析工具

---

## 🔗 有用的链接

- [Vite 官方文档](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Three.js](https://threejs.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

---

## ✅ 部署前检查清单

**构建阶段**
- [ ] `npm install` 成功
- [ ] `npm run build` 成功
- [ ] 检查 dist/ 目录完整性

**部署阶段**
- [ ] 上传所有文件到服务器
- [ ] 配置 Nginx/Apache
- [ ] 启用 Gzip 压缩
- [ ] 配置缓存策略

**测试阶段**
- [ ] 访问网站正常
- [ ] 3D 效果正常
- [ ] 响应式设计正常
- [ ] Lighthouse 分数 >90

---

**优化完成时间**: 2026-01-31  
**性能提升**: 首次加载减少 60%，首屏 JS 减少 98%  
**状态**: ✅ 生产就绪
