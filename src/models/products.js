import {promises as fs} from 'fs'

class Product {
    constructor(id, title, description, price, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

export class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 0;
        this.path = './src/models/productos.json'

    }

    
    saveToFile = async() => {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products,null,2));
        } catch (error) {
            console.log('Error al guardar en el archivo:', error);
        }
    }

    recoverProducts = async() => {       
        try {
            console.log(this.path)
            const data = await fs.readFile(this.path, 'utf-8');

            if (data && data.length > 0) {
                this.products = JSON.parse(data);
                const maxIdProduct = this.products.reduce((prev, curr) => (prev.id > curr.id) ? prev : curr);
                this.nextId = maxIdProduct.id + 1;
            } else {
                this.products = [];
                this.nextId = 0;
            }
            
        } catch (error) {
            if (error.code !== 'ENOENT') { // ENOENT es el error que se lanza si el archivo no existe
                console.log('Error al leer el archivo:', error);
                this.products = [];
                this.nextId = 0;
            }
        }
        }


    addProduct = async(title, description, price, thumbnail, code, stock) => {
        await this.recoverProducts();
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log('Todos los campos son obligatorios');
            return { success: false, message: "todos los campos son obligatorios" };
        }
        // Verifica si el código ya existe
        const duplicateCode = this.products.some(product => product.code === code);
        if(duplicateCode){
            console.log('El código ya existe');
            return { success: false, message: "El código ya existe" };
        }
        const product = new Product(this.nextId++, title, description, price, thumbnail, code, stock);
        this.products.push(product);
        // Guarda el producto en el archivo
        await fs.writeFile(this.path, JSON.stringify(this.products,null,2));
        return { success: true, message: "Producto añadido correctamente" };
    }

    getProducts = async() => {
        await this.recoverProducts();
        return this.products;
    }
    
    removeProduct = async(code) => {

        const index = await this.products.findIndex(product => product.code === code);
        if (index !== -1) {
            this.products.splice(index, 1);
        } else {
            console.log('Producto no encontrado');
        }
    }

    updateProduct = async(code, updatedProduct) => {
        const index = await this.products.findIndex(product => product.code === code);
        if (index !== -1) {
            this.products[index] = {...this.products[index], ...updatedProduct};
        } else {
            console.log('Producto no encontrado');
        }
    }

    getProductById = async(code) => {
        await this.recoverProducts();
        //let resProductById = await this.readProducts()
        const product = this.products.find(product => product.code === code);
        if (product) {
            return product;
        } else {
            //console.log('Producto no encontrado');
        }
    }
}

const manager = new ProductManager();

