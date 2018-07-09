'use strict';

const session = require('express-session');
const express = require('express');
const http = require('http');
const uuid = require('uuid');

/*
* 真实引入的文件路径为根路径下的index.js文件
* 也可以写成 const WebSocket = require('../../index');
*
* 注：此时package.json文件中不应该有自己的入口文件（也就是不应该配置main属性）
* */
const WebSocket = require('../..');

const app = express();

//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
  saveUninitialized: false,
  secret: '$eCuRiTy',
  resave: false
});

//
// Serve static files from the 'public' folder.
//
app.use(express.static('public'));
app.use(sessionParser);

/*
 *
 * api 登录 */
app.post('/login', (req, res) => {
  /*
  * "Log in" user and set userId to session.
  * uuid is a npm package to generate unique id
  **/
  const id = uuid.v4();

  console.log(`Updating session for user ${id}`);
  req.session.userId = id;
  res.send({result: 'OK', message: 'Session updated'});
});

/*
* api：登出自动销毁session
* */
app.delete('/logout', (request, response) => {
  console.log('Destroying session');
  request.session.destroy();
  response.send({result: 'OK', message: 'Session destroyed'});
});

//
// Create HTTP server by ourselves.
//
const server = http.createServer(app);

const wss = new WebSocket.Server({
  verifyClient: (info, done) => {
    console.log('Parsing session from request...');
    sessionParser(info.req, {}, () => {
      console.log('Session is parsed!');

      //
      // We can reject the connection by returning false to done(). For example,
      // reject here if user is unknown.
      //
      done(info.req.session.userId);
    });
  },
  server
});

/*
* websocket连接时自动创建用户session
* */
wss.on('connection', (ws, req) => {
  console.log(req.connection);
  console.log(req.headers);
  ws.on('message', (message) => {
    //
    // Here we can now use session parameters.
    //
    console.log(`WS message ${message} from user ${req.session.userId}`);
  });
});

//
// Start the server.
//
server.listen(8080, () => console.log('Listening on http://localhost:8080'));
