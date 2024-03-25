

//Capturar el formulario
const productForm = document.getElementById('productForm');

// Exponer las funciones de main.js
//const {remote} = require('electron');
//const main = remote.require('./main');

//Capturar datos de los elementos del formulario
const productName = document.getElementById('name');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');

//Captura el div donde se localizan los productos para renderizarlos 
const productsList = document.getElementById("products");

let products = [];


productForm.addEventListener('submit', async(e) => {
    try {
        e.preventDefault(); // Evitar que se refresque la app 
        const newProduct = {
            name: productName.value,
            price: productPrice.value,
            description: productDescription.value
        }


        // Enviar datos a main
        //ipcRendererSender.send('product:create',newProduct);

        ipcRendererSender.invoke('product:create', newProduct).then((result) => {
            console.log(result);
        })
        
        //const result = await main.createProduct(newProduct); 
        //console.log(result);      
        

        productForm.reset();
        productName.focus();  
        getProducts();
    } catch (error) {
        console.log(error)
    }
    
});



function renderProducts(products){
    productsList.innerHTML ='';
    products.forEach((product) => {
        productsList.innerHTML+= `
            <div class = "card card-body my-2 animated fadeInLeft">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <h3>${product.price}</h3>
                <p>
                    <button class = "btn btn-danger btn-sm">
                        USELESS
                    </button>
                    <button class = "btn btn-secondary btn-sm">
                        USELESS
                    </button>
                </p>
            </div>
        `;
    })
}


const getProducts = async () => {
    ipcRendererSender.invoke('product:get').then((products) => {
        renderProducts(products);
        
    })
    //products = await main.getProducts(); 
    renderProducts(products);   

}

async function init(){
   await getProducts(); 
}

init();
