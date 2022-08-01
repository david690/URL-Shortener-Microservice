require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 5000;

let urlNumber = 1;
let sitesArray = [];

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  for (let site in sitesArray) {
    if (sitesArray[site].short_url == req.params.short_url) {
      res.redirect(sitesArray[site].original_url);
      return;
    }
  }
  res.send({ error: "No short URL found for the given input" });
});

app.post("/api/shorturl", function (req, res) {
  if (req.body.url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
    for (let site in sitesArray) {
      if (sitesArray[site].original_url == req.body.url) {
        res.send(sitesArray[site]);
        return;
      }
    }
    const newSite = { original_url: req.body.url, short_url: urlNumber };
    sitesArray.push(newSite);
    urlNumber = urlNumber + 1;
    res.send(newSite);
  } else {
    res.send({ error: 'invalid url' });

  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
