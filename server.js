const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// 代理获取虎牙直播流 URL
app.get('/huya/:id', async (req, res) => {
    const roomId = req.params.id;
    const apiUrl = `https://isus.cc/php/huya.php?id=${roomId}`;

    try {
        const response = await axios.get(apiUrl);
        const streamUrl = response.data; // 假设 API 返回的是流的 URL

        if (streamUrl) {
            res.json({ streamUrl });
        } else {
            res.status(404).json({ error: 'Stream not found' });
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
    console.log(`Server is running at http://localhost:${port}`);
});
