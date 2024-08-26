document.getElementById('login').addEventListener('click', () => {
  // Надсилаємо повідомлення до background.js для запуску авторизації
  browser.runtime.sendMessage({ action: 'login' })
    .then(response => {
      console.log('Login initiated:', response);
    })
    .catch(error => {
      console.error('Error during login:', error);
    });
});
