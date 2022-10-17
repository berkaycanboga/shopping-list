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
  const generateId = Math.random().toString(36).substr(2, 9);

  productMeta.id = generateId;
  inputField.value = '';

  if (productMeta.error) {
    console.log(productMeta.error)
    return;
  }

  productMetaInformations.push(productMeta);

  updateProductDataLocalStorage();
  updateProductList();
}

const handleDeleteProduct = (id) => {
  productMetaInformations = productMetaInformations.filter(productMeta => productMeta.id !== id);

  updateProductDataLocalStorage();
  updateProductList();
}

const handleClearAllProduct = () => {

  productMetaInformations = [];
  listOfItems.innerHTML = '';

  updateProductDataLocalStorage();
  updateProductList();
}

const updateProductList = () => {
  const productMetaInformationsHTML = productMetaInformations.map(productMeta => {
    return `<li class="productInfo"
    <input type="hidden" id: ${productMeta.id}>
    <strong>Name:</strong> ${productMeta.title}
    <br><strong>Without Discount:</strong> ${productMeta.priceWithoutDiscount} <br><strong>Price:</strong> ${productMeta.price} 
    <br><strong>Rating:</strong> ${productMeta.ratingValue}
    <br><a href="${productMeta.src}" target="_blank" class="sourceUrl">Go to Product</a>
    <button onclick="handleDeleteProduct('${productMeta.id}')" class="deleteButton">X</button>
    </li>`;
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