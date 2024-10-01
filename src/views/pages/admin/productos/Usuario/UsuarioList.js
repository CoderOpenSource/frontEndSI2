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
import UsuarioModal from './UsuarioModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [usuarioToUpdate, setUsuarioToUpdate] = useState(null)
  const [usuarioToDelete, setUsuarioToDelete] = useState(null)
  const [toasts, setToasts] = useState([])

  // Obtiene el token almacenado (puedes usar localStorage o sessionStorage)
  const token = localStorage.getItem('token') || ''

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = () => {
    axios
      .get('http://157.230.227.216/api/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setUsuarios(response.data)
      })
      .catch((error) => {
        console.error('Error fetching usuarios:', error)
      })
  }

  const handleAddUsuarioClick = () => {
    setUsuarioToUpdate(null)
    setModalVisible(true)
  }

  const handleEditUsuarioClick = (usuario) => {
    setUsuarioToUpdate(usuario)
    setModalVisible(true)
  }

  const handleDeleteClick = (usuario) => {
    setUsuarioToDelete(usuario)
    setDeleteModalVisible(true)
  }

  const confirmDeleteUsuario = () => {
    axios
      .delete(`http://157.230.227.216/api/usuarios/${usuarioToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setUsuarios(usuarios.filter((u) => u.id !== usuarioToDelete.id))
        setDeleteModalVisible(false)
        showToast('Usuario eliminado con éxito')
      })
      .catch((error) => {
        console.error('Error eliminando usuario:', error)
      })
  }

  const showToast = (message, type = 'success') => {
    const newToast = (
      <CToast key={Date.now()} autohide={true} visible={true} color={type}>
        <CToastBody>{message}</CToastBody>
      </CToast>
    )
    setToasts((prevToasts) => [...prevToasts, newToast])
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.slice(1))
    }, 2000)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Lista de Usuarios</strong>
            <CButton color="primary" onClick={handleAddUsuarioClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Añadir Usuario
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Nombre</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Rol</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {usuarios.map((usuario, index) => (
                  <CTableRow key={usuario.id}>
                    <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{usuario.nombre}</CTableDataCell>
                    <CTableDataCell>{usuario.email}</CTableDataCell>
                    <CTableDataCell>{usuario.rol?.nombre || 'Sin rol'}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditUsuarioClick(usuario)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(usuario)}>
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

      <UsuarioModal
        visible={modalVisible}
        setVisible={setModalVisible}
        usuarioToUpdate={usuarioToUpdate}
        refreshUsuarioList={fetchUsuarios}
        showToast={showToast}
      />

      {/* Modal de confirmación para eliminar usuario */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteUsuario}
      />

      {/* Mostrar toasts */}
      <CToaster>{toasts}</CToaster>
    </CRow>
  )
}

export default UsuarioList
