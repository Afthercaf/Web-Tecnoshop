import { z } from "zod";

// Definir el esquema de validación con Zod para un producto
export const registerProductoSchema = z.object({
  nombre: z.string().nonempty({ message: "El nombre es obligatorio" }).trim(),
  precio: z.number().min(0, { message: "El precio debe ser mayor o igual a 0" }),
  cantidad: z.number().min(0, { message: "La cantidad debe ser mayor o igual a 0" }),
  categoria: z.string().nonempty({ message: "La categoría es obligatoria" }).trim(),
  imagenes: z.array(z.string().trim()).optional(),
  estado: z.enum(["activo", "inactivo", "agotado"]).default("activo"),
  especificaciones: z.array(z.object({
    titulo: z.string().optional(),
    descripcion: z.string().optional(),
  })).optional(),
  valoraciones: z.object({
    promedio: z.number().default(0),
    total: z.number().default(0),
    comentarios: z.array(z.object({
      usuarioId: z.string().nonempty({ message: "El ID del usuario es obligatorio" }),
      calificacion: z.number().min(1).max(5),
      comentario: z.string().trim().optional(),
      fecha: z.string().datetime().default(() => new Date().toISOString()),
    })).optional()
  }).optional()
});
