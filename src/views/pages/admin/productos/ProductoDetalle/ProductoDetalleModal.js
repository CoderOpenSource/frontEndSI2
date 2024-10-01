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
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import axios from 'axios'

const ProductoDetalleModal = ({
                                visible,
                                setVisible,
                                detalleToUpdate = null,
                                refreshDetallesList,
                                showToast,
                              }) => {
  const [productoId, setProductoId] = useState('')
  const [colorId, setColorId] = useState('')
  const [tamañoId, setTamañoId] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [productos, setProductos] = useState([])
  const [colores, setColores] = useState([])
  const [tamaños, setTamaños] = useState([])
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    if (detalleToUpdate) {
      setProductoId(detalleToUpdate.producto.id)
      setColorId(detalleToUpdate.color.id)
      setTamañoId(detalleToUpdate.tamaño.id)
      setImagePreview(detalleToUpdate.imagen2D)
    } else {
      setProductoId('')
      setColorId('')
      setTamañoId('')
      setImagePreview(null)
    }
  }, [detalleToUpdate])

  useEffect(() => {
    fetchProductos()
    fetchColores()
    fetchTamaños()
  }, [])

  const fetchProductos = () => {
    axios.get('http://157.230.227.216/api/productos',{
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
      },
    })
      .then((response) => {
        setProductos(response.data)
      })
      .catch((error) => {
        console.error('Error al obtener productos:', error)
      })
  }

  const fetchColores = () => {
    axios.get('http://157.230.227.216/api/colores',{
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
      },
    })
      .then((response) => {
        setColores(response.data)
      })
      .catch((error) => {
        console.error('Error al obtener colores:', error)
      })
  }

  const fetchTamaños = () => {
    axios.get('http://157.230.227.216/api/tamaños',{
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
      },
    })
      .then((response) => {
        setTamaños(response.data)
      })
      .catch((error) => {
        console.error('Error al obtener tamaños:', error)
      })
  }

  const handleSave = () => {
    const detalle = {
      producto: { id: productoId },
      color: { id: colorId },
      tamaño: { id: tamañoId },
    }

    const formData = new FormData()
    formData.append('productoDetalle', new Blob([JSON.stringify(detalle)], { type: 'application/json' }))

    if (selectedFile) {
      formData.append('imagen2D', selectedFile)
    }

    const request = detalleToUpdate
      ? axios.put(`http://157.230.227.216/api/productos-detalles/${detalleToUpdate.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      : axios.post('http://157.230.227.216/api/productos-detalles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

    request
      .then(() => {
        setVisible(false)
        refreshDetallesList()
        showToast(detalleToUpdate ? 'Producto detalle actualizado con éxito' : 'Producto detalle creado con éxito', 'success')
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message
        console.error('Error al guardar detalle:', error)
        showToast(`Error al ${detalleToUpdate ? 'actualizar' : 'crear'} el detalle: ${errorMsg}`, 'danger')
      })
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader style={{ backgroundColor: 'black', color: 'white' }}>
        <CModalTitle>{detalleToUpdate ? 'Actualizar Detalle' : 'Registrar Nuevo Detalle'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          {/* Producto */}
          <CFormSelect
            label="Producto"
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
          >
            <option value="">Selecciona un producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre}
              </option>
            ))}
          </CFormSelect>

          {/* Color */}
          <CFormSelect
            label="Color"
            value={colorId}
            onChange={(e) => setColorId(e.target.value)}
            className="mt-3"
          >
            <option value="">Selecciona un color</option>
            {colores.map((color) => (
              <option key={color.id} value={color.id}>
                {color.nombre}
              </option>
            ))}
          </CFormSelect>

          {/* Tamaño */}
          <CFormSelect
            label="Tamaño"
            value={tamañoId}
            onChange={(e) => setTamañoId(e.target.value)}
            className="mt-3"
          >
            <option value="">Selecciona un tamaño</option>
            {tamaños.map((tamaño) => (
              <option key={tamaño.id} value={tamaño.id}>
                {tamaño.nombre}
              </option>
            ))}
          </CFormSelect>

          {/* Imagen 2D */}
          <CFormInput
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-3"
          />
          {imagePreview && (
            <div className="mt-3">
              <p>Vista Previa de la Imagen:</p>
              <img src={imagePreview} alt="Vista previa" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          )}
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
  )
}

ProductoDetalleModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  detalleToUpdate: PropTypes.object, // Puede ser nulo si es un nuevo detalle
  refreshDetallesList: PropTypes.func.isRequired, // Función para actualizar la lista de detalles
  showToast: PropTypes.func.isRequired, // Función para mostrar toast con tipo de mensaje (éxito o error)
}

export default ProductoDetalleModal
