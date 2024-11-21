import { TOKEN_SECRET } from "../config.js";
import { Compra } from "../models/Pedidos.model.js";
import jwt from "jsonwebtoken";
import { Producto } from '../models/Productos.model.js';
import { User } from "../models/user.model.js";

export const actualizarPedido = async (req, res) => {
  try {
    // Obtener y verificar el token
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const decodedToken = jwt.verify(token, TOKEN_SECRET);
    const usuarioId = decodedToken._id;

    const { pedidoId } = req.params; // Obtener el ID del pedido a actualizar
    const { productos, metodoPago, direccionEnvio, comentarios } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ message: "No se enviaron productos para actualizar el pedido." });
    }

    // Buscar el pedido existente
    const pedido = await Compra.findOne({ _id: pedidoId, usuarioId });
    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado o no autorizado para este usuario." });
    }

    // Validar y actualizar productos
    let totalCompra = 0;

    for (const item of productos) {
      const producto = await Producto.findOne({
        _id: item.productoId,
        tiendaId: item.tiendaId,
      });

      if (!producto) {
        return res.status(404).json({
          message: `El producto con ID ${item.productoId} no existe en la tienda con ID ${item.tiendaId}.`,
        });
      }

      if (producto.cantidadDisponible < item.cantidad) {
        return res.status(400).json({
          message: `Stock insuficiente para el producto "${producto.nombre}". Disponibles: ${producto.cantidadDisponible}.`,
        });
      }

      // Calcular el subtotal del producto y acumular en el total
      totalCompra += producto.precio * item.cantidad;
    }

    // Actualizar detalles del pedido
    pedido.productos = productos;
    pedido.metodoPago = metodoPago || pedido.metodoPago;
    pedido.direccionEnvio = direccionEnvio || pedido.direccionEnvio;
    pedido.comentarios = comentarios || pedido.comentarios;
    pedido.totalCompra = totalCompra;

    const pedidoActualizado = await pedido.save();

    res.status(200).json({
      message: "Pedido actualizado con éxito.",
      pedido: pedidoActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar el pedido.",
      error: error.message,
    });
  }
};


export const obtenerPedidosPorUsuarioOTienda = async (req, res) => {
  try {
    const { token, tiendatoken } = req.cookies;
    const filtro = {};

    // Validar y decodificar el token del usuario
    if (token) {
      const usuarioData = jwt.verify(token, TOKEN_SECRET);
      filtro.usuarioId = usuarioData.id;
    }

    // Validar y decodificar el token de la tienda
    if (tiendatoken) {
      const tiendaData = jwt.verify(tiendatoken, TOKEN_SECRET);
      filtro['productos.tiendaId'] = tiendaData.tiendaId;
    }

    // Validar que al menos un token haya sido proporcionado
    if (!Object.keys(filtro).length) {
      return res.status(400).json({
        message: 'Debe proporcionar al menos un token válido: token o tiendatoken.',
      });
    }

    // Buscar pedidos que coincidan con los criterios
    const pedidos = await Compra.find(filtro);

    if (!pedidos || pedidos.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron pedidos con los criterios especificados.',
      });
    }

    // Buscar datos completos de los productos y del usuario
    const pedidosConDetalles = await Promise.all(
      pedidos.map(async (pedido) => {
        // Obtener los datos del usuario
        const usuario = await User.findById(pedido.usuarioId).select('username email');
        if (!usuario) {
          throw new Error(`Usuario con ID ${pedido.usuarioId} no encontrado.`);
        }

        // Obtener los datos de los productos
        const productosConDatos = await Promise.all(
          pedido.productos.map(async (producto) => {
            const productoData = await Producto.findById(producto.productoId).select(
              'nombre imagenes precio tiendaId'
            );

            // Validar si el producto tiene imágenes y asignar valores por defecto
            const imagenes = productoData?.imagenes?.length > 0 ? productoData.imagenes : ['/placeholder.png'];

            return {
              ...producto.toObject(),
              productoData: {
                ...productoData.toObject(),
                imagenes, // Agregar imágenes corregidas
              },
            };
          })
        );

        return {
          ...pedido.toObject(),
          productos: productosConDatos,
          usuario, // Agregar datos del usuario al pedido
        };
      })
    );

    res.status(200).json({
      message: 'Pedidos encontrados con éxito.',
      pedidos: pedidosConDetalles,
    });
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({
      message: 'Error al obtener los pedidos.',
      error: error.message,
    });
  }
};


export const registrarPedido = async (req, res) => {
  try {
    // Obtener y verificar el token
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    // Decodificar el token para obtener el usuarioId
    const decodedToken = jwt.verify(token, TOKEN_SECRET);
    const usuarioId = decodedToken.id;

    // Buscar los datos del usuario con el usuarioId obtenido del token
    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Obtener productos y método de pago de la solicitud
    const { productos, metodoPago } = req.body;

    // Usar la dirección del usuario (si existe) o la dirección enviada en la solicitud
    const direccionEnvio = usuario.direccion || req.body.direccionEnvio;
    if (!direccionEnvio) {
      return res.status(400).json({ message: "Dirección de envío requerida." });
    }

    if (!productos || productos.length === 0) {
      return res.status(400).json({ message: "No se enviaron productos para la compra." });
    }

    let totalCompra = 0;
    const productosCompra = [];

    // Validar y preparar los datos de cada producto
    for (const item of productos) {
      const producto = await Producto.findById(item.productoId);
      if (!producto) {
        return res.status(404).json({ message: `Producto con ID ${item.productoId} no existe.` });
      }

      // Verificar stock disponible
      if (producto.cantidad < item.cantidad) {
        return res.status(400).json({
          message: `Stock insuficiente para el producto "${producto.nombre}". Disponibles: ${producto.cantidad}.`,
        });
      }

      // Reducir el stock del producto
      producto.cantidad -= item.cantidad;
      await producto.save();

      // Calcular subtotal y acumular total
      const subtotal = producto.precio * item.cantidad;
      totalCompra += subtotal;

      // Agregar producto procesado al arreglo de productos
      productosCompra.push({
        productoId: producto._id,
        tiendaId: producto.tiendaId,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
        subtotal,
      });
    }

    // Crear el documento de compra
    const nuevaCompra = new Compra({
      usuarioId,
      productos: productosCompra,
      metodoPago,
      direccionEnvio,
      totalCompra,
    });

    // Guardar la compra en la base de datos
    const compraGuardada = await nuevaCompra.save();

    res.status(201).json({
      message: "Compra realizada con éxito.",
      compra: compraGuardada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al realizar la compra.",
      error: error.message,
    });
  }
};