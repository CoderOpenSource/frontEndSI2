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

const TipoPagoModal = ({ visible, setVisible, tipoPagoToUpdate = null, refreshTipoPagoList, showToast }) => {
  const [nombre, setNombre] = useState('');
  const [imagenQr, setImagenQr] = useState('');
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    if (tipoPagoToUpdate) {
      setNombre(tipoPagoToUpdate.nombre || '');
      setImagenQr(tipoPagoToUpdate.imagenQr || '');
    } else {
      resetForm();
    }
  }, [tipoPagoToUpdate]);

  const resetForm = () => {
    setNombre('');
    setImagenQr('');
  };

  const handleSave = () => {
    const tipoPagoRequest = { nombre, imagenQr };

    const request = tipoPagoToUpdate
      ? axios.put(`http://157.230.227.216/api/tipo-pagos/${tipoPagoToUpdate.id}`, tipoPagoRequest, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      : axios.post('http://157.230.227.216/api/tipo-pagos', tipoPagoRequest, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });

    request
      .then((response) => {
        setVisible(false);
        refreshTipoPagoList();
        showToast(tipoPagoToUpdate ? 'Tipo de pago actualizado con éxito' : 'Tipo de pago creado con éxito', 'success');
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message;
        console.error('Error al guardar tipo de pago:', error);
        showToast(`Error al ${tipoPagoToUpdate ? 'actualizar' : 'crear'} tipo de pago: ${errorMsg}`, 'danger');
      });
  };

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>{tipoPagoToUpdate ? 'Actualizar Tipo de Pago' : 'Agregar Nuevo Tipo de Pago'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormLabel>Nombre</CFormLabel>
          <CFormInput
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del tipo de pago"
          />

          <CFormLabel>Imagen QR (URL)</CFormLabel>
          <CFormInput
            type="text"
            value={imagenQr}
            onChange={(e) => setImagenQr(e.target.value)}
            placeholder="URL de la imagen QR"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {tipoPagoToUpdate ? 'Actualizar Tipo de Pago' : 'Guardar Tipo de Pago'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

TipoPagoModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  tipoPagoToUpdate: PropTypes.object,
  refreshTipoPagoList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
};

export default TipoPagoModal;
