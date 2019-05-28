const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const port = process.env.PORT || 8080;

const app = express();
app.use(favicon(__dirname + '/build/favicon-32x32.png'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
    console.log("pong");
    return res.send('pong');
});

app.listen(port);
console.log(`App is listening on port ${port}`);