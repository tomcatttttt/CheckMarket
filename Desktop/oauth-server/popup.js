document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login');
  const logoutButton = document.getElementById('logout');
  const statusText = document.getElementById('status');

  // Перевіряємо, чи збережений токен
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    statusText.textContent = "You are logged in.";
    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';
  } else {
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
  }

  loginButton.addEventListener('click', () => {
    browser.runtime.sendMessage({ action: 'login' }, response => {
      if (response.success) {
        localStorage.setItem('accessToken', 'your_access_token'); // Замінити на реальний токен
        statusText.textContent = "You are logged in.";
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
      } else {
        statusText.textContent = `Login failed: ${response.error}`;
      }
    });
  });

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('accessToken');
    statusText.textContent = "You are logged out.";
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
  });
});
