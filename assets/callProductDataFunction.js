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

          const priceElement = $(this).find("[itemprop='price']")?.prop("content").replace('.', ',');
          if (!priceElement || priceElement === '') {
            console.log('Price not found');
            return;
          }

          let priceWithoutDiscount = $(this).find("[del='price-old active']").text();
          if (!priceWithoutDiscount || priceWithoutDiscount === '') {
            priceWithoutDiscount = 'There is no discount available'
          }

          const currencyElement = $(this).find("[itemprop='priceCurrency']")?.text().trim();
          if (!currencyElement || currencyElement === '') {
            return;
          }
          
          let ratingValue = $(this).find(".rating-star").text();
          if (!ratingValue || ratingValue === '') {
            ratingValue = 'No rating information for this product';
          }
          
          const price = priceElement + ' ' + currencyElement;

          data = { title, priceWithoutDiscount, price, ratingValue, src };
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

          const ratingValue = $(this).find(".review-tooltip-content div .tltp-avg-cnt").text();
          console.log(ratingValue);
                  
          data = { title, priceWithoutDiscount, price, ratingValue, src };
      })
      return data;
    })
}

module.exports = { fetchHepsiburadaProductMetaData, fetchTrendyolProductMetaData };