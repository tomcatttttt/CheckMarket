const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Обработчик для /oauth2/callback
app.get('/oauth2/callback', (req, res) => {
    // Здесь вы можете обработать полученный код авторизации
    const authorizationCode = req.query.code;
    if (authorizationCode) {
        res.send(`Authorization code received: ${authorizationCode}`);
    } else {
        res.send('Authorization failed or no code received.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
