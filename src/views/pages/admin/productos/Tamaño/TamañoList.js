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
import TamañoModal from './TamañoModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const TamañoList = () => {
  const [tamaños, setTamaños] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [tamañoToUpdate, setTamañoToUpdate] = useState(null)
  const [tamañoToDelete, setTamañoToDelete] = useState(null)
  const [toasts, addToast] = useState([])
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchTamaños()
  }, [])

  const fetchTamaños = () => {
    axios
      .get('http://157.230.227.216/api/tamaños', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      }) // Ajusta la URL de tu API
      .then((response) => {
        setTamaños(response.data)
      })
      .catch((error) => {
        console.error('Error fetching tamaños:', error)
      })
  }

  const handleAddTamañoClick = () => {
    setTamañoToUpdate(null)
    setModalVisible(true)
  }

  const handleEditTamañoClick = (tamaño) => {
    setTamañoToUpdate(tamaño)
    setModalVisible(true)
  }

  const handleDeleteClick = (tamaño) => {
    setTamañoToDelete(tamaño)
    setDeleteModalVisible(true)
  }

  const confirmDeleteTamaño = () => {
    axios
      .delete(`http://157.230.227.216/api/tamaños/${tamañoToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setTamaños(tamaños.filter((t) => t.id !== tamañoToDelete.id))
        setDeleteModalVisible(false)
        showToast('Tamaño eliminado con éxito')
      })
      .catch((error) => {
        console.error('Error deleting tamaño:', error)
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
              <strong>Lista de Tamaños</strong>
            </div>
            <CButton color="primary" onClick={handleAddTamañoClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Añadir Tamaño
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Dimensiones</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {tamaños.map((tamaño, index) => (
                  <CTableRow key={tamaño.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{tamaño.nombre}</CTableDataCell>
                    <CTableDataCell>{tamaño.dimensiones}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditTamañoClick(tamaño)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(tamaño)}>
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

      {/* Modal para agregar/editar tamaño */}
      <TamañoModal
        visible={modalVisible}
        setVisible={setModalVisible}
        tamañoToUpdate={tamañoToUpdate}
        refreshTamañoList={fetchTamaños}
        showToast={showToast}
      />

      {/* Modal de confirmación para eliminar tamaño */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteTamaño}
      />

      {/* Mostrar toasts */}
      <CToaster>{toasts}</CToaster>
    </CRow>
  )
}

export default TamañoList
