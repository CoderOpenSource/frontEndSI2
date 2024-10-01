import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  CToast,
  CToastBody,
  CToaster,
} from '@coreui/react';
import { cilPlus, cilTrash, cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import TipoPagoModal from './TipoPagoModal'; // Vista de creación/edición
import ConfirmDeleteModal from './ConfirmDeleteModal'; // Modal de confirmación de eliminación

const TipoPagoList = () => {
  const [tiposPago, setTiposPago] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [tipoPagoToUpdate, setTipoPagoToUpdate] = useState(null);
  const [tipoPagoToDelete, setTipoPagoToDelete] = useState(null);
  const [toasts, addToast] = useState([]);
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchTiposPago();
  }, []);

  const fetchTiposPago = () => {
    axios
      .get('http://157.230.227.216/api/tipo-pagos', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setTiposPago(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tipos de pago:', error);
      });
  };

  const handleAddTipoPagoClick = () => {
    setTipoPagoToUpdate(null);
    setModalVisible(true);
  };

  const handleEditTipoPagoClick = (tipoPago) => {
    setTipoPagoToUpdate(tipoPago);
    setModalVisible(true);
  };

  const handleDeleteClick = (tipoPago) => {
    setTipoPagoToDelete(tipoPago);
    setDeleteModalVisible(true);
  };

  const confirmDeleteTipoPago = () => {
    axios
      .delete(`http://157.230.227.216/api/tipo-pagos/${tipoPagoToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setTiposPago(tiposPago.filter((tp) => tp.id !== tipoPagoToDelete.id));
        setDeleteModalVisible(false);
        showToast('Tipo de pago eliminado con éxito');
      })
      .catch((error) => {
        console.error('Error deleting tipo de pago:', error);
      });
  };

  const showToast = (message, type = 'success') => {
    const newToast = (
      <CToast key={Date.now()} autohide={true} visible={true} color={type}>
        <CToastBody>{message}</CToastBody>
      </CToast>
    );
    addToast((prevToasts) => [...prevToasts, newToast]);
    setTimeout(() => {
      addToast((prevToasts) => prevToasts.slice(1));
    }, 2000);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Lista de Tipos de Pago</strong> <small>Todos los tipos de pago</small>
            </div>
            <CButton color="primary" onClick={handleAddTipoPagoClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Agregar Tipo de Pago
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Nombre</CTableHeaderCell>
                  <CTableHeaderCell>Imagen QR</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {tiposPago.map((tipoPago, index) => (
                  <CTableRow key={tipoPago.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{tipoPago.nombre}</CTableDataCell>
                    <CTableDataCell>
                      {tipoPago.imagenQr ? (
                        <img src={tipoPago.imagenQr} alt="QR Code" style={{ height: '50px' }} />
                      ) : (
                        'Sin QR'
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="warning" size="sm" className="me-2" onClick={() => handleEditTipoPagoClick(tipoPago)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" size="sm" onClick={() => handleDeleteClick(tipoPago)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <TipoPagoModal
        visible={modalVisible}
        setVisible={setModalVisible}
        tipoPagoToUpdate={tipoPagoToUpdate}
        refreshTipoPagoList={fetchTiposPago}
        showToast={showToast}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteTipoPago}
      />

      <CToaster>{toasts}</CToaster>
    </CRow>
  );
};

export default TipoPagoList;
