browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'login') {
    const authUrl = 'https://polar-shore-05125-b49ae913d73c.herokuapp.com/oauth2/auth';

    browser.identity.launchWebAuthFlow({
      interactive: true,
      url: authUrl
    }).then(responseUrl => {
      console.log('Authorization in progress...');
    }).catch(error => {
      console.error('Authorization error:', error);
      sendResponse({ success: false, error: error.message });
    });

    return true; // Залишаємо порт відкритим для асинхронної відповіді
  }
});
