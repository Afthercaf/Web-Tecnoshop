
import { User } from "../models/user.model.js";
// Obtener usuario por ID
export const getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const updateUser = async (req, res) => {
    const { id } = req.params; // Asumiendo que el ID del usuario se pasa como parámetro
    const { username, email, password, telefono, address } = req.body;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: "El correo ya está en uso" });
        }
        user.email = email;
      }
  
      user.username = username || user.username;
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
      user.telefono = telefono || user.telefono;
      user.address = address || user.address;
  
      await user.save();
  
      res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        telefono: user.telefono,
        address: user.address,
        tipo: user.tipo,
        estado: user.estado,
        fechaRegistro: user.fechaRegistro,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  