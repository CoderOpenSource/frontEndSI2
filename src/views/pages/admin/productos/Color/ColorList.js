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
import ColorModal from './ColorModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const ColorList = () => {
  const [colores, setColores] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [colorToUpdate, setColorToUpdate] = useState(null)
  const [colorToDelete, setColorToDelete] = useState(null)
  const [toasts, addToast] = useState([])
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchColores()
  }, [])

  const fetchColores = () => {
    axios
      .get('http://157.230.227.216/api/colores', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      }) // Ajusta la URL de tu API
      .then((response) => {
        setColores(response.data)
      })
      .catch((error) => {
        console.error('Error fetching colores:', error)
      })
  }

  const handleAddColorClick = () => {
    setColorToUpdate(null)
    setModalVisible(true)
  }

  const handleEditColorClick = (color) => {
    setColorToUpdate(color)
    setModalVisible(true)
  }

  const handleDeleteClick = (color) => {
    setColorToDelete(color)
    setDeleteModalVisible(true)
  }

  const confirmDeleteColor = () => {
    axios
      .delete(`http://157.230.227.216/api/colores/${colorToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setColores(colores.filter((c) => c.id !== colorToDelete.id))
        setDeleteModalVisible(false)
        showToast('Color eliminado con éxito')
      })
      .catch((error) => {
        console.error('Error deleting color:', error)
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
              <strong>Lista de Colores</strong>
            </div>
            <CButton color="primary" onClick={handleAddColorClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Añadir Color
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {colores.map((color, index) => (
                  <CTableRow key={color.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{color.nombre}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditColorClick(color)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(color)}>
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

      {/* Modal para agregar/editar color */}
      <ColorModal
        visible={modalVisible}
        setVisible={setModalVisible}
        colorToUpdate={colorToUpdate}
        refreshColorList={fetchColores}
        showToast={showToast}
      />

      {/* Modal de confirmación para eliminar color */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteColor}
      />

      {/* Mostrar toasts */}
      <CToaster>{toasts}</CToaster>
    </CRow>
  )
}

export default ColorList
