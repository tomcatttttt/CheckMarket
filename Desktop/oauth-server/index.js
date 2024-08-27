const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const app = express();
const port = process.env.PORT || 3000;

const clientId = '1094772266793-03f0tvn4rrlerbod62n81fr6fjk8kbst.apps.googleusercontent.com';
const clientSecret = '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';
const redirectUri = 'https://polar-shore-05125-b49ae913d73c.herokuapp.com/oauth2/callback';

// Маршрут для початку авторизації
app.get('/oauth2/auth', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/calendar.readonly&access_type=offline&prompt=consent`;
  res.redirect(authUrl);
});

// Маршрут для обробки зворотного виклику після авторизації
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
    console.error('Error exchanging code for token:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to exchange code for access token.');
  }
});

// Маршрут для отримання подій з Google Calendar
app.get('/calendar/events', async (req, res) => {
  const accessToken = req.query.access_token;

  if (!accessToken) {
    return res.status(400).send('Access token is required.');
  }

  try {
    const eventsResponse = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.json(eventsResponse.data);
  } catch (error) {
    console.error('Error fetching calendar events:', error.response ? error.response.data : error.message);
    res.status(500).send('Failed to fetch calendar events.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
