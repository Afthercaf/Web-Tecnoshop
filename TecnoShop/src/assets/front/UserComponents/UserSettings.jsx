import React, { useState } from 'react';

export default function SettingsPage() {
  // Estados para las configuraciones
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [frequency, setFrequency] = useState('inmediata');
  const [notificationTypes, setNotificationTypes] = useState({
    ofertas: true,
    mensajes: false,
    actualizaciones: true,
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log('Contraseña cambiada');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
    if (confirmed) {
      console.log("Cuenta eliminada");
    }
  };

  const toggleNotification = (type) => {
    setNotifications({ ...notifications, [type]: !notifications[type] });
  };

  const toggleNotificationType = (type) => {
    setNotificationTypes({ ...notificationTypes, [type]: !notificationTypes[type] });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>

      {/* Sección de Cambio de Contraseña */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cambiar Contraseña</h2>
        <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña Actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nueva Contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Cambiar Contraseña
          </button>
        </form>
      </section>

      {/* Sección para Eliminar Cuenta */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Eliminar Cuenta</h2>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Eliminar Cuenta Permanentemente
        </button>
      </section>

      {/* Sección de Notificaciones */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Notificaciones</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {/* Preferencias de Notificaciones */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Preferencias de Notificaciones</h3>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => toggleNotification('email')}
                className="mr-2"
              />
              Notificaciones por correo electrónico
            </label>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={() => toggleNotification('push')}
                className="mr-2"
              />
              Notificaciones push
            </label>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={() => toggleNotification('sms')}
                className="mr-2"
              />
              Notificaciones por SMS
            </label>
          </div>

          {/* Frecuencia de Notificaciones */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Frecuencia de Notificaciones</h3>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="inmediata">Inmediatamente</option>
              <option value="diaria">Diariamente</option>
              <option value="semanal">Semanalmente</option>
            </select>
          </div>

          {/* Tipos de Notificaciones */}
          <div>
            <h3 className="text-lg font-medium mb-2">Tipos de Notificaciones</h3>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={notificationTypes.ofertas}
                onChange={() => toggleNotificationType('ofertas')}
                className="mr-2"
              />
              Ofertas
            </label>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={notificationTypes.mensajes}
                onChange={() => toggleNotificationType('mensajes')}
                className="mr-2"
              />
              Mensajes
            </label>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={notificationTypes.actualizaciones}
                onChange={() => toggleNotificationType('actualizaciones')}
                className="mr-2"
              />
              Actualizaciones de pedidos
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}
