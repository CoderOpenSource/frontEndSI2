import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CForm,
  CFormSelect,
} from '@coreui/react'
import axios from 'axios'

const FavoritoModal = ({
                         visible,
                         setVisible,
                         favoritoToUpdate = null,
                         refreshFavoritoList,
                         showToast,
                       }) => {
  const [usuarioId, setUsuarioId] = useState('')
  const [productoId, setProductoId] = useState('')
  const [nuevoProductoId, setNuevoProductoId] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [productos, setProductos] = useState([])
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    if (favoritoToUpdate) {
      setUsuarioId(favoritoToUpdate.usuario.id)
      setProductoId(favoritoToUpdate.producto.id)
      setNuevoProductoId('') // Inicialmente vacío, lo seleccionará el usuario
    } else {
      setUsuarioId('')
      setProductoId('')
      setNuevoProductoId('')
    }
  }, [favoritoToUpdate])

  useEffect(() => {
    axios.get('http://157.230.227.216/api/usuarios', {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
      },
    }).then((response) => {
      setUsuarios(response.data)
    })

    axios.get('http://157.230.227.216/api/productos', {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
      },
    }).then((response) => {
      setProductos(response.data)
    })
  }, [])

  const handleSave = () => {
    const formData = new FormData()
    formData.append('usuarioId', usuarioId)
    formData.append('productoId', productoId)

    if (favoritoToUpdate) {
      // Si estamos actualizando, enviar también el nuevo producto
      formData.append('nuevoProductoId', nuevoProductoId)

      axios.put('http://157.230.227.216/api/productos-favoritos/actualizar', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
        .then((response) => {
          setVisible(false)
          refreshFavoritoList()
          showToast('Favorito actualizado con éxito', 'success')
        })
        .catch((error) => {
          const errorMsg = error.response?.data?.message || error.message
          console.error('Error al actualizar favorito:', error)
          showToast(`Error al actualizar el favorito: ${errorMsg}`, 'danger')
        })
    } else {
      // Para guardar un nuevo favorito
      formData.append('productoId', productoId)

      axios.post('http://157.230.227.216/api/productos-favoritos/agregar', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
        .then((response) => {
          setVisible(false)
          refreshFavoritoList()
          showToast('Favorito creado con éxito', 'success')
        })
        .catch((error) => {
          const errorMsg = error.response?.data?.message || error.message
          console.error('Error al crear favorito:', error)
          showToast(`Error al crear el favorito: ${errorMsg}`, 'danger')
        })
    }
  }

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>{favoritoToUpdate ? 'Actualizar Favorito' : 'Agregar Nuevo Favorito'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormSelect
            label="Usuario"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
          >
            <option value="">Selecciona un usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre}
              </option>
            ))}
          </CFormSelect>

          <CFormSelect
            label="Producto"
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            className="mt-3"
            disabled={favoritoToUpdate !== null} // Solo habilitado cuando no se está actualizando
          >
            <option value="">Selecciona un producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre}
              </option>
            ))}
          </CFormSelect>

          {favoritoToUpdate && (
            <CFormSelect
              label="Nuevo Producto"
              value={nuevoProductoId}
              onChange={(e) => setNuevoProductoId(e.target.value)}
              className="mt-3"
            >
              <option value="">Selecciona el nuevo producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </CFormSelect>
          )}
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {favoritoToUpdate ? 'Actualizar Favorito' : 'Guardar Favorito'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

FavoritoModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  favoritoToUpdate: PropTypes.object,
  refreshFavoritoList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
}

export default FavoritoModal
