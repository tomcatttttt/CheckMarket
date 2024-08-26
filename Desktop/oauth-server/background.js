browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'login') {
    const clientId = '1094772266793-hr8h91uahoihjljmvob0j8c7cc65tdpa.apps.googleusercontent.com';
    const redirectUri = "https://polar-shore-05125-b49ae913d73c.herokuapp.com/oauth2/callback";
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile`;

    browser.identity.launchWebAuthFlow({
      interactive: true,
      url: authUrl
    }).then(responseUrl => {
      const url = new URL(responseUrl);
      const accessToken = url.hash.match(/access_token=([^&]+)/)[1];
      console.log('Access Token:', accessToken);
      // Далі обробляємо токен і робимо запити до API Google
      sendResponse({ success: true, token: accessToken });
    }).catch(error => {
      console.error('Помилка авторизації:', error);
      sendResponse({ success: false, error: error.message });
    });

    // Вказуємо, що ми хочемо повернути асинхронну відповідь
    return true;
  }
});
