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

const InventarioModal = ({
                           visible,
                           setVisible,
                           inventarioToUpdate = null,
                           refreshInventarioList,
                           showToast,
                         }) => {
  const [sucursalId, setSucursalId] = useState('');
  const [productoDetalleId, setProductoDetalleId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [sucursales, setSucursales] = useState([]);
  const [productoDetalles, setProductoDetalles] = useState([]);
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    if (inventarioToUpdate) {
      setSucursalId(inventarioToUpdate.sucursal.id);
      setProductoDetalleId(inventarioToUpdate.productodetalle.id);
      setCantidad(inventarioToUpdate.cantidad);
    } else {
      setSucursalId('');
      setProductoDetalleId('');
      setCantidad('');
    }
  }, [inventarioToUpdate]);

  useEffect(() => {
    axios.get('http://157.230.227.216/api/sucursales',{
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
      },
    }).then((response) => {
      setSucursales(response.data);
    });
    axios.get('http://157.230.227.216/api/productos-detalles',{
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
      },
    }).then((response) => {
      setProductoDetalles(response.data);
    });
  }, []);

  const handleSave = () => {
    const inventario = new URLSearchParams();
    inventario.append('sucursalId', sucursalId);
    inventario.append('productoDetalleId', productoDetalleId);
    inventario.append('cantidad', cantidad);

    const request = inventarioToUpdate
      ? axios.put(`http://157.230.227.216/api/inventarios/${inventarioToUpdate.id}`, inventario,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      : axios.post('http://157.230.227.216/api/inventarios', inventario,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });

    request
      .then((response) => {
        setVisible(false);
        refreshInventarioList();
        showToast(inventarioToUpdate ? 'Inventario actualizado con éxito' : 'Inventario creado con éxito', 'success');
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message;
        console.error('Error al guardar inventario:', error);
        showToast(`Error al ${inventarioToUpdate ? 'actualizar' : 'crear'} el inventario: ${errorMsg}`, 'danger');
      });
  };


  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>{inventarioToUpdate ? 'Actualizar Inventario' : 'Agregar Nuevo Inventario'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormSelect
            label="Sucursal"
            value={sucursalId}
            onChange={(e) => setSucursalId(e.target.value)}
          >
            <option value="">Selecciona una sucursal</option>
            {sucursales.map((sucursal) => (
              <option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </option>
            ))}
          </CFormSelect>

          <CFormSelect
            label="Producto"
            value={productoDetalleId}
            onChange={(e) => setProductoDetalleId(e.target.value)}
            className="mt-3"
          >
            <option value="">Selecciona un producto</option>
            {productoDetalles.map((detalle) => (
              <option key={detalle.id} value={detalle.id}>
                {detalle.producto.nombre} - {detalle.tamaño.nombre} - {detalle.color.nombre}
              </option>
            ))}
          </CFormSelect>

          <CFormInput
            type="number"
            label="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="Ingresa la cantidad"
            className="mt-3"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {inventarioToUpdate ? 'Actualizar Inventario' : 'Guardar Inventario'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

InventarioModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  inventarioToUpdate: PropTypes.object,
  refreshInventarioList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
};

export default InventarioModal;
