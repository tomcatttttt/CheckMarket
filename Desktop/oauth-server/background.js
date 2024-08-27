browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'login') {
    const authUrl = 'https://polar-shore-05125-b49ae913d73c.herokuapp.com/oauth2/auth';

    browser.identity.launchWebAuthFlow({
      interactive: true,
      url: authUrl
    }).then(() => {
      console.log('Authorization flow started.');
    }).catch(error => {
      console.error('Authorization error:', error);
      sendResponse({ success: false, error: error.message });
    });

    // Обробка отриманого повідомлення з токеном
    window.addEventListener('message', (event) => {
      if (event.data && event.data.success) {
        console.log('Access Token:', event.data.token);
        sendResponse({ success: true, token: event.data.token });
      }
    });

    return true; // Вказуємо, що відповідь буде надіслано асинхронно
  }
});
