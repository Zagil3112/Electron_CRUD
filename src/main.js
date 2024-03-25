process.env.NODE_ENV = 'dev';
const isDev = process.env.NODE_ENV !== 'production';
const {BrowserWindow, Notification,ipcMain} = require('electron');
const {getConnection} = require('./database')
const path = require('path');

let window

async function getProducts(){
    const conn = await getConnection();
    const results = await conn.query("SELECT * FROM product ORDER BY id DESC");
    console.log(results);
    return results;
}

async function createProduct(product){
    try {

        const conn = await getConnection();
        product.price = parseFloat(product.price);
        const result = await conn.query('INSERT INTO product SET ?',product);
        
        new Notification({
            title:'Electron MySQL',
            body : 'New product saved successfully'
        }).show();

        product.id = result.insertId;
        return product;
        
    } catch (error) {
        console.log(error);
    }
    
}

async function deleteProducts(id){
    const conn = await getConnection();
    const result = await conn.query('DELETE FROM product WHERE id =?',id);
    console.log(result);
    return result;

}

async function getProductById(id){
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM product WHERE id = ?',id);
    console.log(result[0]);
    return result[0];
}

async function updateProduct(id,product){

    const conn = await getConnection();
    const result = await conn.query('UPDATE product SET ? WHERE id = ?',[product,id]);
    console.log(result);
    
}

function createWindow() {
    window = new BrowserWindow({
        width: isDev ? 1200 :800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });
    // Open devTools if in dev env
    if (isDev){
        window.webContents.openDevTools();
    }
    window.loadFile('src/ui/index.html')
}





module.exports = {
    createWindow,
    createProduct,
    getProducts,
    deleteProducts,
    getProductById,
    updateProduct
}

// Test ipcRender ipcMain

//Respond to ipcRenderer create product 
/*
ipcMain.on('product:create', (e,options) => {
    console.log("Accediendo al main");
    //console.log(options);

    return createProduct(options);  



});
*/

// Main process
ipcMain.handle('product:create', async (e, options) => {
    const result = await createProduct(options);
    return result
})

ipcMain.handle('product:get', async (e, options) => {
    const result = await getProducts();
    return result
})
/////////////////////////////////