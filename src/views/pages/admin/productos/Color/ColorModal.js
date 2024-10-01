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

const ColorModal = ({
                      visible,
                      setVisible,
                      colorToUpdate = null,
                      refreshColorList,
                      showToast,
                    }) => {
  const [nombre, setNombre] = useState('')
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    if (colorToUpdate) {
      setNombre(colorToUpdate.nombre)
    } else {
      setNombre('')
    }
  }, [colorToUpdate])

  const handleSave = () => {
    const color = {
      nombre,
    }

    const request = colorToUpdate
      ? axios.put(`http://157.230.227.216/api/colores/${colorToUpdate.id}`, color, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      : axios.post('http://157.230.227.216/api/colores', color, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })

    request
      .then((response) => {
        setVisible(false)
        refreshColorList()
        showToast(
          colorToUpdate ? 'Color actualizado con éxito' : 'Color creado con éxito',
          'success',
        )
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || error.message
        console.error('Error al guardar color:', error)
        showToast(`Error al ${colorToUpdate ? 'actualizar' : 'crear'} el color: ${errorMsg}`, 'danger')
      })
  }

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader style={{ backgroundColor: 'black', color: 'white' }}>
        <CModalTitle>{colorToUpdate ? 'Actualizar Color' : 'Registrar Nuevo Color'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput
            type="text"
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa el nombre del color"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {colorToUpdate ? 'Actualizar Color' : 'Guardar Color'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ColorModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  colorToUpdate: PropTypes.object,
  refreshColorList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
}

export default ColorModal
