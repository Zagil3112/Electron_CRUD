//Capturar el formulario
const productForm = document.getElementById('productForm');

// Exponer las funciones de main.js
const {remote} = require('electron');
const main = remote.require('./main');

//Capturar datos de los elementos del formulario
const productName = document.getElementById('name');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');

//Captura el div donde se localizan los productos para renderizarlos 
const productsList = document.getElementById("products");

let products = [];
let editingStatus = false;
let editProductId;

productForm.addEventListener('submit', async(e) => {
    try {
        e.preventDefault(); // Evitar que se refresque la app 
        const newProduct = {
            name: productName.value,
            price: productPrice.value,
            description: productDescription.value
        }

        if (!editingStatus){
            const result = await main.createProduct(newProduct); 
            console.log(result);
        } else {
            await main.updateProduct(editProductId,newProduct);
            editingStatus = false;
            editProductId = "";
        }

        productForm.reset();
        productName.focus();  
        getProducts();
    } catch (error) {
        console.log(error)
    }
    
});

async function deleteProducts(id){
    const response = confirm("Are you sure you want to delete it?");

    if (response){
        await main.deleteProducts(id);
        await getProducts();
    }
    return;
}

async function editProduct(id){

    const product=  await main.getProductById(id);
    productName.value = product.name;
    productPrice.value = product.price;
    productDescription.value = product.description;

    editingStatus = true;
    editProductId = id;
};


function renderProducts(products){
    productsList.innerHTML ='';
    products.forEach((product) => {
        productsList.innerHTML+= `
            <div class = "card card-body my-2 animated fadeInLeft">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <h3>${product.price}</h3>
                <p>
                    <button class = "btn btn-danger btn-sm" onclick="deleteProducts('${product.id}')">
                        DELETE
                    </button>
                    <button class = "btn btn-secondary btn-sm" onclick="editProduct('${product.id}')">
                        EDIT
                    </button>
                </p>
            </div>
        `;
    })
}


const getProducts = async () => {
    products = await main.getProducts(); 
    renderProducts(products);   

}

async function init(){
   await getProducts(); 
}

init();
