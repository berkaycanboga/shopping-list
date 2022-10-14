const express = require('express');
const app = express();
const { fetchHepsiburadaProductMetaData, fetchTrendyolProductMetaData } = require('./callProductDataFunction');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5000/createProductMeta',
  methods: ['POST']
}));

app.use(express.json());

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