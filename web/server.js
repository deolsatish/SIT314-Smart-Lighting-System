const express = require('express');
const app = express();
app.use(express.static('public'));
app.use((req, res, next) => {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});
const port = process.env.PORT || 3000;
const base = `${__dirname}/public`;
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(`${base}/get-started.html`);
});
app.get('/Smart-Light-Devices-List', (req, res) => {
    res.sendFile(`${base}/Smart-Light-Devices-List.html`);
});
app.get('/register-device', (req, res) => {
    res.sendFile(`${base}/register-device.html`);
});
app.get('/send-command', (req, res) => {
    res.sendFile(`${base}/send-command.html`);
});
app.get('/notifications', (req, res) => {
    res.sendFile(`${base}/notifications.html`);
});

app.get('/registration', (req, res) => {
    res.sendFile(`${base}/registration.html`);
});
app.get('/login', (req, res) => {
    res.sendFile(`${base}/login.html`);
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
app.get('*', (req, res) => {
    res.sendFile(`${base}/404.html`);
});
app.get('/about', (req, res) => {
    res.sendFile(`${base}/about-me.html`);
});
app.get('/api/test', (req, res) => {
    res.send('The API is working!');
    });