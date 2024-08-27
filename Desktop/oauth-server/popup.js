// Подключение к WebSocket серверу
const socket = new WebSocket('wss://polar-shore-05125-b49ae913d73c.herokuapp.com');

socket.onopen = function() {
  console.log('WebSocket: Connection established');
};

// Обработка сообщений от WebSocket сервера
socket.onmessage = function(event) {
  console.log('WebSocket: Message received from server:', event.data);
  const message = JSON.parse(event.data);

  if (message.action === 'login_success') {
    document.getElementById('status').textContent = 'Login successful!';
    document.getElementById('token').textContent = message.token;
    document.getElementById('login').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
  }
};

// Обработка нажатия на кнопку логина
document.getElementById('login').addEventListener('click', function() {
  console.log('Extension: Starting login process...');
  browser.runtime.sendMessage({ action: 'login' });
});

// Обработка нажатия на кнопку выхода
document.getElementById('logout').addEventListener('click', function() {
  console.log('Extension: Logging out...');
  document.getElementById('login').style.display = 'block';
  document.getElementById('logout').style.display = 'none';
  document.getElementById('token').textContent = '';
  document.getElementById('status').textContent = 'Logged out';
});
