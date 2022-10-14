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
  .then(res => res.json())
  .catch(err => console.log(err.message)) 
}

const handleAddProduct = async () => {
  const productSource = inputField?.value;
  const productMeta = await fetchHepsiburadaData(productSource);
  console.log(productMeta);
  inputField.value = '';

  if (productMeta.error) {
    console.log(productMeta.error)
    return;
  }
  productMetaInformations.push(productMeta);

  updateProductDataLocalStorage();
  updateProductList();
}

const handleClearAllProduct = () => {
  productMetaInformations = [];
  listOfItems.innerHTML = '';
  updateProductDataLocalStorage();
}

const updateProductList = () => {
  const productMetaInformationsHTML = productMetaInformations.map(productMeta => {
    return `<li class="productInfo"><strong>Name:</strong> ${productMeta.title} <br><strong>Price:</strong> ${productMeta.price} ${productMeta.currencyElement} <br> <a href="${productMeta.src}" target="_blank" class="sourceUrl">Go to Product</a></li>`;
  })
  listOfItems.innerHTML = productMetaInformationsHTML.join('');
}

const updateProductDataLocalStorage = () => {
  const stringifiedProductList = JSON.stringify(productMetaInformations);
  localStorage.setItem(CONSTANTS.LOCAL_STORAGE_KEYS.PRODUCT_LIST, stringifiedProductList)
}

updateProductList();

clearAllButton?.addEventListener('click', handleClearAllProduct);
addButton?.addEventListener('click', handleAddProduct);