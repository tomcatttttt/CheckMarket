app.get('/oauth2/callback', async (req, res) => {
  const authCode = req.query.code;

  if (!authCode) {
    return res.status(400).send('Authorization failed or no code received.');
  }

  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
      code: authCode,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }));

    const accessToken = tokenResponse.data.access_token;

    // Закриваємо вікно авторизації і повертаємо токен
    res.send(`
      <script>
        window.opener.postMessage({ accessToken: "${accessToken}" }, "*");
        window.close();
      </script>
    `);
  } catch (error) {
    res.status(500).send('Failed to exchange code for access token.');
  }
});
