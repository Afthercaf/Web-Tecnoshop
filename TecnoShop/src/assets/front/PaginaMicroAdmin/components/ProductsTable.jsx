import { useState, useEffect } from "react";
import { PlusCircle, ImagePlus, X, Plus } from "lucide-react";
import Sidebar from "./Sidebar";
import { useProducts } from "../../../../context/ProductContext";
import Cookies from "js-cookie";
import axios from "../../../../api/axios";
import { useTienda } from '../../../../context/TiendaContext';
import * as jwtDecode from "jwt-decode";


export default function ProductsTable() {
  const {
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const { tienda, getTienda } = useTienda();
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storeData, setStoreData] = useState({
    nombre: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    email: '',
    logo: '',
  });
  const [modalType, setModalType] = useState("");
  const [selectedProduct, setSelectedProduct] = useState({
    id: null,
    nombre: "",
    precio: "",
    cantidad: "",
    categoria: "",
    imagenes: [],
    estado: "activo",
    especificaciones: [],
    valoraciones: {
      promedio: 0,
      total: 0,
      comentarios: [],
    },
  });

  const [newSpec, setNewSpec] = useState({ titulo: "", descripcion: "" });
  const [newImageUrl, setNewImageUrl] = useState("");
  const [  products,setProducts ] = useState([]);

    const id = tienda ? tienda.id : null;
    console.log(id);
    useEffect(() => {
      const fetchStoreData = async () => {
        if (!id) {
          console.error("No se encontró un ID de tienda válido.");
          return;
        }
  
        try {
          const store = await axios.get(`/tiendas/${id}`);
          setStoreData(store.data);
        } catch (error) {
          console.error("Error al cargar la tienda:", error);
        }
      };
  
      fetchStoreData();
    }, [id, getTienda]);

    useEffect(() => {
      if (id) { // Asegúrate de que `id` esté definido antes de intentar hacer la solicitud
        const fetchProducts = async () => {
          try {
            const result = await axios.get(`/tiendas/${id}/productos`);
            console.log(result.data); // Muestra los datos obtenidos
            setProducts(result.data); // Actualiza el estado con los productos recuperados
          } catch (error) {
            console.error("Error al cargar los productos:", error);
            setProducts([]); // Maneja el caso de error estableciendo un array vacío
          }
        };
    
        fetchProducts();
      }
    }, [id]); // Incluye `id` como dependencia
    
   
    

  const handleOpenModal = (type, product = null) => {
    setModalType(type);
    setSelectedProduct(
      product
        ? { ...product }  // Asigna el producto existente
        : {
            _id: "",  // Usamos _id aquí
            nombre: "",
            precio: "",
            cantidad: "",
            categoria: "",
            imagenes: [],
            estado: "activo",
            especificaciones: [],
          }
    );
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct({
      id: null,
      nombre: "",
      precio: "",
      cantidad: "",
      categoria: "",
      imagenes: [],
      estado: "activo",
      especificaciones: [],
      valoraciones: {
        promedio: 0,
        total: 0,
        comentarios: [],
      },
    });
    setNewImageUrl("");
  };

  const handleAddSpecification = () => {
    if (newSpec.titulo && newSpec.descripcion) {
      setSelectedProduct((prev) => ({
        ...prev,
        especificaciones: [...prev.especificaciones, { ...newSpec }],
      }));
      setNewSpec({ titulo: "", descripcion: "" });
    }
  };

  const handleRemoveSpecification = (index) => {
    setSelectedProduct((prev) => ({
      ...prev,
      especificaciones: prev.especificaciones.filter((_, i) => i !== index),
    }));
  };

  const isValidNumber = (value) => {
    return !isNaN(value) && value !== "";
  };

  const handleSaveProduct = async () => {
    const tiendaToken = Cookies.get("tiendaToken");
  
    if (!isValidNumber(selectedProduct.precio)) {
      alert("El precio debe ser un número válido.");
      return;
    }
    if (!isValidNumber(selectedProduct.cantidad)) {
      alert("La cantidad debe ser un número válido.");
      return;
    }
  
    if (!selectedProduct.nombre || !selectedProduct.precio || !selectedProduct.cantidad || !selectedProduct.categoria) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }
  
    // Si no se requiere imagen, la excluimos del objeto.
    const productData = {
      ...selectedProduct,
      precio: parseFloat(selectedProduct.precio),
      cantidad: parseInt(selectedProduct.cantidad, 10),
      imagenes: selectedProduct.imagenes.length > 0 ? selectedProduct.imagenes : [] // Solo enviamos si hay imágenes
    };
  
    try {
      if (modalType === "edit" && selectedProduct._id !== "") {
        await updateProduct(selectedProduct._id, productData);  // Use _id aquí
        console.log("Producto actualizado con éxito");
      } else {
        const response = await axios.post("/productos", productData, {
          headers: {
            Authorization: `Bearer ${tiendaToken}`,
          },
        });
  
        if (response.data) {
          console.log("Producto creado exitosamente:", response.data);
          alert("Producto creado exitosamente");
          createProduct(response.data);
        } else {
          console.error("Error al crear el producto");
          alert("Hubo un error al crear el producto");
        }
      }
    } catch (error) {
      console.error("Error en la creación del producto:", error);
      alert("Error en la creación del producto");
    }
  
    handleCloseModal();
  };
  
  const handleAddImage = () => {
    if (newImageUrl) {
      setSelectedProduct((prev) => ({
        ...prev,
        imagenes: [...prev.imagenes, newImageUrl], // Añadir la URL de la imagen al array
      }));
      setNewImageUrl("");  // Resetea el campo de URL.
      setImagePreviewError(false);  // Resetea el error de vista previa.
    }
  };
  

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      console.log("Producto eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagePreviewError = () => {
    setImagePreviewError(true);
  };

  const handleImagePreviewLoad = () => {
    setImagePreviewError(false);
  };

  
  

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Productos</h2>
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Buscar productos"
            className="border border-gray-300 p-2 rounded-lg w-64"
          />
          <button
            onClick={() => handleOpenModal("new")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Nuevo Producto
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2">ID</th>
                <th className="border border-gray-200 p-2">Nombre</th>
                <th className="border border-gray-200 p-2">Precio</th>
                <th className="border border-gray-200 p-2">Cantidad</th>
                <th className="border border-gray-200 p-2">Categoría</th>
                <th className="border border-gray-200 p-2">Estado</th>
                <th className="border border-gray-200 p-2">Valoración</th>
                <th className="border border-gray-200 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-2 text-center">{product._id}</td>
                    <td className="p-2">{product.nombre}</td>
                    <td className="p-2 text-right">${product.precio}</td>
                    <td className="p-2 text-center">{product.cantidad}</td>
                    <td className="p-2">{product.categoria}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          product.estado === "activo"
                            ? "bg-green-100 text-green-800"
                            : product.estado === "inactivo"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.estado}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      {product.valoraciones.promedio} ({product.valoraciones.total})
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleOpenModal("edit", product)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Modal para crear/editar producto */}
        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">
                {modalType === "edit" ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={selectedProduct.nombre}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={selectedProduct.precio}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                  <input
                    type="number"
                    name="cantidad"
                    value={selectedProduct.cantidad}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <input
                    type="text"
                    name="categoria"
                    value={selectedProduct.categoria}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    name="estado"
                    value={selectedProduct.estado}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Right Column - Images and Specifications */}
              <div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          className="p-2 border border-gray-300 rounded flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="URL de la imagen"
        />
        <button
          onClick={handleAddImage}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Image Preview */}
      {newImageUrl && (
        <div className="mt-2 relative">
          <div className="border border-gray-200 rounded p-2">
            <img
              src={newImageUrl}
              alt="Preview"
              className="max-h-40 mx-auto"
              onError={handleImagePreviewError}
              onLoad={handleImagePreviewLoad}
            />
            {imagePreviewError && (
              <div className="text-red-500 text-sm text-center mt-2">
                Error al cargar la imagen. Verifique la URL.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Gallery */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {selectedProduct.imagenes.length === 0 ? (
          <p className="text-gray-500 text-center col-span-2">No hay imágenes para mostrar</p>
        ) : (
          selectedProduct.imagenes.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Producto ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
              <button
                onClick={() =>
                  setSelectedProduct((prev) => ({
                    ...prev,
                    imagenes: prev.imagenes.filter((_, i) => i !== index),
                  }))
                }
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
                    </div>
                  </div>
                </div>
                <div>


  <label className="block text-sm font-medium text-gray-700 mb-1">Especificaciones</label>
  <div className="space-y-1">
    <div className="flex gap-1">
      <input
        type="text"
        placeholder="Título"
        value={newSpec.titulo}
        onChange={(e) => setNewSpec({ ...newSpec, titulo: e.target.value })}
        className="py-1 px-2 text-sm border border-gray-300 rounded flex-1 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="text"
        placeholder="Descripción"
        value={newSpec.descripcion}
        onChange={(e) => setNewSpec({ ...newSpec, descripcion: e.target.value })}
        className="py-1 px-2 text-sm border border-gray-300 rounded flex-1 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        onClick={handleAddSpecification}
        className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 flex items-center"
      >
        <Plus size={16} />
      </button>
    </div>

    <ul className="space-y-1 max-h-32 overflow-y-auto">
      {selectedProduct.especificaciones.map((spec, index) => (
        <li key={index} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded text-sm">
          <span>
            <strong>{spec.titulo}:</strong> {spec.descripcion}
          </span>
          <button
            onClick={() => handleRemoveSpecification(index)}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            <X size={14} />
          </button>
        </li>
      ))}
    </ul>
  </div>
</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProduct}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
