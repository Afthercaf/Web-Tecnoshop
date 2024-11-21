import { createContext, useContext, useState } from "react";
import { getUserRequest, updateUserRequest } from "../api/users";

const UserContext = createContext();

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUsers debe ser usado dentro de un UserProvider");
  return context;
};

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);

  // Función para obtener un usuario por ID
  const getUser = async (id) => {
    console.log("Llamada a getUser con ID:", id); // Consola para verificar el ID
    try {
      const res = await getUserRequest(id);
      console.log("Respuesta de getUserRequest:", res); // Consola para ver la respuesta completa de la API
      return res.data; // Retorna los datos del usuario
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      return null; // Retorna null si ocurre un error
    }
  };

  // Función para actualizar un usuario
  const updateUser = async (id, user) => {
    console.log("Llamada a updateUser con ID:", id, "y datos de usuario:", user); // Consola para verificar el ID y los datos
    try {
      const res = await updateUserRequest(id, user);
      if (res.data) {
        setUsers((prevUsers) =>
          prevUsers.map((usr) => (usr._id === id ? res.data : usr))
        );
        console.log("Usuario actualizado:", res.data); // Consola para confirmar actualización
        return res.data; // Retorna los datos actualizados del usuario
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      return null; // Retorna null si ocurre un error en la actualización
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        getUser,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };
