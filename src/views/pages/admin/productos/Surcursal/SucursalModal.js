import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CForm,
  CFormInput,
  CFormLabel,
} from '@coreui/react';
import axios from 'axios';

const SucursalModal = ({
                         visible,
                         setVisible,
                         sucursalToUpdate = null,
                         refreshSucursalList,
                         showToast,
                       }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    if (sucursalToUpdate) {
      setNombre(sucursalToUpdate.nombre);
      setDireccion(sucursalToUpdate.direccion);
      setTelefono(sucursalToUpdate.telefono);
      setLatitud(sucursalToUpdate.latitud);
      setLongitud(sucursalToUpdate.longitud);
    } else {
      setNombre('');
      setDireccion('');
      setTelefono('');
      setLatitud('');
      setLongitud('');
    }
  }, [sucursalToUpdate]);

  const handleSave = () => {
    const sucursal = { nombre, direccion, telefono, latitud, longitud };

    const request = sucursalToUpdate
      ? axios.put(`http://157.230.227.216/api/sucursales/${sucursalToUpdate.id}`, sucursal,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      : axios.post('http://157.230.227.216/api/sucursales', sucursal,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });

    request
      .then((response) => {
        setVisible(false);
        refreshSucursalList();
        showToast(sucursalToUpdate ? 'Sucursal actualizada con éxito' : 'Sucursal creada con éxito', 'success');
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message;
        console.error('Error al guardar sucursal:', error);
        showToast(`Error al ${sucursalToUpdate ? 'actualizar' : 'crear'} la sucursal: ${errorMsg}`, 'danger');
      });
  };

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>{sucursalToUpdate ? 'Actualizar Sucursal' : 'Agregar Nueva Sucursal'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormLabel>Nombre</CFormLabel>
          <CFormInput
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la sucursal"
          />
          <CFormLabel>Dirección</CFormLabel>
          <CFormInput
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Dirección"
          />
          <CFormLabel>Teléfono</CFormLabel>
          <CFormInput
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Teléfono"
          />
          <CFormLabel>Latitud</CFormLabel>
          <CFormInput
            value={latitud}
            onChange={(e) => setLatitud(e.target.value)}
            placeholder="Latitud"
          />
          <CFormLabel>Longitud</CFormLabel>
          <CFormInput
            value={longitud}
            onChange={(e) => setLongitud(e.target.value)}
            placeholder="Longitud"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {sucursalToUpdate ? 'Actualizar Sucursal' : 'Guardar Sucursal'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

SucursalModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  sucursalToUpdate: PropTypes.object,
  refreshSucursalList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
};

export default SucursalModal;
