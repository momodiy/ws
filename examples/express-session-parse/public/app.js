/* global fetch, WebSocket, location */
(() => {
  const messages = document.querySelector('#messages');
  const wsButton = document.querySelector('#wsButton');
  const logout = document.querySelector('#logout');
  const login = document.querySelector('#login');

  let text = document.getElementById('wsmsg')
  let btn = document.getElementById('sub')
  btn.disable = false;
  // 展示提示信息
  const showMessage = message => {
    messages.textContent += `\n\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  };
  // 根据response返回值
  const handleResponse = response => {
    return response.ok
      ? response.json().then((data) => {
        console.log('handle response data---------------');
        console.log(data);
        return JSON.stringify(data, null, 2);
      })
      : Promise.reject(new Error('Unexpected response'));
  };

  login.onclick = () => {
    fetch('/login', {method: 'POST', credentials: 'same-origin'})
      .then(handleResponse)
      .then(showMessage('login success'))
      .catch((err) => showMessage(err.message));
  };

  logout.onclick = () => {
    fetch('/logout', {method: 'DELETE', credentials: 'same-origin'})
      .then(handleResponse)
      .then(showMessage('logout success'))
      .catch((err) => showMessage(err.message));
  };

  let ws;

  /*
  * 打开websocket连接
  * */
  wsButton.onclick = () => {
    console.log(ws);

    if (ws) {
      btn.disable = false;
      ws.onerror = ws.onopen = ws.onclose = null;
      btn.onclick = () => {
      };
      return ws.close();
    }
    btn.disable = true;

    // 初始化websocket连接（hook函数 onerror、onopen、onclose）
    ws = new WebSocket(`ws://${location.host}`);
    ws.onerror = () => showMessage('WebSocket error');
    ws.onopen = () => showMessage('WebSocket connection success');
    ws.onclose = () => showMessage('WebSocket close success');


    btn.onclick = () => {
      if (text.value === '') return;
      ws.send(text.value);
      showMessage(new Date() + ':              ' + text.value);
      text.value = '';
    };
  };
})();
