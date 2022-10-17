const express = require('express');
const app = express();
const { fetchHepsiburadaProductMetaData, fetchTrendyolProductMetaData } = require('./callProductData');
const cors = require('cors');

app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const CRAWLER_ADAPTERS = {
 "hepsiburada.com": fetchHepsiburadaProductMetaData,
 "trendyol.com": fetchTrendyolProductMetaData,
}

app.post("/createProductMeta", async (req, res) => {
  if (!req.body.source) {
    return res.status(400).send({ error: "Source is required" });
  }
  
  const sourceUrl = new URL(req.body.source);
  
  if (!Object.keys(CRAWLER_ADAPTERS).some(key => key === sourceUrl?.hostname)) {
    return res.status(422).send({ error: "Invalid source" });
  }
  
  const adapter = CRAWLER_ADAPTERS[sourceUrl.hostname];
  
  try {
    return res.send(await adapter(sourceUrl));
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }
});

app.listen(5000, () => {
  console.log("app started");
});
