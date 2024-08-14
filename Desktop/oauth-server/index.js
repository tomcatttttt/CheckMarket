browser.browserAction.onClicked.addListener(() => {
    const clientId = '1094772266793-hr8h91uahoihjljmvob0j8c7cc65tdpa.apps.googleusercontent.com';
    const redirectUri = browser.identity.getRedirectURL();
    const scope = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

    browser.identity.launchWebAuthFlow({
        interactive: true,
        url: authUrl
    }).then(redirectUrl => {
        const token = new URL(redirectUrl).hash.split("&")[0].split("=")[1];
        console.log("Token received: ", token);

        // Використання токена для отримання даних користувача
        fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('User info:', data);
            // Обробка даних користувача
        })
        .catch(error => console.error('Error fetching user info:', error));
    }).catch(error => {
        console.error("Error during Google Sign-In: ", error);
    });
});
