import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTienda } from "../../../context/TiendaContext"; // Importa el contexto de Tienda
import video1 from "./videos/video1.mp4";
import logo from "../images/tecnoshopBlanco.png";

export default function LoginMicro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { loginTienda, isAuthenticated, loading, errors } = useTienda(); // Usa el contexto de Tienda
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect immediately if the user is already authenticated
    if (isAuthenticated) {
      navigate("/admin-dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmLogin = async () => {
    try {
      await loginTienda({ email, password }); // Autentica usando la función del contexto
      if (isAuthenticated) {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setShowConfirmation(false);
    }
  };

  const cancelLogin = () => {
    setShowConfirmation(false);
    navigate("/");
  };

  return (
    <section className="relative h-screen flex items-center justify-center">
      <video className="absolute top-0 left-0 w-full h-full object-cover -z-10" src={video1} autoPlay loop muted />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 -z-10"></div>
      <div className="flex max-w-5xl bg-gray-200 bg-opacity-90 rounded-lg shadow-lg overflow-hidden w-full z-10 gap-8">
        <div className="w-1/2 p-8 bg-black text-white flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-4">Bienvenido a TecnoShop</h2>
          <p className="text-lg mb-4 text-center">Ingresa para gestionar tu negocio de forma eficiente.</p>
          <img src={logo} alt="TecnoShop logo" className="w-40 h-40 mb-6" />
          <h3 className="text-xl font-semibold mb-2">Beneficios:</h3>
          <ul className="list-disc list-inside text-left">
            <li>Acceso a herramientas avanzadas para gestionar tus productos.</li>
            <li>Actualizaciones en tiempo real sobre pedidos y comentarios.</li>
          </ul>
        </div>
        <div className="w-1/2 p-8">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">TecnoShop</h1>
          <h2 className="text-lg font-medium text-center mb-6 text-gray-600">Iniciar sesión como vendedor</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Correo</label>
              <input
                type="email"
                placeholder="example@domain.com"
                className="w-full px-4 py-2 border rounded-lg"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="flex justify-between text-gray-600 mb-2">Contraseña</label>
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full px-4 py-2 border rounded-lg"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-6 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-3/4 flex items-center justify-center bg-black text-white py-2 px-4 rounded-lg ${
                  loading ? "cursor-not-allowed" : "hover:bg-gray-800"
                }`}
              >
                {loading ? "Procesando..." : "Iniciar sesión Ahora"}
              </button>
            </div>
          </form>
          {errors && <p className="text-red-500 text-center">{errors}</p>}
          <p className="mt-4 text-center">
            ¿No tienes cuenta? <Link to="/registro-micro" className="text-blue-500 hover:underline">Regístrate</Link>
          </p>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmación</h3>
            <p className="mb-6">¿Estás seguro de que quieres iniciar sesión?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmLogin}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Confirmar
              </button>
              <button
                onClick={cancelLogin}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
