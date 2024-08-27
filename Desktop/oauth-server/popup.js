// Встановлюємо WebSocket-з'єднання
const socket = new WebSocket('wss://polar-shore-05125-b49ae913d73c.herokuapp.com');

// Обробка повідомлень від сервера
socket.onmessage = function(event) {
  const message = JSON.parse(event.data);

  if (message.action === 'login_success') {
    document.getElementById('status').textContent = 'Login successful!';
    document.getElementById('token').textContent = message.token;
    document.getElementById('login').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
  }
};

// При натисканні на кнопку логіну ініціюємо процес авторизації
document.getElementById('login').addEventListener('click', function() {
  browser.runtime.sendMessage({ action: 'login' });
});

// При натисканні на кнопку виходу
document.getElementById('logout').addEventListener('click', function() {
  document.getElementById('login').style.display = 'block';
  document.getElementById('logout').style.display = 'none';
  document.getElementById('token').textContent = '';
  document.getElementById('status').textContent = 'Logged out';
});
