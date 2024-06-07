import React, { useState } from 'react';
import { updateEmail, updatePassword, updatePhoneNumber, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';

const UserPage = () => {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const handleUpdateEmail = async () => {
    try {
      await updateEmail(auth.currentUser, newEmail);
      console.log('Correo electrónico actualizado exitosamente');
      setNewEmail(''); // Limpiar el campo de entrada después de la actualización
      setShowEmailInput(false); // Ocultar el campo de entrada
    } catch (error) {
      console.error('Error al actualizar el correo electrónico:', error.message);
      setError(error.message);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await updatePassword(auth.currentUser, newPassword);
      console.log('Contraseña actualizada exitosamente');
      setNewPassword(''); // Limpiar el campo de entrada después de la actualización
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error.message);
      setError(error.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      console.log('Nombre actualizado exitosamente');
      setNewName(''); // Limpiar el campo de entrada después de la actualización
      setShowNameInput(false); // Ocultar el campo de entrada
    } catch (error) {
      console.error('Error al actualizar el nombre:', error.message);
      setError(error.message);
    }
  };

  const handleUpdatePhoneNumber = async () => {
    try {
      await updatePhoneNumber(auth.currentUser, newPhoneNumber);
      console.log('Número de teléfono actualizado exitosamente');
      setNewPhoneNumber(''); // Limpiar el campo de entrada después de la actualización
      setShowPhoneInput(false); // Ocultar el campo de entrada
    } catch (error) {
      console.error('Error al actualizar el número de teléfono:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Perfil</h2>
      <div className="mb-4 row justify-content-center">
        <div className="col-12 col-md-6">
          <div className="d-flex align-items-center justify-content-between">
            <p className="m-0 me-3">Nombre:</p>
            <p className="m-0 me-3">{auth.currentUser.displayName}</p>
            <button className="btn btn-primary" onClick={() => setShowNameInput(true)}>Cambiar</button>
          </div>
          {showNameInput && (
            <div className="d-flex align-items-center mt-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="form-control me-3"
                placeholder="Nuevo Nombre"
              />
              <button className="btn btn-primary" onClick={handleUpdateProfile}>Actualizar</button>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4 row justify-content-center">
        <div className="col-12 col-md-6">
          <div className="d-flex align-items-center justify-content-between">
            <p className="m-0 me-3">Correo Electrónico:</p>
            <p className="m-0 me-3">{auth.currentUser.email}</p>
            <button className="btn btn-primary" onClick={() => setShowEmailInput(true)}>Cambiar</button>
          </div>
          {showEmailInput && (
            <div className="d-flex align-items-center mt-3">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="form-control me-3"
                placeholder="Nuevo Correo Electrónico"
              />
              <button className="btn btn-primary" onClick={handleUpdateEmail}>Actualizar</button>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4 row justify-content-center mt-3">
        <div className="col-12 col-md-6">
          <div className="d-flex align-items-center justify-content-between">
            <p className="m-0 me-3">Teléfono:</p>
            <p className="m-0 me-3">{auth.currentUser.phoneNumber}</p>
            <button className="btn btn-primary" onClick={() => setShowPhoneInput(true)}>Cambiar</button>
          </div>
          {showPhoneInput && (
            <div className="d-flex align-items-center mt-3">
              <input
                type="tel"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                className="form-control me-3"
                placeholder="Nuevo Número de Teléfono"
              />
              <button className="btn btn-primary" onClick={handleUpdatePhoneNumber}>Actualizar</button>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4 row justify-content-center">
        <div className="col-12 col-md-6">
          <div className="text-center">
            <h3>Actualizar Contraseña</h3>
            <div className="d-flex align-items-center justify-content-center">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control me-3"
                placeholder="Nueva Contraseña"
              />
              <button className="btn btn-primary" onClick={handleUpdatePassword}>Actualizar</button>
            </div>
          </div>
        </div>
      </div>
      {error && <p className="text-danger">Error: {error}</p>}
    </div>
  );
};

export default UserPage;
