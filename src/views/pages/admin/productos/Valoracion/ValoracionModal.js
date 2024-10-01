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
  CFormLabel,
  CFormInput
} from '@coreui/react';
import axios from 'axios';

const ValoracionModal = ({
                           visible,
                           setVisible,
                           valoracionToUpdate = null,
                           refreshValoracionList,
                           showToast,
                         }) => {
  const [usuarioId, setUsuarioId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(1);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    // Obtener usuarios y productos al abrir el modal
    fetchUsuarios();
    fetchProductos();

    // Si se está editando una valoración existente
    if (valoracionToUpdate) {
      setUsuarioId(valoracionToUpdate.usuario.id);
      setProductoId(valoracionToUpdate.producto.id);
      setComentario(valoracionToUpdate.comentario);
      setCalificacion(valoracionToUpdate.calificacion);
    } else {
      resetForm();
    }
  }, [valoracionToUpdate]);

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

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://157.230.227.216/api/productos', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  const resetForm = () => {
    setUsuarioId('');
    setProductoId('');
    setComentario('');
    setCalificacion(1);
  };

  const handleSave = () => {
    const valoracionRequest = {
      comentario,
      calificacion,
    };

    const request = valoracionToUpdate
      ? axios.put(`http://157.230.227.216/api/valoraciones/${valoracionToUpdate.id}`, valoracionRequest, {
        params: {
          usuarioId,
          productoId,
        },
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      : axios.post('http://157.230.227.216/api/valoraciones', valoracionRequest, {
        params: {
          usuarioId,
          productoId,
        },
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });

    request
      .then((response) => {
        setVisible(false);
        refreshValoracionList();
        showToast(valoracionToUpdate ? 'Valoración actualizada con éxito' : 'Valoración creada con éxito', 'success');
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message;
        console.error('Error al guardar valoración:', error);
        showToast(`Error al ${valoracionToUpdate ? 'actualizar' : 'crear'} la valoración: ${errorMsg}`, 'danger');
      });
  };

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>{valoracionToUpdate ? 'Actualizar Valoración' : 'Agregar Nueva Valoración'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormLabel>Usuario</CFormLabel>
          <CFormSelect
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
          >
            <option value="">Seleccione un usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre}
              </option>
            ))}
          </CFormSelect>

          <CFormLabel>Producto</CFormLabel>
          <CFormSelect
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
          >
            <option value="">Seleccione un producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre}
              </option>
            ))}
          </CFormSelect>

          <CFormLabel>Comentario</CFormLabel>
          <CFormInput
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comentario"
          />

          <CFormLabel>Calificación</CFormLabel>
          <CFormInput
            type="number"
            value={calificacion}
            min={1}
            max={5}
            onChange={(e) => setCalificacion(e.target.value)}
            placeholder="Calificación (1-5)"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {valoracionToUpdate ? 'Actualizar Valoración' : 'Guardar Valoración'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

ValoracionModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  valoracionToUpdate: PropTypes.object,
  refreshValoracionList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
};

export default ValoracionModal;
