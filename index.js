const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

const port = process.env.PORT || 8081;

app.get('/currencies/:type', async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const url = `https://coinmarketcap.com/currencies/${req.params.type}/`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector(
      '#section-coin-overview > div.sc-f70bb44c-0.flfGQp.flexStart.alignBaseline > span',
      {
        visible: true,
        timeout: 60000,
      }
    );

    const priceElement = await page.$(
      '#section-coin-overview > div.sc-f70bb44c-0.flfGQp.flexStart.alignBaseline > span'
    );
    const price = await page.evaluate(
      (element) => element.textContent,
      priceElement
    );
    const priceUSD = +price.replace(/[^0-9.-]+/g, '');
    res.send({
      coin: req.params.type,
      priceUSD,
    });
  } catch (error) {
    res.send({ isError: true, message: 'it does not support this coin' });
  } finally {
    await browser.close();
  }
});

app.listen(port, () => {
  console.info(`Running or port ${port}`);
});
