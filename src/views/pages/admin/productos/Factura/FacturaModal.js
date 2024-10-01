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
  CFormSelect,
  CFormInput,
} from '@coreui/react';
import axios from 'axios';

const FacturaModal = ({
                        visible,
                        setVisible,
                        facturaToUpdate = null,
                        refreshFacturaList,
                        showToast,
                      }) => {
  const [transaccionId, setTransaccionId] = useState('');
  const [file, setFile] = useState(null);
  const [transacciones, setTransacciones] = useState([]);
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchTransacciones();

    if (facturaToUpdate) {
      setTransaccionId(facturaToUpdate.transaccionId);
      setFile(null); // Al editar, no pre-cargamos el archivo
    } else {
      resetForm();
    }
  }, [facturaToUpdate]);

  const fetchTransacciones = async () => {
    try {
      const response = await axios.get('http://157.230.227.216/api/transacciones',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });
      setTransacciones(response.data);
    } catch (error) {
      console.error('Error fetching transacciones:', error);
    }
  };

  const resetForm = () => {
    setTransaccionId('');
    setFile(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append('transaccionId', transaccionId);
    if (file) {
      formData.append('file', file);
    }

    const request = facturaToUpdate
      ? axios.put(`http://157.230.227.216/api/facturas/${facturaToUpdate.id}`, formData,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      : axios.post('http://157.230.227.216/api/facturas', formData,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });

    request
      .then(() => {
        setVisible(false);
        refreshFacturaList();
        showToast(facturaToUpdate ? 'Factura actualizada con éxito' : 'Factura creada con éxito', 'success');
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message;
        console.error('Error al guardar factura:', error);
        showToast(`Error al ${facturaToUpdate ? 'actualizar' : 'crear'} la factura: ${errorMsg}`, 'danger');
      });
  };

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>{facturaToUpdate ? 'Actualizar Factura' : 'Registrar Nueva Factura'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormSelect
            label="Transacción"
            value={transaccionId}
            onChange={(e) => setTransaccionId(e.target.value)}
          >
            <option value="">Seleccione una Transacción</option>
            {transacciones.map((transaccion) => (
              <option key={transaccion.id} value={transaccion.id}>
                Transacción #{transaccion.id}
              </option>
            ))}
          </CFormSelect>

          <CFormInput
            type="file"
            label="Subir PDF"
            onChange={handleFileChange}
            accept="application/pdf"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {facturaToUpdate ? 'Actualizar Factura' : 'Guardar Factura'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

FacturaModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  facturaToUpdate: PropTypes.object,
  refreshFacturaList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
};

export default FacturaModal;
