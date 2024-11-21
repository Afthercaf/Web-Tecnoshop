import mongoose from "mongoose";

// Esquema del usuario
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      enum: ["normal", "vendedor"],
      default: "normal",
    },
    telefono: {
      type: String,
      required: false, // Cambiar a true si deseas que sea obligatorio
    },
    direccion: {
      type: String,
      required: true,
    }, // Usar el esquema de dirección como un array
    fechaRegistro: {
      type: Date,
      default: Date.now,
    },
    perfil: {
      type: String,
      required: false,
    },
    estado: {
      type: String,
      enum: ["activo", "suspendido", "inactivo"],
      default: "activo",
    },

  },
  {
    timestamps: true,
  }
);




// Usar mongoose.models para evitar redefinir el modelo
export const User = mongoose.models.User || mongoose.model("User", userSchema);