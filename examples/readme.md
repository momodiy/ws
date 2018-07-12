### 什么是websocks

- 连接浏览器与服务器
- 快速发送数据
- 适用于消息互动场景
- 分为server端与client端

### 钩子函数

#### websocket实例对象
通过`new new WebSocket(`ws://${location.host}`)`创建的websocket对象
- onopen 连接成功触发
- onclose 关闭连接触发
- onerror 出现异常触发
- onmessage 发送消息时触发

#### websocket服务器对象
通过`const wss = new WebSocket.Server({server})
`创建的websocket服务器对象。
- wss.on('open',function)   
    - 打开连接触发
- wss.on('close',function)
    - 关闭连接触发
- wss.on('message',function)
    - 发送消息时触发

### readyState 连接状态
- CONNECTING：值为0，表示正在连接。
- OPEN：值为1，表示连接成功，可以通信了。
- CLOSING：值为2，表示连接正在关闭。
- CLOSED：值为3，表示连接已经关闭，或者打开连接失败。

### 基本流程

```
graph LR
登录-->打开连接-成功
登出-->打开连接-失败
登出-->登录
登录-->登出

```

### 轮询连接是否关闭
```js
const noop= () = {}
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);
```
### 发送信息
ws.send()
- 参数一：发送数据（String）
- 参数二：错误处理函数
- 参数三：发送间隔
```js
ws.send(JSON.stringify(process.memoryUsage()), function () { /* ignore errors */ });
  }, 100);
```