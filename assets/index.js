const express = require('express');
const app = express();
const { fetchHepsiburadaProductMetaData } = require('./callProductDataFunction');
const cors = require('cors');
const source = 'http://localhost:5000/createProductMeta';

app.use(cors({
  origin: 'http://localhost:5000/createProductMeta',
  methods: ['POST']
}));

app.use(express.json());

app.post("/createProductMeta", async (req, res) => {
  if (!req.body?.source) {
    return res.status(400).send({ error: "Source is required" })
  }
  if (!req.body.source.includes("hepsiburada.com")) {
    return res.status(422).send({ error: "Source is in wrong format"})
  }
  try {
    const productMetaData = await fetchHepsiburadaProductMetaData(req.body.source)
    return res.send(productMetaData);
  } catch(err) {
    return res.status(422).send({ error: "Invalid source" })
  }
})

app.listen(5000, () => {
  console.log("app started");
})