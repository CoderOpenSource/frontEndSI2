import React from 'react';
import PropTypes from 'prop-types';
import { CButton, CModal, CModalHeader, CModalBody, CModalFooter, CModalTitle } from '@coreui/react';

const ConfirmDeleteModal = ({ visible, setVisible, onConfirm }) => {
  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>Confirmación</CModalTitle>
      </CModalHeader>
      <CModalBody>¿Estás seguro que deseas eliminar este carrito?</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="danger" onClick={onConfirm}>
          Eliminar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

ConfirmDeleteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmDeleteModal;
