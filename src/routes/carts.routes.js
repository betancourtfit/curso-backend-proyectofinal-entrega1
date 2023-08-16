import { cartManager } from "../models/cart.js";
import { Router } from 'express';

const cartsRouter = Router();

cartsRouter.get('/', async (req, res) => {
    res.send( await cartManager.getCart());
})

export default cartsRouter