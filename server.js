const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;  // 你可以修改端口

// 假设我们在这里获取虎牙的直播流
app.get('/huya/:id', async (req, res) => {
    const roomId = req.params.id;
    const streamUrl = await getHuyaStreamUrl(roomId);
    if (streamUrl) {
        res.json({ streamUrl });
    } else {
        res.status(404).json({ error: 'Stream not found' });
    }
});

// 模拟从虎牙获取直播流的函数
async function getHuyaStreamUrl(roomId) {
    // 这里是模拟的例子，实际情况你需要根据房间号去抓取或访问相关API
    // 假设我们通过API或者抓包获取的流链接
    return `rtmp://huya.com/live/${roomId}`;
}

// 启动服务器
app.listen(port, () => {
    console.log(`代理服务器正在运行，访问地址：http://localhost:${port}`);
});