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
  CToast,
  CToastBody,
  CToaster,
  CButtonGroup
} from '@coreui/react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import FavoritoModal from './FavoritoModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const FavoritoList = () => {
  const [favoritos, setFavoritos] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [favoritoToUpdate, setFavoritoToUpdate] = useState(null)
  const [favoritoToDelete, setFavoritoToDelete] = useState(null)
  const [toasts, addToast] = useState([])
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchFavoritos()
  }, [])

  const fetchFavoritos = () => {
    axios
      .get('http://157.230.227.216/api/productos-favoritos',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setFavoritos(response.data)
      })
      .catch((error) => {
        console.error('Error fetching favoritos:', error)
      })
  }

  const handleAddFavoritoClick = () => {
    setFavoritoToUpdate(null)
    setModalVisible(true)
  }

  const handleEditFavoritoClick = (favorito) => {
    setFavoritoToUpdate(favorito)
    setModalVisible(true)
  }

  const handleDeleteClick = (favorito) => {
    setFavoritoToDelete(favorito)
    setDeleteModalVisible(true)
  }

  const confirmDeleteFavorito = () => {
    axios
      .delete(`http://157.230.227.216/api/productos-favoritos/eliminar?usuarioId=${favoritoToDelete.usuario.id}&productoId=${favoritoToDelete.producto.id}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setFavoritos(favoritos.filter((f) => f.id !== favoritoToDelete.id))
        setDeleteModalVisible(false)
        showToast('Producto favorito eliminado con éxito')
      })
      .catch((error) => {
        console.error('Error deleting favorito:', error)
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
              <strong>Lista de Productos Favoritos</strong> <small>Todos los favoritos</small>
            </div>
            <CButton color="primary" onClick={handleAddFavoritoClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Agregar Favorito
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Usuario</CTableHeaderCell>
                  <CTableHeaderCell>Producto</CTableHeaderCell>
                  <CTableHeaderCell>Fecha Agregado</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {favoritos.map((favorito, index) => (
                  <CTableRow key={favorito.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{favorito.usuario.nombre}</CTableDataCell>
                    <CTableDataCell>{favorito.producto.nombre}</CTableDataCell>
                    <CTableDataCell>{new Date(favorito.fechaAgregado).toLocaleDateString()}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditFavoritoClick(favorito)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(favorito)}>
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

      <FavoritoModal
        visible={modalVisible}
        setVisible={setModalVisible}
        favoritoToUpdate={favoritoToUpdate}
        refreshFavoritoList={fetchFavoritos}
        showToast={showToast}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteFavorito}
      />

      <CToaster>{toasts}</CToaster>
    </CRow>
  )
}

export default FavoritoList
