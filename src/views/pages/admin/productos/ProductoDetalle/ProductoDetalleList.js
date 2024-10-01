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
  CAvatar,
  CButtonGroup,
  CToast,
  CToastBody,
  CToaster,
} from '@coreui/react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ProductoDetalleModal from './ProductoDetalleModal'
import ConfirmDeleteModal from './ConfirmDeleteModal' // Importamos el modal de confirmación

const ProductoDetalleList = () => {
  const [detalles, setDetalles] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [detalleToUpdate, setDetalleToUpdate] = useState(null)
  const [detalleToDelete, setDetalleToDelete] = useState(null)
  const [toasts, addToast] = useState([]) // Array de toasts
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchDetalles()
  }, [])

  const fetchDetalles = () => {
    axios
      .get('http://157.230.227.216/api/productos-detalles',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setDetalles(response.data)
      })
      .catch((error) => {
        console.error('Error fetching detalles:', error)
      })
  }

  const handleAddDetalleClick = () => {
    setDetalleToUpdate(null) // Limpiamos el detalle seleccionado para que sea un nuevo detalle
    setModalVisible(true)
  }

  const handleEditDetalleClick = (detalle) => {
    setDetalleToUpdate(detalle) // Guardamos el detalle que vamos a actualizar
    setModalVisible(true) // Abrimos el modal
  }

  const handleDeleteClick = (detalle) => {
    setDetalleToDelete(detalle) // Guardar el detalle que se va a eliminar
    setDeleteModalVisible(true) // Mostrar el modal de confirmación
  }

  const confirmDeleteDetalle = () => {
    axios
      .delete(`http://157.230.227.216/api/productos-detalles/${detalleToDelete.id}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setDetalles(detalles.filter((d) => d.id !== detalleToDelete.id))
        setDeleteModalVisible(false)
        showToast('Producto detalle eliminado con éxito')
      })
      .catch((error) => {
        console.error('Error deleting detalle:', error)
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
    }, 2000) // Toast se elimina después de 2 segundos
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Lista de Detalles de Producto</strong> <small>Todos los detalles</small>
            </div>
            <CButton color="primary" onClick={handleAddDetalleClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Añadir Detalle
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Imagen 2D</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Producto</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Color</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tamaño</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {detalles.map((detalle, index) => (
                  <CTableRow key={detalle.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>
                      <CAvatar src={detalle.imagen2D} size="md" />
                    </CTableDataCell>
                    <CTableDataCell>{detalle.producto.nombre}</CTableDataCell>
                    <CTableDataCell>{detalle.color.nombre}</CTableDataCell>
                    <CTableDataCell>{detalle.tamaño.nombre}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditDetalleClick(detalle)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(detalle)}>
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

      {/* Modal para agregar/editar detalle */}
      <ProductoDetalleModal
        visible={modalVisible}
        setVisible={setModalVisible}
        detalleToUpdate={detalleToUpdate}
        refreshDetallesList={fetchDetalles} // Refrescar la lista
        showToast={showToast} // Mostrar toast
      />

      {/* Modal de confirmación para eliminar detalle */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteDetalle} // Pasamos la función para confirmar la eliminación
      />

      {/* Mostrar toasts */}
      <CToaster>{toasts}</CToaster>
    </CRow>
  )
}

export default ProductoDetalleList
