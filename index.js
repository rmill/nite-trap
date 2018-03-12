"use strict"

const cheerio = require('cheerio');
const express = require('express')
const request = require('request-promise');

const CAMS_URI = 'https://chaturbate.com/followed-cams/';
const GIRL_URI = 'https://chaturbate.com/';

const app = express();
app.use(require('express-promise')());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/cams', (req, res) => {
  const options = {
    uri: CAMS_URI,
    headers: {
      cookie: 'sessionid=0978q4oqj82h1m2ld4lm0oxxdu60gsdh'
    },
    transform: (body) => { return cheerio.load(body); }
  };

  request(options)
    .then(($) => {
        const onlineGirls = [];
        const links = $('.thumbnail_label_c_hd, .thumbnail_label_c_new').siblings('a').each((i , elem) => {
          onlineGirls.push(elem.attribs.href);
        });
        res.end(JSON.stringify(onlineGirls));
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

app.get('/cams/:girl', (req, res) => {
  const options = {
    uri: GIRL_URI + req.params.girl,
    headers: {
      cookie: 'sessionid=0978q4oqj82h1m2ld4lm0oxxdu60gsdh'
    }
  };

  request(options)
    .then((body) => {
        const stream = body.match(/http(.*).m3u8/);
        if (stream) {
          res.end(stream[0]);
        } else {
          res.status(404).end();
        }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
