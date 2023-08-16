import {promises as fs} from 'fs'

// carts.js (en tu carpeta 'models' o donde guardes tus modelos)

class Cart {
    constructor(id) {
        this.id = id;
        this.products = [];
    }
}

class CartManager {
    constructor() {
        this.carts = [];
        this.nextId = 0; // Puedes elegir comenzar desde el número que desees.
    }

    createCart = async() => {
        const newCart = new Cart(this.nextId++);
        this.carts.push(newCart);
        return newCart;
    }

    getCart = async(id) => {
        return this.carts.find(cart => cart.id === id);
    }
}

export const cartManager = new CartManager();
