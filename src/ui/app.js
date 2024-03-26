//Capturar el formulario
const productForm = document.getElementById('productForm');

//Capturar barra de búsqueda
const searchBar = document.getElementById('searchBar');

//Capturar datos de los elementos del formulario
const productName = document.getElementById('name');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');

//Captura el div donde se localizan los productos para renderizarlos 
const productsList = document.getElementById("products");

let products = [];
let editProductId;
let editingStatus = false;

let searchString; 
let searchingFlag = false; 

searchBar.addEventListener('input', evt => {
    evt.preventDefault(); // Evitar que se refresque la app
    const value = searchBar.value
    searchString = value;
    
    // Empty
    if (!value) {
        searchingFlag = false;       
        
        
    }
    
    const trimmed = value.trim()
    // Texto
    if (trimmed) {
        searchingFlag = true;
    } else {
        // Espacio
        searchingFlag = false;
    }

    getProducts()
    editingStatus = false;
    
    
})


productForm.addEventListener('submit', async(e) => {
    try {
        e.preventDefault(); // Evitar que se refresque la app 
        const newProduct = {
            name: productName.value,
            price: productPrice.value,
            description: productDescription.value
        }
        console.log("Nuevo producto");
        console.log(newProduct);
        console.log("Fin nuevo producto");
        
        if (!editingStatus){
            // Enviar datos a main      
            ipcRendererSender.invoke('product:create', newProduct).then((result) => {
            console.log(result);
        })
        } else {
            console.log("Actualizando");
            ipcRendererSender.send('product:update',{
                editProductId,
                newProduct});
            
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
        //await main.deleteProducts(id);
        ipcRendererSender.send('product:delete',id)
        await getProducts();
    }
    return;
}


async function editProduct(id){

    ipcRendererSender.invoke('product:getById',id).then((product) => {
        productName.value = product.name;
        productPrice.value = product.price;
        productDescription.value = product.description;

        
        
    });   
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
    if (!searchingFlag){
        ipcRendererSender.invoke('product:get').then((products) => {
        renderProducts(products);
        
        })
    } else {
        ipcRendererSender.invoke('product:filter',searchString).then((products) => {
            renderProducts(products);
        })
    }

    searchingFlag = false;
    //products = await main.getProducts(); 
    //renderProducts(products);   

}

async function init(){
   await getProducts(); 
}

init();
