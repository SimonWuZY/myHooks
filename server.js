const express = require('express');

const app = express();

// 设置CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Cache-Control');
  next();
});

app.get('/events', (req, res) => {
  // 设置SSE头
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // 发送初始连接消息
  res.write('event: connected\ndata: {"message": "SSE connection established"}\n\n');

  const interval = setInterval(() => {
    const data = Math.random().toString();
    res.write(`event: MyEvent\ndata: ${data}\n\n`);
  }, 1000);

  // 当连接关闭时清理定时器
  req.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});