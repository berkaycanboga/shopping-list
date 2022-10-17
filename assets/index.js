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

app.post("/createProductMeta", async (req, res) => {
  if (!req.body.source) {
    return res.status(400).send({ error: "Source is required" });
  }
  
  const sourceUrl = new URL(req.body.source);

  if (sourceUrl?.hostname?.includes("hepsiburada.com")) {
    const productMetaData = await fetchHepsiburadaProductMetaData(req.body?.source);
    return res.send(productMetaData);

  } else if (sourceUrl?.hostname?.includes("trendyol.com")) {
    const productMetaData = await fetchTrendyolProductMetaData(req.body?.source);
    return res.send(productMetaData);

  } else {
    return res.status(422).send({ error: "Invalid source" });
  }
});

app.listen(5000, () => {
  console.log("app started");
});