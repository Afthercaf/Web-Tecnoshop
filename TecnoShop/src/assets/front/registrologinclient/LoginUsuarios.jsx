import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthUser } from '../../../context/authContext';
import video1 from '../PaginaMicro/videos/video1.mp4';
import logo from '../images/tecnoshopBlanco.png';

export default function LoginUsuarios() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signin, isAuthenticated } = useAuthUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = { email, password };

    try {
      await signin(userData); // Espera a que signin termine antes de cambiar el estado
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirige si el usuario está autenticado
    }
  }, [isAuthenticated, navigate]);

  return (
    <section className="relative h-screen flex items-center justify-center">
      <video className="absolute top-0 left-0 w-full h-full object-cover -z-10" src={video1} autoPlay loop muted />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 -z-10"></div>
      <div className="flex max-w-5xl bg-gray-200 bg-opacity-90 rounded-lg shadow-lg overflow-hidden w-full z-10 gap-8">
        <div className="w-1/2 p-8 bg-black text-white flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-4">Bienvenido a TecnoShop</h2>
          <p className="text-lg mb-4 text-center">Ingresa para explorar y comprar productos en nuestra plataforma.</p>
          <img src={logo} alt="TecnoShop logo" className="w-40 h-40 mb-6" />
          <h3 className="text-xl font-semibold mb-2">Ventajas:</h3>
          <ul className="list-disc list-inside text-left">
            <li>Compra segura y rápida.</li>
            <li>Acceso a ofertas exclusivas y descuentos.</li>
          </ul>
        </div>
        <div className="w-1/2 p-8">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">TecnoShop</h1>
          <h2 className="text-lg font-medium text-center mb-6 text-gray-600">Iniciar sesión como usuario</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Correo</label>
              <input 
                type="email" 
                placeholder="example@domain.com" 
                className="w-full px-4 py-2 border rounded-lg" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="mb-4 relative">
              <label className="flex justify-between text-gray-600 mb-2">Contraseña</label>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña" 
                className="w-full px-4 py-2 border rounded-lg" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div className="mb-6 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-3/4 flex items-center justify-center bg-black text-white py-2 px-4 rounded-lg ${loading ? "cursor-not-allowed" : "hover:bg-gray-800"}`}
              >
                {loading ? "Procesando..." : "Iniciar sesión Ahora"}
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link to="/registro" className="text-blue-600 hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
