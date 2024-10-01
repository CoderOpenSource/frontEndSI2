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
} from '@coreui/react';
import axios from 'axios';

const CarritoModal = ({ visible, setVisible, carritoToUpdate = null, refreshCarritoList, showToast }) => {
  const [usuarioId, setUsuarioId] = useState('');
  const [productoDetalleId, setProductoDetalleId] = useState('');
  const [disponible, setDisponible] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [productosDetalles, setProductosDetalles] = useState([]);


  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchUsuarios();
    fetchProductoDetalles();

    if (carritoToUpdate) {
      // Obtener el usuario y productoDetalle asociados al carrito
      fetchUsuarioById(carritoToUpdate.usuarioId);
      fetchProductoDetalleById(carritoToUpdate.productosDetalle[0].productoDetalleId);
      setDisponible(carritoToUpdate.disponible);
    } else {
      resetForm();
    }
  }, [carritoToUpdate]);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://157.230.227.216/api/usuarios',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    }
  };

  const fetchProductoDetalles = async () => {
    try {
      const response = await axios.get('http://157.230.227.216/api/productos-detalles',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      }); // Ajusta la URL si es necesario
      setProductosDetalles(response.data);
    } catch (error) {
      console.error('Error fetching productos detalles:', error);
    }
  };

  const fetchUsuarioById = async (id) => {
    try {
      const response = await axios.get(`http://157.230.227.216/api/usuarios/id/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });
      setUsuarioId(response.data.id); // Asigna el ID del usuario
    } catch (error) {
      console.error(`Error fetching usuario with id ${id}:`, error);
    }
  };

  const fetchProductoDetalleById = async (id) => {
    try {
      const response = await axios.get(`http://157.230.227.216/api/productos-detalles/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });
      setProductoDetalleId(response.data.id); // Asigna el ID del productoDetalle
    } catch (error) {
      console.error(`Error fetching productoDetalle with id ${id}:`, error);
    }
  };

  const resetForm = () => {
    setUsuarioId('');
    setProductoDetalleId('');
    setDisponible(true);
  };

  const handleSave = () => {
    const carritoRequest = {
      usuario: { id: usuarioId },
      disponible,
      productoDetalle: { id: productoDetalleId } // Agregamos el detalle del producto
    };

    const request = carritoToUpdate
      ? axios.put(`http://157.230.227.216/api/carritos/${carritoToUpdate.id}`, carritoRequest,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      : axios.post('http://157.230.227.216/api/carritos', carritoRequest,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });

    request
      .then((response) => {
        setVisible(false);
        refreshCarritoList();
        showToast(carritoToUpdate ? 'Carrito actualizado con éxito' : 'Carrito creado con éxito', 'success');
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message;
        console.error('Error al guardar carrito:', error);
        showToast(`Error al ${carritoToUpdate ? 'actualizar' : 'crear'} el carrito: ${errorMsg}`, 'danger');
      });
  };

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>{carritoToUpdate ? 'Actualizar Carrito' : 'Agregar Nuevo Carrito'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormLabel>Usuario</CFormLabel>
          <CFormSelect value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
            <option value="">Seleccione un usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre}
              </option>
            ))}
          </CFormSelect>

          <CFormLabel>Producto Detalle</CFormLabel>
          <CFormSelect value={productoDetalleId} onChange={(e) => setProductoDetalleId(e.target.value)}>
            <option value="">Seleccione un producto detalle</option>
            {productosDetalles.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.producto.nombre} {/* Asegúrate de que 'nombre' sea un atributo válido en producto */}
              </option>
            ))}
          </CFormSelect>

          <CFormLabel>Disponible</CFormLabel>
          <CFormSelect value={disponible} onChange={(e) => setDisponible(e.target.value === 'true')}>
            <option value={true}>Sí</option>
            <option value={false}>No</option>
          </CFormSelect>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {carritoToUpdate ? 'Actualizar Carrito' : 'Guardar Carrito'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

CarritoModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  carritoToUpdate: PropTypes.object,
  refreshCarritoList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
};

export default CarritoModal;
