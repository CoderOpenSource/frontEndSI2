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
} from '@coreui/react'
import axios from 'axios'

const CategoriaModal = ({
                          visible,
                          setVisible,
                          categoriaToUpdate = null,
                          refreshCategoriaList,
                          showToast,
                        }) => {
  const [nombre, setNombre] = useState('')

  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''

  useEffect(() => {
    if (categoriaToUpdate) {
      setNombre(categoriaToUpdate.nombre)
    } else {
      setNombre('')
    }
  }, [categoriaToUpdate])

  const handleSave = () => {
    const categoria = {
      nombre,
    }

    const request = categoriaToUpdate
      ? axios.put(`http://157.230.227.216/api/categorias/${categoriaToUpdate.id}`, categoria, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      : axios.post('http://157.230.227.216/api/categorias', categoria, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })

    request
      .then((response) => {
        setVisible(false)
        refreshCategoriaList()
        showToast(
          categoriaToUpdate ? 'Categoría actualizada con éxito' : 'Categoría creada con éxito',
          'success',
        )
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message
        console.error('Error al guardar categoría:', error)
        showToast(`Error al ${categoriaToUpdate ? 'actualizar' : 'crear'} la categoría: ${errorMsg}`, 'danger')
      })
  }

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader style={{ backgroundColor: 'black', color: 'white' }}>
        <CModalTitle>{categoriaToUpdate ? 'Actualizar Categoría' : 'Registrar Nueva Categoría'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput
            type="text"
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa el nombre de la categoría"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {categoriaToUpdate ? 'Actualizar Categoría' : 'Guardar Categoría'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

CategoriaModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  categoriaToUpdate: PropTypes.object,
  refreshCategoriaList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
}

export default CategoriaModal
