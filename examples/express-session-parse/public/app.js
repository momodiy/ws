/* global fetch, WebSocket, location */
(() => {
  const messages = document.querySelector('#messages');
  const wsButton = document.querySelector('#wsButton');
  const logout = document.querySelector('#logout');
  const login = document.querySelector('#login');
  const noop = () => {
  };

  let text = document.getElementById('wsmsg');
  let btn = document.getElementById('sub');
  btn.disable = false;
  // 展示提示信息
  const showMessage = message => {
    messages.textContent += `\n\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  };
  // 根据response返回值
  const handleResponse = response => {
    return response.ok
      ? response.json().then(data => {
        return JSON.stringify(data, null, 2);
      })
      : Promise.reject(new Error('Unexpected response'));
  };

  login.onclick = () => {
    fetch('/login', {method: 'POST', credentials: 'same-origin'})
      .then(handleResponse)
      .then(showMessage('login success'))
      .catch(err => showMessage(err.message));
  };

  logout.onclick = () => {
    fetch('/logout', {method: 'DELETE', credentials: 'same-origin'})
      .then(handleResponse)
      .then(showMessage('logout success'))
      .then(() => (btn.onclick = noop))
      .catch(err => showMessage(err.message));
  };

  let ws;

  /*
  * 打开websocket连接
  * */

  wsButton.onclick = async () => {
    ws && console.log(ws.readyState);
    if (ws) {
      btn.onclick = ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    // connection success
    btn.disable = true;
    ws = await new WebSocket(`ws://${location.host}`);
    btn.onclick = () => {
      if (text.value === '') return;
      ws.send(text.value);
      showMessage(new Date() + ':              ' + text.value);
      text.value = '';
    };

    // 初始化websocket连接（hook函数 onerror、onopen、onclose）
    ws.onerror = () => showMessage('WebSocket error');
    ws.onopen = () => {
      btn.onclick = () => {
        if (text.value === '') return;
        ws.send(text.value, () => console.log('send error'));
        showMessage(new Date() + ':              ' + text.value);
        text.value = '';
      };
      showMessage('WebSocket connection established');
    }
    ws.onclose = () => {
      btn.onclick = noop;
      showMessage('WebSocket connection closed');
    };
  };
})();
