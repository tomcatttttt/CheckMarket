document.getElementById('login').addEventListener('click', () => {
  browser.runtime.sendMessage({ action: 'login' });
});
