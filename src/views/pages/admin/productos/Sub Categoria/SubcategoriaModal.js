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

const SubcategoriaModal = ({
                             visible,
                             setVisible,
                             subcategoriaToUpdate = null,
                             categorias,
                             refreshSubcategoriaList,
                             showToast,
                           }) => {
  const [nombre, setNombre] = useState('')
  const [categoriaId, setCategoriaId] = useState('')  // ID de la categoría seleccionada
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    if (subcategoriaToUpdate) {
      setNombre(subcategoriaToUpdate.nombre)
      setCategoriaId(subcategoriaToUpdate.categoria.id) // Establecer la categoría existente
    } else {
      setNombre('')
      setCategoriaId('')
    }
  }, [subcategoriaToUpdate])

  const handleSave = () => {
    const subcategoria = {
      nombre,
      categoria: { id: categoriaId },  // Asociar la subcategoría con la categoría seleccionada
    }

    const request = subcategoriaToUpdate
      ? axios.put(`http://157.230.227.216/api/subcategorias/${subcategoriaToUpdate.id}`, subcategoria,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
  : axios.post('http://157.230.227.216/api/subcategorias', subcategoria,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })

    request
      .then((response) => {
        setVisible(false)
        refreshSubcategoriaList()
        showToast(
          subcategoriaToUpdate ? 'Subcategoría actualizada con éxito' : 'Subcategoría creada con éxito',
          'success',
        )
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message
        console.error('Error al guardar subcategoría:', error)
        showToast(`Error al ${subcategoriaToUpdate ? 'actualizar' : 'crear'} la subcategoría:  ${errorMsg}`, 'danger')
      })
  }

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader style={{ backgroundColor: 'black', color: 'white' }}>
        <CModalTitle>{subcategoriaToUpdate ? 'Actualizar Subcategoría' : 'Registrar Nueva Subcategoría'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          {/* Nombre de la subcategoría */}
          <CFormInput
            type="text"
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa el nombre de la subcategoría"
          />

          {/* Selección de la categoría */}
          <CFormSelect
            label="Categoría"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="mt-3"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </CFormSelect>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {subcategoriaToUpdate ? 'Actualizar Subcategoría' : 'Guardar Subcategoría'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

SubcategoriaModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  subcategoriaToUpdate: PropTypes.object,
  categorias: PropTypes.array.isRequired, // Lista de categorías
  refreshSubcategoriaList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
}

export default SubcategoriaModal
