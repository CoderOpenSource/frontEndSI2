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

const TamañoModal = ({
                       visible,
                       setVisible,
                       tamañoToUpdate = null,
                       refreshTamañoList,
                       showToast,
                     }) => {
  const [nombre, setNombre] = useState('')
  const [dimensiones, setDimensiones] = useState('')
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    if (tamañoToUpdate) {
      setNombre(tamañoToUpdate.nombre)
      setDimensiones(tamañoToUpdate.dimensiones)
    } else {
      setNombre('')
      setDimensiones('')
    }
  }, [tamañoToUpdate])

  const handleSave = () => {
    const tamaño = {
      nombre,
      dimensiones,
    }

    const request = tamañoToUpdate
      ? axios.put(`http://157.230.227.216/api/tamaños/${tamañoToUpdate.id}`, tamaño, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      : axios.post('http://157.230.227.216/api/tamaños', tamaño, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })

    request
      .then((response) => {
        setVisible(false)
        refreshTamañoList()
        showToast(
          tamañoToUpdate ? 'Tamaño actualizado con éxito' : 'Tamaño creado con éxito',
          'success',
        )
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message
        console.error('Error al guardar tamaño:', error)
        showToast(`Error al ${tamañoToUpdate ? 'actualizar' : 'crear'} el tamaño: ${errorMsg}`, 'danger')
      })
  }

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader style={{ backgroundColor: 'black', color: 'white' }}>
        <CModalTitle>{tamañoToUpdate ? 'Actualizar Tamaño' : 'Registrar Nuevo Tamaño'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput
            type="text"
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa el nombre del tamaño"
          />
          <CFormInput
            type="text"
            label="Dimensiones"
            value={dimensiones}
            onChange={(e) => setDimensiones(e.target.value)}
            placeholder="Ingresa las dimensiones del tamaño"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {tamañoToUpdate ? 'Actualizar Tamaño' : 'Guardar Tamaño'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

TamañoModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  tamañoToUpdate: PropTypes.object,
  refreshTamañoList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
}

export default TamañoModal
