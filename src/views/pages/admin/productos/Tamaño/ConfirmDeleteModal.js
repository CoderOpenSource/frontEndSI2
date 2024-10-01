import React from 'react'
import PropTypes from 'prop-types'
import { CButton, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle } from '@coreui/react'

const ConfirmDeleteModal = ({ visible, setVisible, onConfirm }) => {
  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader style={{ backgroundColor: 'black', color: 'white' }}>
        <CModalTitle>Confirmación</CModalTitle>
      </CModalHeader>
      <CModalBody>¿Estás seguro que deseas eliminar este Tamaño?</CModalBody> {/* Actualizado para Tamaño */}
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="danger" onClick={onConfirm} style={{ color: 'white' }}>
          Eliminar
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

// Definir prop-types para las propiedades del componente
ConfirmDeleteModal.propTypes = {
  visible: PropTypes.bool.isRequired, // visible debe ser un booleano
  setVisible: PropTypes.func.isRequired, // setVisible debe ser una función
  onConfirm: PropTypes.func.isRequired, // onConfirm debe ser una función
}

export default ConfirmDeleteModal
