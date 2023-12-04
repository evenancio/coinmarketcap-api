const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const port = process.env.PORT || 8081;

app.get('/currencies/:type', async (req, res) => {
  try {
    const url = `https://coinmarketcap.com/currencies/${req.params.type}/`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const priceUSD = +$('.priceValue')
      .text()
      .replace(/[^0-9.-]+/g, '');
    res.send({
      coin: req.params.type,
      priceUSD,
    });
  } catch (error) {
    res.send({ isError: true, message: 'it does not support this coin' });
  }
});

app.listen(port, () => {
  console.info(`Running or port ${port}`);
});
