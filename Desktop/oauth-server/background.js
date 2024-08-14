browser.browserAction.onClicked.addListener(() => {
  const clientId = '1094772266793-hr8h91uahoihjljmvob0j8c7cc65tdpa.apps.googleusercontent.com';
  const redirectUri = browser.identity.getRedirectURL();
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile`;

  browser.identity.launchWebAuthFlow({
    interactive: true,
    url: authUrl
  }).then(responseUrl => {
    const url = new URL(responseUrl);
    const accessToken = url.hash.match(/access_token=([^&]+)/)[1];
    console.log('Access Token:', accessToken);
    // Дальше обрабатывайте токен и делайте запросы к API Google
  }).catch(error => {
    console.error('Ошибка авторизации:', error);
  });
});
