browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'login') {
    const authUrl = 'https://polar-shore-05125-b49ae913d73c.herokuapp.com/oauth2/auth';
    browser.identity.launchWebAuthFlow({
      interactive: true,
      url: authUrl
    }).then(responseUrl => {
      console.log('Authorization flow completed:', responseUrl);
      sendResponse({ success: true });
    }).catch(error => {
      console.error('Authorization error:', error);
      sendResponse({ success: false, error: error.message });
    });

    return true;  // This keeps the message channel open for sendResponse
  }
});
