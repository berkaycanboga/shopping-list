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
          const priceElement = $(this).find('[itemprop="price"]')?.prop("content");
          if (!priceElement || priceElement === '') {
            console.log('Price not found');
            return;
          }
          const currencyElement = $(this).find('[itemprop="priceCurrency"]')?.text().trim();
          if (!currencyElement || currencyElement === '') {
            return;
          }
        
          const price = parseFloat(priceElement).toFixed(2);
          
          data = { title, price, src, currencyElement };
    })
      return data;
    })
}

module.exports = { fetchHepsiburadaProductMetaData };