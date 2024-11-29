// productoController.js
  import jwt from "jsonwebtoken";
  import { Producto } from '../models/productos.model.js';
  import { Tienda } from '../models/venderos.model.js'; // Asegúra
  import { TOKEN_SECRET } from "../config.js";

  export const obtenerProductos = async (req, res) => {
    try {
      // Obtenemos el 'tiendaToken' desde las cookies
      const { tiendaToken } = req.cookies;
      
      // Si no existe el token, respondemos con un error 401
      if (!tiendaToken) {
        return res.status(401).json({ message: "Token de tienda no proporcionado" });
      }
  
      // Verificamos el token de la tienda y extraemos el tiendaId
      let decoded;
      try {
        decoded = jwt.verify(tiendaToken, TOKEN_SECRET); // Usa el secreto adecuado
      } catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado", detalle: error.message });
      }
  
      const tiendaId = decoded.id; // Extraemos el tiendaId del token
      
      if (!tiendaId) {
        return res.status(403).json({ message: "Token inválido o expirado" });
      }
  
      // Consultamos los productos de la tienda utilizando el tiendaId extraído del token
      const productos = await Producto.find({ tiendaId: tiendaId }); // Asegúrate de que el campo tiendaId exista en tu modelo de Producto
      
      // Si no se encontraron productos para esa tienda, respondemos con un mensaje adecuado
      if (productos.length === 0) {
        return res.status(404).json({ message: "No se encontraron productos para esta tienda" });
      }
  
      // Si todo es correcto, respondemos con los productos encontrados
      res.json(productos);
  
    } catch (error) {
      // Captura cualquier error no esperado y responde con detalles
      console.error("Error inesperado:", error); // Es útil para debug en la consola
      res.status(500).json({ message: "Error al obtener los productos", detalle: error.message });
    }
  };
  

  
  export const obtenerProducto = async (req, res) => {
    try {
      const productos = await Producto.find().populate("tiendaId");
      res.json(productos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
// La clave secreta para los tokens
  
export const registrarProducto = async (req, res) => {
  try {
    const {
      nombre,
      precio,
      cantidad,
      categoria,
      imagenes,
      estado,
      especificaciones
    } = req.body;

    // Obtener el tiendatoken desde los encabezados de la solicitud (cookies)
    const { tiendaToken } = req.cookies;

    if (!tiendaToken) {
      return res.status(400).json({ message: 'El tiendaToken es requerido' });
    }

    // Verificar el tiendatoken y obtener el tiendaId (ID de la tienda)
    const decoded = jwt.verify(tiendaToken, TOKEN_SECRET);
    const tiendaId = decoded.id;  // Obtén el ID de la tienda desde el token

    console.log("tiendaId", tiendaId);  // Verifica si tiene un valor válido

    // Crear un nuevo producto
    const nuevoProducto = new Producto({
      nombre,
      tiendaId,  // Asocia el producto con la tienda
      precio,
      cantidad,
      categoria,
      imagenes,
      estado,
      especificaciones,
      valoraciones: { promedio: 0, total: 0, comentarios: [] },  // Inicializa valoraciones con valores por defecto
    });

    // Guardar el producto en la base de datos
    await nuevoProducto.save();

    // Obtener los detalles de la tienda asociada con el tiendaId
    const tiendaGuardada = await Tienda.findById(tiendaId);

    // Responder con el producto creado y los detalles de la tienda asociada
    res.json({
      id: nuevoProducto._id,  // ID del nuevo producto
      nombre: nuevoProducto.nombre,  // Nombre del producto
      precio: nuevoProducto.precio,  // Precio del producto
      cantidad: nuevoProducto.cantidad,  // Cantidad disponible
      categoria: nuevoProducto.categoria,  // Categoría del producto
      tiendaId: nuevoProducto.tiendaId,  // ID de la tienda a la que pertenece
      tienda: {
        id: tiendaGuardada._id,  // ID de la tienda
        nombre: tiendaGuardada.nombre,  // Nombre de la tienda
        propietarioId: tiendaGuardada.propietarioId,  // ID del propietario de la tienda
      },
      especificaciones: nuevoProducto.especificaciones,  // Especificaciones del producto
      valoraciones: nuevoProducto.valoraciones,  // Valoraciones iniciales del producto
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });  // Manejo de errores
  }
};

  

  
  
  
  export const actualizarProducto = async (req, res) => {
    try {
      const productoActualizado = await Producto.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      if (!productoActualizado) return res.status(404).json({ message: "Producto no encontrado" });
      return res.json(productoActualizado);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const eliminarProducto = async (req, res) => {
    try {
      const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
      if (!productoEliminado) return res.status(404).json({ message: "Producto no encontrado" });
      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
