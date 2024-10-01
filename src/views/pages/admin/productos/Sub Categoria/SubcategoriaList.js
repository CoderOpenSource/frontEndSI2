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
  CButtonGroup,
  CToast,
  CToastBody,
  CToaster,
} from '@coreui/react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import SubcategoriaModal from './SubcategoriaModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const SubcategoriaList = () => {
  const [subcategorias, setSubcategorias] = useState([])
  const [categorias, setCategorias] = useState([])  // Nueva lista para las categorías
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [subcategoriaToUpdate, setSubcategoriaToUpdate] = useState(null)
  const [subcategoriaToDelete, setSubcategoriaToDelete] = useState(null)
  const [toasts, addToast] = useState([])
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchSubcategorias()
    fetchCategorias()  // Cargar las categorías al inicio
  }, [])

  const fetchSubcategorias = () => {
    axios
      .get('http://157.230.227.216/api/subcategorias',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setSubcategorias(response.data)
      })
      .catch((error) => {
        console.error('Error fetching subcategorias:', error)
      })
  }

  const fetchCategorias = () => {
    axios
      .get('http://157.230.227.216/api/categorias',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })  // Asegúrate de que la URL sea correcta
      .then((response) => {
        setCategorias(response.data)
      })
      .catch((error) => {
        console.error('Error fetching categorias:', error)
      })
  }

  const handleAddSubcategoriaClick = () => {
    setSubcategoriaToUpdate(null)
    setModalVisible(true)
  }

  const handleEditSubcategoriaClick = (subcategoria) => {
    setSubcategoriaToUpdate(subcategoria)
    setModalVisible(true)
  }

  const handleDeleteClick = (subcategoria) => {
    setSubcategoriaToDelete(subcategoria)
    setDeleteModalVisible(true)
  }

  const confirmDeleteSubcategoria = () => {
    axios
      .delete(`http://157.230.227.216/api/subcategorias/${subcategoriaToDelete.id}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
  .then(() => {
      setSubcategorias(subcategorias.filter((s) => s.id !== subcategoriaToDelete.id))
      setDeleteModalVisible(false)
      showToast('Subcategoría eliminada con éxito')
    })
      .catch((error) => {
        console.error('Error deleting subcategoria:', error)
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
              <strong>Lista de Subcategorías</strong>
            </div>
            <CButton color="primary" onClick={handleAddSubcategoriaClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Añadir Subcategoría
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Categoría</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {subcategorias.map((subcategoria, index) => (
                  <CTableRow key={subcategoria.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{subcategoria.nombre}</CTableDataCell>
                    <CTableDataCell>{subcategoria.categoria.nombre}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditSubcategoriaClick(subcategoria)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(subcategoria)}>
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

      {/* Modal para agregar/editar subcategoría */}
      <SubcategoriaModal
        visible={modalVisible}
        setVisible={setModalVisible}
        subcategoriaToUpdate={subcategoriaToUpdate}
        categorias={categorias} // Pasar la lista de categorías al modal
        refreshSubcategoriaList={fetchSubcategorias}
        showToast={showToast}
      />

      {/* Modal de confirmación para eliminar subcategoría */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteSubcategoria}
      />

      {/* Mostrar toasts */}
      <CToaster>{toasts}</CToaster>
    </CRow>
  )
}

export default SubcategoriaList
