import express from 'express';

import {
  obtenerTiendas,
  obtenerTienda,
  actualizarTienda,
  eliminarTienda,
  obtenerInventarios,
  obtenerInventario,
  registrarInventario,
  actualizarInventario,
  eliminarInventario,
  obtenerProductosPorTienda
} from '../controllers/vendores.controller.js'; 

import {  obtenerProductos,
  obtenerProducto,
  registrarProducto,
  actualizarProducto,
  eliminarProducto, } from '../controllers/productos.controller.js';
import { getUserById,updateUser } from '../controllers/usersn.contoller.js';

import { 
  registrarPedido,
  actualizarPedido,
  obtenerPedidosPorUsuarioOTienda } from '../controllers/Compras.controllers.js';

import { registerProductoSchema } from '../schemas/products.schema.js';
import { validateSchema } from "../middlewares/validator.middleware.js";


const router = express.Router();

// Rutas de Tiendas
router.get('/tiendas', obtenerTiendas);
router.get('/tiendas/:id', obtenerTienda);
router.put('/tiendas/:id', actualizarTienda);
router.delete('/tiendas/:id', eliminarTienda);

// Rutas de Productos
router.get('/productos', obtenerProductos);
router.get('/producto', obtenerProducto);
router.post('/productos',validateSchema(registerProductoSchema) ,registrarProducto);
router.put('/productos/:id', actualizarProducto);
router.delete('/productos/:id', eliminarProducto);

// Rutas de Pedidos
router.post('/pedidos', registrarPedido);
router.put('/pedidos/:id', actualizarPedido);
router.get("/pedidos", obtenerPedidosPorUsuarioOTienda);

// Rutas de Inventarios
router.get('/inventarios', obtenerInventarios);
router.get('/inventarios/:id', obtenerInventario);
router.post('/inventarios', registrarInventario);
router.put('/inventarios/:id', actualizarInventario);
router.delete('/inventarios/:id', eliminarInventario);

router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.get("/tiendas/:id/productos", obtenerProductosPorTienda);

export default router;
