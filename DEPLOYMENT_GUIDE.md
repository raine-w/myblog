# 服务器部署指南

本文档提供优化后的个人博客网站的服务器部署步骤和配置建议。

---

## 🚀 快速部署

### 1. 构建生产版本

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建产物位于 `dist/` 目录，包含：
- `index.html` - 入口文件
- `assets/` - CSS、JS 和其他资源
- `textures/` - 地球纹理文件

### 2. 部署到服务器

将 `dist/` 目录中的所有文件上传到服务器的 Web 根目录。

---

## 📋 服务器配置

### Nginx 配置（推荐）

创建或编辑 Nginx 配置文件：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/myblog/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/javascript application/xml+rss 
               application/json image/svg+xml;
    gzip_comp_level 6;

    # Brotli 压缩（如果支持）
    # brotli on;
    # brotli_types text/plain text/css text/xml text/javascript 
    #              application/javascript application/xml+rss 
    #              application/json image/svg+xml;

    # 单页应用路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存策略
    location ~* \.(js|css)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # HTML 文件不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # HTTP/2 服务器推送（可选）
    # http2_push_preload on;
}
```

### Apache 配置

创建或编辑 `.htaccess` 文件：

```apache
# 启用重写引擎
RewriteEngine On

# 单页应用路由支持
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Gzip 压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
    AddOutputFilterByType DEFLATE application/javascript application/json
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# 缓存策略
<IfModule mod_expires.c>
    ExpiresActive On
    
    # 静态资源长期缓存
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    
    # HTML 不缓存
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# 安全头部
<IfModule mod_headers.c>
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

## 🌐 CDN 部署（推荐）

使用 CDN 可以进一步提升全球访问速度。

### 1. Vercel 部署（最简单）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel
```

### 2. Netlify 部署

创建 `netlify.toml`：

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
```

然后：
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 部署
netlify deploy --prod
```

### 3. GitHub Pages 部署

添加到 `package.json`：

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

安装并部署：
```bash
npm install -D gh-pages
npm run deploy
```

---

## 🔒 HTTPS 配置

### 使用 Let's Encrypt（免费）

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书（Nginx）
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

Certbot 会自动修改 Nginx 配置以支持 HTTPS。

---

## 📊 性能监控

### 1. 启用访问日志分析

在 Nginx 配置中：

```nginx
# 访问日志
access_log /var/log/nginx/myblog-access.log combined;

# 错误日志
error_log /var/log/nginx/myblog-error.log warn;
```

### 2. 集成分析工具

在构建前添加 Google Analytics：

1. 安装依赖：
```bash
npm install react-ga4
```

2. 在 `App.tsx` 中初始化：
```typescript
import ReactGA from 'react-ga4';

// 在组件中
useEffect(() => {
  ReactGA.initialize('G-XXXXXXXXXX'); // 替换为你的 GA ID
  ReactGA.send('pageview');
}, []);
```

---

## 🎯 性能优化建议

### 1. 启用 HTTP/2

在 Nginx 中：
```nginx
listen 443 ssl http2;
```

### 2. 预压缩静态文件

```bash
# 安装 gzip
sudo apt-get install gzip

# 压缩所有 JS 和 CSS
cd dist/assets
find . -type f \( -name "*.js" -o -name "*.css" \) -exec gzip -k {} \;
```

Nginx 配置：
```nginx
gzip_static on;
```

### 3. 使用 CDN

推荐的 CDN 服务：
- Cloudflare（免费，全球节点）
- AWS CloudFront
- 阿里云 CDN
- 腾讯云 CDN

配置步骤：
1. 将 `dist/` 目录上传到 CDN
2. 设置源站为你的服务器
3. 配置缓存策略：
   - HTML: 不缓存
   - CSS/JS: 缓存 1 年
   - 图片: 缓存 1 年

---

## 🔧 故障排查

### 问题 1: 路由 404 错误

**症状**: 刷新页面时出现 404

**解决方案**: 确保服务器配置了单页应用路由支持（见上文 Nginx/Apache 配置）

### 问题 2: 字体无法加载

**症状**: 控制台显示 CORS 错误

**解决方案**: 添加 CORS 头部
```nginx
location ~* \.(woff|woff2|ttf|eot)$ {
    add_header Access-Control-Allow-Origin *;
}
```

### 问题 3: 3D 地球不显示

**症状**: 白屏或错误

**解决方案**: 
1. 确保纹理文件正确上传到 `dist/textures/`
2. 检查浏览器控制台错误
3. 确认 WebGL 支持

### 问题 4: 加载缓慢

**解决方案**:
1. 启用 Gzip/Brotli 压缩
2. 配置 CDN
3. 检查服务器带宽
4. 使用 Lighthouse 分析瓶颈

---

## 📝 部署检查清单

部署前检查：

- [ ] 运行 `npm run build` 成功
- [ ] 检查 `dist/` 目录内容完整
- [ ] 测试本地预览: `npm run preview`
- [ ] 验证所有资源路径正确
- [ ] 检查 `.env` 文件（如有敏感信息）

部署后检查：

- [ ] 访问主页加载正常
- [ ] 导航功能正常
- [ ] 3D 地球正常显示
- [ ] 粒子背景正常
- [ ] 所有图片加载
- [ ] 响应式设计在移动端正常
- [ ] HTTPS 证书有效
- [ ] 运行 Lighthouse 测试（目标 >90 分）

---

## 🚨 安全建议

1. **定期更新依赖**
```bash
npm audit
npm update
```

2. **环境变量管理**
- 不要将敏感信息提交到 Git
- 使用环境变量存储 API 密钥
- 在服务器上设置环境变量

3. **防火墙配置**
```bash
# UFW 示例
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

4. **定期备份**
- 备份服务器配置
- 备份静态文件
- 备份数据库（如果有）

---

## 📞 获取帮助

如果遇到部署问题：

1. 查看服务器日志：
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

2. 检查 Nginx 配置：
   ```bash
   sudo nginx -t
   ```

3. 重启服务：
   ```bash
   sudo systemctl restart nginx
   ```

---

## 🎉 部署完成

部署成功后，你的网站应该：

- ✅ 首次加载时间 < 1.5 秒
- ✅ Lighthouse Performance > 90
- ✅ 支持 HTTPS
- ✅ 全球 CDN 加速（如使用）
- ✅ 响应式设计完美
- ✅ SEO 友好

**享受你的高性能个人博客网站！** 🚀

---

**文档版本**: 1.0  
**最后更新**: 2026-01-31  
**适用版本**: Vite 6.4.1 构建产物
