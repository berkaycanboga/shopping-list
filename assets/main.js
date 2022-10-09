const inputField = document.getElementById('inputField');
const addButton = document.getElementById('addButton');
const listOfItems = document.getElementById('listOfItems');
const clearAllButton = document.getElementById('clearAllButton');

const CONSTANTS = {'LOCAL_STORAGE_KEYS': {'PRODUCT_LIST': 'PRODUCT_LIST'}};

const getProductsDataFromLocalStorage = () => {
  const productListFromLocalStorage = localStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.PRODUCT_LIST);
  return JSON.parse(productListFromLocalStorage);
}

let productMetaInformations = getProductsDataFromLocalStorage() || [];

const fetchHepsiburadaData = source => {
  return fetch('http://localhost:5000/createProductMeta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ source })
  })
  .then(res => res.json());
}

const handleAddProduct = async () => {
  const productSource = inputField?.value;
  if (!productSource || !productSource.includes('https://www.hepsiburada.com')) {
    return;
  }
  const productMeta = await fetchHepsiburadaData(productSource);
  productMetaInformations.push(productMeta);

  inputField.value = '';
  updateProductDataInfoLocalStorage();
  updateProductlist();
}

const handleClearAllProduct = () => {
  productMetaInformations = [];
  listOfItems.innerHTML = '';
  updateProductDataInfoLocalStorage();
}

const updateProductlist = () => {
  const productMetaInformationsHTML = productMetaInformations.map(productMeta => {
    return `<li class="productInfo"><strong>Name:</strong> ${productMeta.title} <br><strong>Price:</strong> ${productMeta.price} ${productMeta.currencyElement} <br> <a href="${productMeta.src}" target="_blank" class="sourceUrl">Go to Product</a></li>`;
  })
  listOfItems.innerHTML = productMetaInformationsHTML.join('');
}

const updateProductDataInfoLocalStorage = () => {
  const stringifiedProductList = JSON.stringify(productMetaInformations);
  localStorage.setItem(CONSTANTS.LOCAL_STORAGE_KEYS.PRODUCT_LIST, stringifiedProductList)
}

updateProductlist();

clearAllButton?.addEventListener('click', handleClearAllProduct);
addButton?.addEventListener('click', handleAddProduct);