const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = process.env.PORT || 3000;

const clientId = '1094772266793-03f0tvn4rrlerbod62n81fr6fjk8kbst.apps.googleusercontent.com';
const clientSecret = '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';
const redirectUri = 'https://polar-shore-05125-b49ae913d73c.herokuapp.com/oauth2/callback';

let wsClient = null;
let storedToken = null;

// Обробка WebSocket з'єднання
wss.on('connection', (ws) => {
    console.log('WebSocket: Client connected');
    wsClient = ws;

    // Якщо токен вже є, відправляємо його клієнту
    if (storedToken) {
        console.log('WebSocket: Sending stored token to client');
        wsClient.send(JSON.stringify({ action: 'login_success', token: storedToken }));
        storedToken = null; // очищаємо збережений токен після відправлення
    }

    ws.on('close', () => {
        console.log('WebSocket: Client disconnected');
        wsClient = null;
    });
});

// Маршрут для початку авторизації
app.get('/oauth2/auth', (req, res) => {
    console.log('Auth Route: Redirecting to Google Auth...');
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/calendar.readonly&access_type=offline&prompt=consent`;
    res.redirect(authUrl);
});

// Маршрут для обробки callback після авторизації
app.get('/oauth2/callback', async (req, res) => {
    const authCode = req.query.code;

    if (!authCode) {
        console.log('Callback Route: Authorization failed or no code received');
        return res.status(400).send('Authorization failed or no code received.');
    }

    console.log('Callback Route: Authorization code received:', authCode);
    console.log('Callback Route: Exchanging code for access token...');

    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
            code: authCode,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        }));

        const accessToken = tokenResponse.data.access_token;
        console.log('Callback Route: Access token received:', accessToken);

        // Відправка повідомлення розширенню через WebSocket
        if (wsClient) {
            console.log('WebSocket: Sending access token to client');
            wsClient.send(JSON.stringify({ action: 'login_success', token: accessToken }));
        } else {
            console.log('WebSocket: No WebSocket client connected to send token, saving it for later.');
            storedToken = accessToken;
        }

        res.send(`
            <script>
                console.log('Callback Route: Sending token to opener');
                window.opener.postMessage({ accessToken: "${accessToken}" }, "*");
                window.close();
            </script>
        `);
    } catch (error) {
        console.error('Error exchanging code for token:', error.response ? error.response.data : error.message);
        res.status(500).send('Failed to exchange code for access token.');
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
