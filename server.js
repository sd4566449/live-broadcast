const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = 3000;

// 代理获取虎牙直播流 URL
app.get('/huya/:id', async (req, res) => {
    const roomId = req.params.id;
    const apiUrl = `https://www.huya.com/${roomId}`; // 获取虎牙房间页面

    try {
        // 请求虎牙房间页面
        const response = await axios.get(apiUrl);
        
        // 使用 cheerio 解析页面
        const $ = cheerio.load(response.data);
        
        // 找到直播流的 .m3u8 地址
        const streamUrl = $('script')
            .toArray()
            .map(script => $(script).html())
            .find(scriptContent => scriptContent && scriptContent.includes('hdUrl'));
        
        if (streamUrl) {
            // 提取 .m3u8 URL
            const m3u8UrlMatch = streamUrl.match(/"hdUrl":"(http[^"]+\.m3u8)"/);
            if (m3u8UrlMatch) {
                const m3u8Url = m3u8UrlMatch[1];
                res.json({ m3u8Url });
            } else {
                res.status(404).json({ error: 'No .m3u8 URL found' });
            }
        } else {
            res.status(404).json({ error: 'Stream URL not found on page' });
        }
    } catch (error) {
        console.error('Failed to fetch stream URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 默认路由，查看是否能正常访问
app.get('/', (req, res) => {
    res.send('Welcome to the live stream proxy server! Use /huya/:id to get stream URLs.');
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
});