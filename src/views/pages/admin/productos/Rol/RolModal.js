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

const RolModal = ({
                    visible,
                    setVisible,
                    rolToUpdate = null,
                    refreshRolList,
                    showToast,
                  }) => {
  const [nombre, setNombre] = useState('')
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    if (rolToUpdate) {
      setNombre(rolToUpdate.nombre)
    } else {
      setNombre('')
    }
  }, [rolToUpdate])

  const handleSave = () => {
    const rol = { nombre }

    const request = rolToUpdate
      ? axios.put(`http://157.230.227.216/api/roles/${rolToUpdate.id}`, rol,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      : axios.post('http://157.230.227.216/api/roles', rol,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })

    request
      .then((response) => {
        setVisible(false)
        refreshRolList()
        showToast(
          rolToUpdate ? 'Rol actualizado con éxito' : 'Rol creado con éxito',
          'success'
        )
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message
        console.error('Error al guardar rol:', error)
        showToast(`Error al ${rolToUpdate ? 'actualizar' : 'crear'} el rol: ${errorMsg}`, 'danger')
      })
  }

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>{rolToUpdate ? 'Actualizar Rol' : 'Crear Rol'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput
            type="text"
            label="Nombre del Rol"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa el nombre del rol"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {rolToUpdate ? 'Actualizar Rol' : 'Guardar Rol'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

RolModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  rolToUpdate: PropTypes.object,
  refreshRolList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
}

export default RolModal
