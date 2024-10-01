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
  CSpinner,
} from '@coreui/react';
import axios from 'axios';

const TransaccionModal = ({ visible, setVisible, transaccionToUpdate = null, refreshTransaccionList, showToast }) => {
  const [usuarioId, setUsuarioId] = useState('');
  const [carritoId, setCarritoId] = useState('');
  const [tipoPagoId, setTipoPagoId] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [carritos, setCarritos] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [loading, setLoading] = useState(true);
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    // Fetching all necessary data (Usuarios, Carritos, Tipos de Pago)
    const loadData = async () => {
      try {
        await fetchUsuarios();
        await fetchCarritos();
        await fetchTiposPago();

        if (transaccionToUpdate) {
          setUsuarioId(transaccionToUpdate?.usuario?.id || '');
          setCarritoId(transaccionToUpdate?.carrito?.id || '');
          setTipoPagoId(transaccionToUpdate?.tipoPago?.id || '');
        } else {
          resetForm();
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [transaccionToUpdate]);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://157.230.227.216/api/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  const fetchCarritos = async () => {
    try {
      const response = await axios.get('http://157.230.227.216/api/carritos', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });
      setCarritos(response.data);
    } catch (error) {
      console.error('Error fetching carritos:', error);
    }
  };

  const fetchTiposPago = async () => {
    try {
      const response = await axios.get('http://157.230.227.216/api/tipo-pagos', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });
      setTiposPago(response.data);
    } catch (error) {
      console.error('Error fetching tiposPago:', error);
    }
  };

  const resetForm = () => {
    setUsuarioId('');
    setCarritoId('');
    setTipoPagoId('');
  };

  const handleSave = () => {
    // Validate that all fields are selected
    if (!usuarioId || !carritoId || !tipoPagoId) {
      showToast('Todos los campos son obligatorios', 'danger');
      return;
    }

    const transaccionRequest = {
      usuario_id: usuarioId,   // Enviar los IDs directamente
      carrito_id: carritoId,
      tipo_pago_id: tipoPagoId,
      fecha: new Date().toISOString() // Fecha actual para la transacción
    };

    const request = transaccionToUpdate
      ? axios.put(`http://157.230.227.216/api/transacciones/${transaccionToUpdate.id}`, transaccionRequest, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      : axios.post('http://157.230.227.216/api/transacciones', transaccionRequest, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });

    request
      .then((response) => {
        setVisible(false);
        refreshTransaccionList();
        showToast(transaccionToUpdate ? 'Transacción actualizada con éxito' : 'Transacción creada con éxito', 'success');
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message;
        console.error('Error al guardar transacción:', error);
        showToast(`Error al ${transaccionToUpdate ? 'actualizar' : 'crear'} la transacción: ${errorMsg}`, 'danger');
      });
  };

  if (loading) {
    return (
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalBody>
          <CSpinner />
        </CModalBody>
      </CModal>
    );
  }

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>{transaccionToUpdate ? 'Actualizar Transacción' : 'Agregar Nueva Transacción'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormSelect value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
            <option value="">Seleccione un Usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre}
              </option>
            ))}
          </CFormSelect>

          <CFormSelect value={carritoId} onChange={(e) => setCarritoId(e.target.value)}>
            <option value="">Seleccione un Carrito</option>
            {carritos.map((carrito) => (
              <option key={carrito.id} value={carrito.id}>
                {carrito.id}
              </option>
            ))}
          </CFormSelect>

          <CFormSelect value={tipoPagoId} onChange={(e) => setTipoPagoId(e.target.value)}>
            <option value="">Seleccione un Tipo de Pago</option>
            {tiposPago.map((tipoPago) => (
              <option key={tipoPago.id} value={tipoPago.id}>
                {tipoPago.nombre}
              </option>
            ))}
          </CFormSelect>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {transaccionToUpdate ? 'Actualizar Transacción' : 'Guardar Transacción'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

TransaccionModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  transaccionToUpdate: PropTypes.object,
  refreshTransaccionList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
};

export default TransaccionModal;
