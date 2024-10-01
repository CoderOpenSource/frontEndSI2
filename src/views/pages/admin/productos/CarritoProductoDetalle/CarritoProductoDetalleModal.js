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
  CFormSelect,
  CSpinner,
} from '@coreui/react';
import axios from 'axios';

const CarritoProductoDetalleModal = ({ visible, setVisible, detalleToUpdate = null, refreshDetalleList, showToast }) => {
  const [carritoId, setCarritoId] = useState('');
  const [productoDetalleId, setProductoDetalleId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [carritos, setCarritos] = useState([]);
  const [productosDetalles, setProductosDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    const fetchData = async () => {
      await fetchCarritos();
      await fetchProductosDetalles();

      // Si estamos en modo edición, cargamos los datos del detalle
      if (detalleToUpdate) {
        setCarritoId(detalleToUpdate?.carritoId || '');
        setProductoDetalleId(detalleToUpdate?.productoDetalleId || '');
        setCantidad(detalleToUpdate.cantidad || 1);
      } else {
        resetForm();
      }
      setLoading(false); // Terminamos la carga de datos
    };
    fetchData();
  }, [detalleToUpdate]);

  const fetchCarritos = async () => {
    try {
      const response = await axios.get('http://157.230.227.216/api/carritos',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });
      setCarritos(response.data);
    } catch (error) {
      console.error('Error fetching carritos:', error);
    }
  };

  const fetchProductosDetalles = async () => {
    try {
      const response = await axios.get('http://157.230.227.216/api/productos-detalles',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });
      setProductosDetalles(response.data);
    } catch (error) {
      console.error('Error fetching productos detalles:', error);
    }
  };

  const resetForm = () => {
    setCarritoId('');
    setProductoDetalleId('');
    setCantidad(1);
  };

  const handleSave = () => {
    const detalleRequest = {
      carritoId: parseInt(carritoId, 10), // Convertimos a entero
      productoDetalleId: parseInt(productoDetalleId, 10), // Convertimos a entero
      cantidad: parseInt(cantidad, 10),  // En caso de que cantidad también se maneje como string
    };

    // Log para ver qué se está enviando
    console.log("Datos enviados al backend:", detalleRequest);

    const request = detalleToUpdate
      ? axios.put(`http://157.230.227.216/api/carrito-producto-detalles/${detalleToUpdate.id}`, detalleRequest,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      : axios.post('http://157.230.227.216/api/carrito-producto-detalles', detalleRequest,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });

    request
      .then(() => {
        setVisible(false);
        refreshDetalleList();
        showToast(detalleToUpdate ? 'Detalle actualizado con éxito' : 'Detalle creado con éxito', 'success');
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message;
        console.error('Error al guardar detalle:', error);
        showToast(`Error al ${detalleToUpdate ? 'actualizar' : 'crear'} el detalle: ${errorMsg}`, 'danger');
      });
  };

  // Mostrar spinner si está cargando los datos
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
        <CModalTitle>{detalleToUpdate ? 'Actualizar Detalle' : 'Agregar Nuevo Detalle'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormLabel>Carrito</CFormLabel>
          <CFormSelect value={carritoId} onChange={(e) => setCarritoId(e.target.value)}>
            <option value="">Seleccione un carrito</option>
            {carritos.map((carrito) => (
              <option key={carrito.id} value={carrito.id}>
                ID: {carrito.id}
              </option>
            ))}
          </CFormSelect>

          <CFormLabel>Producto Detalle</CFormLabel>
          <CFormSelect value={productoDetalleId} onChange={(e) => setProductoDetalleId(e.target.value)}>
            <option value="">Seleccione un producto detalle</option>
            {productosDetalles.map((productoDetalle) => (
              <option key={productoDetalle.id} value={productoDetalle.id}>
                Producto: {productoDetalle.producto?.nombre || 'Desconocido'}
              </option>
            ))}
          </CFormSelect>

          <CFormLabel>Cantidad</CFormLabel>
          <CFormInput
            type="number"
            value={cantidad}
            min={1}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="Cantidad"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {detalleToUpdate ? 'Actualizar Detalle' : 'Guardar Detalle'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

CarritoProductoDetalleModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  detalleToUpdate: PropTypes.object,
  refreshDetalleList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
};

export default CarritoProductoDetalleModal;
