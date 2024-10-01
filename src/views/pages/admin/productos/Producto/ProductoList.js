import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CCardBody,
  CCard,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CToaster,
  CToast,
  CToastBody,
  CButtonGroup,
} from '@coreui/react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ProductoModal from './ProductoModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'

// Axios Interceptor to log request and response details
axios.interceptors.request.use(
  (config) => {
    console.log('Request:', config)
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    console.log('Response:', response)
    return response
  },
  (error) => {
    console.error('Response Error:', error)
    return Promise.reject(error)
  }
)

const ProductoList = () => {
  const [productos, setProductos] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [productoToUpdate, setProductoToUpdate] = useState(null)
  const [productoToDelete, setProductoToDelete] = useState(null)
  const [toasts, addToast] = useState([])
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = () => {
    const token = localStorage.getItem('token') // Obtén el token almacenado en localStorage
    console.log("Token:", token)

    axios
      .get('http://157.230.227.216/api/productos', {
        headers: {
          Authorization: `Bearer ${token}`, // Añadir el token correctamente
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setProductos(response.data)
      })
      .catch((error) => {
        console.error('Error fetching productos:', error)
      })
  }

  const handleAddProductoClick = () => {
    setProductoToUpdate(null)
    setModalVisible(true)
  }

  const handleEditProductoClick = (producto) => {
    setProductoToUpdate(producto)
    setModalVisible(true)
  }

  const handleDeleteClick = (producto) => {
    setProductoToDelete(producto)
    setDeleteModalVisible(true)
  }

  const confirmDeleteProducto = () => {
    const token = localStorage.getItem('token') // Obtén el token antes de eliminar
    console.log("Token for DELETE:", token)

    axios
      .delete(`http://157.230.227.216/api/productos/${productoToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Añadir el token al encabezado de la solicitud
        },
      })
      .then(() => {
        setProductos(productos.filter((p) => p.id !== productoToDelete.id))
        setDeleteModalVisible(false)
        showToast('Producto eliminado con éxito')
      })
      .catch((error) => {
        console.error('Error deleting producto:', error)
      })
  }

  const showToast = (message, type = 'success') => {
    const newToast = (
      <CToast key={Date.now()} autohide={true} visible={true} color={type}>
        <CToastBody>{message}</CToastBody>
      </CToast>
    )

    addToast((prevToasts) => [...prevToasts, newToast])

    setTimeout(() => {
      addToast((prevToasts) => prevToasts.slice(1))
    }, 2000)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Lista de Productos</strong>
            </div>
            <CButton color="primary" onClick={handleAddProductoClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Añadir Producto
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Descripción</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Precio</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Descuento Porcentaje</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Categoría</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Subcategoría</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {productos.map((producto, index) => (
                  <CTableRow key={producto.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{producto.nombre}</CTableDataCell>
                    <CTableDataCell>{producto.descripcion}</CTableDataCell>
                    <CTableDataCell>{producto.precio}</CTableDataCell>
                    <CTableDataCell>{producto.descuentoPorcentaje}</CTableDataCell>
                    <CTableDataCell>{producto.categoria?.nombre}</CTableDataCell>
                    <CTableDataCell>{producto.subcategoria?.nombre}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditProductoClick(producto)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(producto)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CButtonGroup>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal para agregar/editar producto */}
      <ProductoModal
        visible={modalVisible}
        setVisible={setModalVisible}
        productoToUpdate={productoToUpdate}
        refreshProductoList={fetchProductos}
        showToast={showToast}
      />

      {/* Modal de confirmación para eliminar producto */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteProducto}
      />

      {/* Mostrar toasts */}
      <CToaster>{toasts}</CToaster>
    </CRow>
  )
}

export default ProductoList
