const axios = require('axios');
const cheerio = require('cheerio');

const fetchHepsiburadaProductMetaData = (src) => {
  return axios(src)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html);
      let data;

      $('.product-information', html).each(function() {
          const title = $(this).find('h1#product-name')?.text()?.trim();
          if (!title || title === '') {
            console.log('Title not found');
            return;
          }

          const priceElement = $(this).find("[itemprop='price']")?.prop("content");
          if (!priceElement || priceElement === '') {
            console.log('Price not found');
            return;
          }

          let priceWithoutDiscount = $(this).find(".price-old").text();
          if (!priceWithoutDiscount || priceWithoutDiscount === '') {
            priceWithoutDiscount = 'There is no discount available'
          }

          const currencyElement = $(this).find("[itemprop='priceCurrency']")?.text().trim();
          if (!currencyElement || currencyElement === '') {
            return;
          }
        
          const price = parseFloat(priceElement).toFixed(2);
          
          data = { title, priceWithoutDiscount, price, src, currencyElement };
      })
      return data;
    })
}

const fetchTrendyolProductMetaData = (src) => {
  return axios(src)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html);
      let data;

      $('.product-container', html).each(function() {
          const title = $(this).find(".pr-new-br span")?.text()?.trim();
          if (!title || title === '') {
            console.log('Title not found');
            return;
           }

          const price = $(this).find(".prc-dsc").text();
          if (!price || price === '') {
            console.log('Price not found');
            return;
          }

          let priceWithoutDiscount = $(this).find(".prc-org").text();
          if (!priceWithoutDiscount || priceWithoutDiscount === '') {
            priceWithoutDiscount = 'There is no discount available'
          }
                  
          data = { title, priceWithoutDiscount, price, src };
      })
      return data;
    })
}

module.exports = { fetchHepsiburadaProductMetaData, fetchTrendyolProductMetaData };