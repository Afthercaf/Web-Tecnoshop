import { useState, useEffect } from "react";
import { useAuthUser } from "../../../context/authContext";
import { useUsers } from "../../../context/UserContext";
import { Camera, Mail, Phone, MapPin, User, X } from "lucide-react";

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useAuthUser();
  const { getUser, updateUser } = useUsers();
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    telefono: "",
    direccion: "",
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id) {
        try {
          const userData = await getUser(user.id);
          if (userData) {
            setUserInfo(userData);
          }
        } catch (error) {
          console.error("Error al cargar el usuario:", error);
          setAlertType('error');
          setShowAlert(true);
        }
      }
    };
    fetchUser();
  }, [user, getUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateUser(user.id, userInfo);
      if (updatedUser) {
        setUserInfo(updatedUser);
        setIsEditing(false);
        setAlertType('success');
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-lg">
          Por favor, inicia sesión para ver tu perfil.
        </div>
      </div>
    );
  }

  const InputField = ({ icon: Icon, label, name, type = "text", value, onChange }) => (
    <div className="relative transition-all duration-300 transform hover:scale-[1.02]">
      <div className="absolute left-3 top-9">
        <Icon className="text-gray-400" size={18} />
      </div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={!isEditing}
        className={`pl-10 w-full py-2 px-4 rounded-lg border ${
          isEditing
            ? "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            : "bg-gray-50 border-transparent"
        } transition-all duration-200`}
      />
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`rounded-lg shadow-lg p-4 flex items-center justify-between ${
            alertType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <span>
              {alertType === 'success' 
                ? "Perfil actualizado correctamente"
                : "Error al actualizar el perfil"}
            </span>
            <button 
              onClick={() => setShowAlert(false)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header con imagen de fondo */}
          <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>

          <div className="relative px-8 pb-8">
            {/* Imagen de perfil */}
            <div className="relative -mt-24 mb-8 flex justify-center">
              <div className="relative group">
                <img
                  src={profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv5ulumXxZdrcBKSu7AUfL2AfDlIs1fRSEFA&s"}
                  alt="Perfil"
                  className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg cursor-pointer transition-transform transform hover:scale-110">
                    <Camera className="text-white" size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Formulario */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  icon={User}
                  label="Nombre de usuario"
                  name="username"
                  value={userInfo.username}
                  onChange={handleInputChange}
                />
                <InputField
                  icon={Mail}
                  label="Email"
                  name="email"
                  type="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                />
                <InputField
                  icon={Phone}
                  label="Teléfono"
                  name="telefono"
                  value={userInfo.telefono}
                  onChange={handleInputChange}
                />
                <InputField
                  icon={MapPin}
                  label="Dirección"
                  name="direccion"
                  value={userInfo.direccion}
                  onChange={handleInputChange}
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4 mt-8">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
                    >
                      Guardar cambios
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
                  >
                    Editar perfil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;