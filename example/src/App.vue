<script lang="ts" setup>
import "@halo-dev/richtext-editor/dist/style.css";
import { computed, ref, watchEffect } from "vue";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import {
  allExtensions,
  RichTextEditor,
  useEditor,
} from "@halo-dev/richtext-editor";

const content =
  ref(`<katex content="\\langle\\nabla{L(\\gamma(t),t)},d_{t}\\gamma(t)\\rangle\\geq|\\nabla{L}|_{m}|d_{t}\\gamma(t)|_{m}"></katex><p>原文地址：https://halo.run/archives/halo-and-webp</p><h2>是什么</h2><blockquote><p>WebP的有损压缩算法是基于VP8视频格式的帧内编码[17]，并以RIFF作为容器格式。[2] 因此，它是一个具有八位色彩深度和以1:2的比例进行色度子采样的亮度-色度模型（YCbCr 4:2:0）的基于块的转换方案。[18] 不含内容的情况下，RIFF容器要求只需20字节的开销，依然能保存额外的 元数据(metadata)。[2] WebP图像的边长限制为16383像素。</p></blockquote><p>在 WebP 的官网中，我们可以发现 Google 是这样宣传 WebP 的：</p><blockquote><p>WebP lossless images are 26% smaller in size compared to PNGs. WebP lossy images are 25-34% smaller than comparable JPEG images at equivalent SSIM quality index.</p></blockquote><p>简单来说，WebP 图片格式的存在，让我们在 WebP 上展示的图片体积可以有较大幅度的缩小，也就带来了加载性能的提升。（摘自 https://nova.moe/re-introduce-webp-server）</p><h2>怎么做</h2><p>那么如何优雅的在不替换图片地址的情况下，将图片转为 webp 格式然后输出呢？</p><p>这时候就可以使用 webp-sh 组织最新开源的 webp_server_go 了，它的大概原理就是：当我们请求一张图片的时候使用 web 代理工具转发到 <code>webp_server_go</code> 应用进行处理，处理完成之后返回 webp 格式的图片，并且会保留处理后的图片以供后面的访问。</p><p>目前大部分主流浏览器都已经支持了 webp 图片的显示，除了 Safari，但是不必担心，webp_server_go 会自动判断请求来源是否为 Safari，如果是，那么会返回原图。</p><p>下面将提供两种 web 服务器的代理方法。</p><blockquote><p>此教程以 CentOS 7.x 为例，其他发行版本大同小异。另外，此教程只针对于 Halo，其他 web 程序可能在 config.json 部分有所不同，建议参考仓库的 README。</p></blockquote><h3>部署 webp_server_go</h3><p>在 仓库 的 README 中已经大致讲解了部署方法，在这里针对 Halo 详细说明一下。</p><h4>下载官方编译好的 webp_server_go 二进制文件</h4><blockquote><p>如果你有能力，也可以自行编译。</p></blockquote><p>新建一个存放二进制文件和 config.json 文件的目录（可自定义）：</p><pre><code class="language-bash">mkdir /opt/webps

cd /opt/webps</code></pre><p>下载二进制文件（最新版本请访问 releases）：</p><pre><code class="language-bash">wget https://github.com/webp-sh/webp_server_go/releases/download/0.1.0/webp-server-linux-amd64 -O webp-server</code></pre><p>给予执行权限：</p><pre><code class="language-bash">chmod +x webp-server</code></pre><h4>创建 config.json</h4><pre><code class="language-json">{
        "HOST": "127.0.0.1",
        "PORT": "3333",
        "QUALITY": "80",
        "IMG_PATH": "/root/.halo",
        "EXHAUST_PATH": "/root/.halo/cache",
        "ALLOWED_TYPES": ["jpg","png","jpeg"]
}</code></pre><p>参数解释：</p><ul><li><p>HOST：一般不修改。</p></li><li><p>PORT：webp_server_go 的运行端口。</p></li><li><p>QUALITY：转换质量，默认为 80%。</p></li><li><p>IMG_PATH：固定格式，/运行 Halo 的用户名/.halo</p></li><li><p>EXHAUST_PATH：固定格式，/运行 Halo 的用户名/.halo/cache</p></li><li><p>ALLOWED_TYPES：需要转换的格式</p></li></ul><h4>使用 systemd 进行状态管理</h4><p>创建 service 文件：</p><pre><code class="language-bash">vim /etc/systemd/system/webps.service</code></pre><p>写入：</p><pre><code class="language-bash">[Unit]
Description=WebP Server
Documentation=https://github.com/n0vad3v/webp_server_go
After=nginx.target

[Service]
Type=simple
StandardError=journal
AmbientCapabilities=CAP_NET_BIND_SERVICE
WorkingDirectory=/opt/webps
ExecStart=/opt/webps/webp-server --config /opt/webps/config.json
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=3s


[Install]
WantedBy=multi-user.target</code></pre><p>需要注意的是，ExecStart 命令中的程序路径和配置文件路径一定要正确，结合你的实际情况填写。</p><p>然后执行：</p><pre><code class="language-bash">systemctl daemon-reload
systemctl enable webps.service
systemctl start webps.service</code></pre><p>查看运行状态：</p><pre><code class="language-bash">systemctl status webps.service</code></pre><p>如果没有问题，那么会输出以下日志：</p><pre><code class="language-bash">WebP Server is running at 127.0.0.1:3333</code></pre><h3>使用 Nginx 进行代理</h3><blockquote><p>如果你的 Halo 是使用 Nginx 反向代理的话。</p></blockquote><h4>修改 halo.conf</h4><p>在 server 节点添加：</p><pre><code class="language-nginx">location ^~ /upload/ {
        proxy_pass http://127.0.0.1:3333;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_hide_header X-Powered-By;
        proxy_set_header HOST $http_host;
        add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
}</code></pre><p>重载 Nginx 配置：</p><pre><code class="language-bash"># 检查配置文件是否有问题
nginx -t

nginx -s reload</code></pre><h3>使用 Caddy 进行代理</h3><blockquote><p>如果你的 Halo 是使用 Caddy 反向代理的话。</p></blockquote><h4>修改 Caddyfile</h4><p>在你域名节点下添加：</p><pre><code class="language-bash">proxy /upload/ localhost:3333 {
  transparent
}</code></pre><p>重启 Caddy：</p><pre><code class="language-bash">service caddy restart</code></pre><p>教程完毕，下面讲一下如何验证是否生效。</p><h3>验证是否生效</h3><p></p><p>注意看 <code>Type</code> 列，图片的返回格式已经变成了 webp，而且图片大小已经远远降低，那么说明你的配置已经成功了。have fun!</p><p>如果用的开心，请关注一下 https://github.com/webp-sh/webp_server_go 哦！另外，他们还有其他语言的版本，请查看 https://github.com/webp-sh。</p><h3>链接：</h3><ul><li><p>https://github.com/webp-sh/webp_server_go</p></li><li><p>让站点图片加载速度更快——引入 WebP Server 无缝转换图片为 WebP</p></li><li><p>个人网站无缝切换图片到 webp</p></li></ul>`);

const editor = useEditor({
  content: content.value,
  extensions: [...allExtensions],
  onUpdate: () => {
    content.value = editor.value?.getHTML() + "";
  },
});

const formatContent = computed(() => {
  return unified()
    .use(rehypeParse)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .processSync(content.value);
});

watchEffect(() => {
  console.log(String(formatContent.value));
});
</script>

<template>
  <RichTextEditor v-if="editor" :editor="editor" />
</template>
