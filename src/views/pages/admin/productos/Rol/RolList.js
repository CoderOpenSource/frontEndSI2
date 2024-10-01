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
import RolModal from './RolModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const RolList = () => {
  const [roles, setRoles] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [rolToUpdate, setRolToUpdate] = useState(null)
  const [rolToDelete, setRolToDelete] = useState(null)
  const [toasts, addToast] = useState([])
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = () => {
    axios
      .get('http://157.230.227.216/api/roles',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setRoles(response.data)
      })
      .catch((error) => {
        console.error('Error fetching roles:', error)
      })
  }

  const handleAddRolClick = () => {
    setRolToUpdate(null)
    setModalVisible(true)
  }

  const handleEditRolClick = (rol) => {
    setRolToUpdate(rol)
    setModalVisible(true)
  }

  const handleDeleteClick = (rol) => {
    setRolToDelete(rol)
    setDeleteModalVisible(true)
  }

  const confirmDeleteRol = () => {
    axios
      .delete(`http://157.230.227.216/api/roles/${rolToDelete.id}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setRoles(roles.filter((r) => r.id !== rolToDelete.id))
        setDeleteModalVisible(false)
        showToast('Rol eliminado con éxito')
      })
      .catch((error) => {
        console.error('Error eliminando rol:', error)
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
            <strong>Lista de Roles</strong>
            <CButton color="primary" onClick={handleAddRolClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Añadir Rol
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Nombre</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {roles.map((rol, index) => (
                  <CTableRow key={rol.id}>
                    <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{rol.nombre}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditRolClick(rol)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(rol)}>
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

      {/* Modal para agregar/editar rol */}
      <RolModal
        visible={modalVisible}
        setVisible={setModalVisible}
        rolToUpdate={rolToUpdate}
        refreshRolList={fetchRoles}
        showToast={showToast}
      />

      {/* Modal de confirmación para eliminar rol */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteRol}
      />

      {/* Mostrar toasts */}
      <CToaster>{toasts}</CToaster>
    </CRow>
  )
}

export default RolList
