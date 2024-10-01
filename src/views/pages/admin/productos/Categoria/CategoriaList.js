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
import CategoriaModal from './CategoriaModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const CategoriaList = () => {
  const [categorias, setCategorias] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [categoriaToUpdate, setCategoriaToUpdate] = useState(null)
  const [categoriaToDelete, setCategoriaToDelete] = useState(null)
  const [toasts, addToast] = useState([])

  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = () => {
    axios
      .get('http://157.230.227.216/api/categorias', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setCategorias(response.data)
      })
      .catch((error) => {
        console.error('Error fetching categorias:', error)
      })
  }

  const handleAddCategoriaClick = () => {
    setCategoriaToUpdate(null)
    setModalVisible(true)
  }

  const handleEditCategoriaClick = (categoria) => {
    setCategoriaToUpdate(categoria)
    setModalVisible(true)
  }

  const handleDeleteClick = (categoria) => {
    setCategoriaToDelete(categoria)
    setDeleteModalVisible(true)
  }

  const confirmDeleteCategoria = () => {
    axios
      .delete(`http://157.230.227.216/api/categorias/${categoriaToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setCategorias(categorias.filter((c) => c.id !== categoriaToDelete.id))
        setDeleteModalVisible(false)
        showToast('Categoría eliminada con éxito')
      })
      .catch((error) => {
        console.error('Error deleting categoria:', error)
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
              <strong>Lista de Categorías</strong>
            </div>
            <CButton color="primary" onClick={handleAddCategoriaClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Añadir Categoría
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
                {categorias.map((categoria, index) => (
                  <CTableRow key={categoria.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{categoria.nombre}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditCategoriaClick(categoria)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(categoria)}>
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

      {/* Modal para agregar/editar categoría */}
      <CategoriaModal
        visible={modalVisible}
        setVisible={setModalVisible}
        categoriaToUpdate={categoriaToUpdate}
        refreshCategoriaList={fetchCategorias}
        showToast={showToast}
      />

      {/* Modal de confirmación para eliminar categoría */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteCategoria}
      />

      {/* Mostrar toasts */}
      <CToaster>{toasts}</CToaster>
    </CRow>
  )
}

export default CategoriaList
