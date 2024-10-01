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

const ProductoModal = ({
                         visible,
                         setVisible,
                         productoToUpdate = null,
                         refreshProductoList,
                         showToast,
                       }) => {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [subcategoriaId, setSubcategoriaId] = useState('')
  const [categorias, setCategorias] = useState([])
  const [subcategorias, setSubcategorias] = useState([])  // Subcategorías filtradas
  const [allSubcategorias, setAllSubcategorias] = useState([])  // Todas las subcategorías
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    if (productoToUpdate) {
      setNombre(productoToUpdate.nombre)
      setDescripcion(productoToUpdate.descripcion)
      setPrecio(productoToUpdate.precio)
      setDescuentoPorcentaje(productoToUpdate.descuentoPorcentaje || '')
      setCategoriaId(productoToUpdate.categoria?.id || '')
      setSubcategoriaId(productoToUpdate.subcategoria?.id || '')
    } else {
      setNombre('')
      setDescripcion('')
      setPrecio('')
      setDescuentoPorcentaje('')
      setCategoriaId('')
      setSubcategoriaId('')
    }
    fetchCategorias()
    fetchAllSubcategorias()  // Cargar todas las subcategorías al inicio
  }, [productoToUpdate])

  // Función para obtener las categorías desde la API
  const fetchCategorias = () => {
    axios.get('http://157.230.227.216/api/categorias', {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
      },
    })
      .then((response) => {
        setCategorias(response.data)
      })
      .catch((error) => {
        console.error('Error al obtener categorías:', error)
      })
  }

  // Función para obtener todas las subcategorías desde la API
  const fetchAllSubcategorias = () => {
    axios.get('http://157.230.227.216/api/subcategorias', {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
      },
    })
      .then((response) => {
        setAllSubcategorias(response.data)  // Guardar todas las subcategorías
      })
      .catch((error) => {
        console.error('Error al obtener subcategorías:', error)
      })
  }

  // Función que se ejecuta al guardar un producto
  const handleSave = () => {
    const producto = {
      nombre,
      descripcion,
      precio,
      descuentoPorcentaje: parseFloat(descuentoPorcentaje),
      categoria: { id: categoriaId },
      subcategoria: { id: subcategoriaId },
    }

    const request = productoToUpdate
      ? axios.put(`http://157.230.227.216/api/productos/${productoToUpdate.id}`, producto, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      : axios.post('http://157.230.227.216/api/productos', producto, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })

    request
      .then((response) => {
        setVisible(false)
        refreshProductoList()
        showToast(
          productoToUpdate ? 'Producto actualizado con éxito' : 'Producto creado con éxito',
          'success',
        )
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message
        console.error('Error al guardar producto:', error)
        showToast(`Error al ${productoToUpdate ? 'actualizar' : 'crear'} el producto: ${errorMsg}`, 'danger')
      })
  }

  // Función que se ejecuta cuando se selecciona una categoría
  const handleCategoriaChange = (e) => {
    const selectedCategoriaId = e.target.value
    setCategoriaId(selectedCategoriaId)

    // Filtrar las subcategorías basadas en la categoría seleccionada
    const filteredSubcategorias = allSubcategorias.filter(subcategoria => subcategoria.categoria.id === parseInt(selectedCategoriaId))
    setSubcategorias(filteredSubcategorias)  // Actualizar las subcategorías filtradas
    setSubcategoriaId('')  // Reiniciar la selección de subcategoría
  }

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader style={{ backgroundColor: 'black', color: 'white' }}>
        <CModalTitle>{productoToUpdate ? 'Actualizar Producto' : 'Registrar Nuevo Producto'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput
            type="text"
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa el nombre del producto"
          />
          <CFormInput
            type="text"
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ingresa la descripción del producto"
          />
          <CFormInput
            type="number"
            label="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Ingresa el precio del producto"
          />
          <CFormInput
            type="number"
            label="Descuento (%)"
            value={descuentoPorcentaje}
            onChange={(e) => setDescuentoPorcentaje(e.target.value)}
            placeholder="Ingresa el porcentaje de descuento"
          />
          <CFormSelect
            label="Categoría"
            value={categoriaId}
            onChange={handleCategoriaChange}  // Cambiar categoría y cargar subcategorías
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </CFormSelect>
          <CFormSelect
            label="Subcategoría"
            value={subcategoriaId}
            onChange={(e) => setSubcategoriaId(e.target.value)}
          >
            <option value="">Selecciona una subcategoría</option>
            {subcategorias.length > 0
              ? subcategorias.map((subcategoria) => (
                <option key={subcategoria.id} value={subcategoria.id}>
                  {subcategoria.nombre}
                </option>
              ))
              : <option value="">No hay subcategorías disponibles</option>
            }
          </CFormSelect>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {productoToUpdate ? 'Actualizar Producto' : 'Guardar Producto'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ProductoModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  productoToUpdate: PropTypes.object,
  refreshProductoList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
}

export default ProductoModal
