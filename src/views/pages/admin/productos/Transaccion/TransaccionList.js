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
  CButtonGroup,
} from '@coreui/react';
import { cilPlus, cilTrash, cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import TransaccionModal from './TransaccionModal'; // Modal para crear/editar
import ConfirmDeleteModal from './ConfirmDeleteModal'; // Modal para eliminar

const TransaccionList = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [transaccionToUpdate, setTransaccionToUpdate] = useState(null);
  const [transaccionToDelete, setTransaccionToDelete] = useState(null);
  const [toasts, addToast] = useState([]);
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchTransacciones();
  }, []);

  const fetchTransacciones = () => {
    axios
      .get('http://157.230.227.216/api/transacciones', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setTransacciones(response.data);
      })
      .catch((error) => {
        console.error('Error fetching transacciones:', error);
      });
  };

  const handleAddTransaccionClick = () => {
    setTransaccionToUpdate(null);
    setModalVisible(true);
  };

  const handleEditTransaccionClick = (transaccion) => {
    const transaccionEdit = {
      id: transaccion.id, // el ID de la transacción
      usuarioId: transaccion.usuarioId, // el ID del usuario
      carritoId: transaccion.carritoId, // el ID del carrito
      tipoPagoId: transaccion.tipoPagoId, // el ID del tipo de pago
      fecha: transaccion.fecha // cualquier otro valor que desees
    };
    setTransaccionToUpdate(transaccionEdit); // Se pasa la transacción procesada al modal
    setModalVisible(true); // Mostrar el modal
  };

  const handleDeleteClick = (transaccion) => {
    setTransaccionToDelete(transaccion);
    setDeleteModalVisible(true);
  };

  const confirmDeleteTransaccion = () => {
    axios
      .delete(`http://157.230.227.216/api/transacciones/${transaccionToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setTransacciones(transacciones.filter((t) => t.id !== transaccionToDelete.id));
        setDeleteModalVisible(false);
        showToast('Transacción eliminada con éxito');
      })
      .catch((error) => {
        console.error('Error deleting transacción:', error);
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
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="d-flex justify-content-between align-items-center bg-dark text-white">
            <div>
              <strong>Lista de Transacciones</strong>
            </div>
            <CButton color="success" onClick={handleAddTransaccionClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Agregar Transacción
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable hover bordered responsive>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Usuario</CTableHeaderCell>
                  <CTableHeaderCell>Carrito ID</CTableHeaderCell>
                  <CTableHeaderCell>Tipo de Pago</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {transacciones.map((transaccion, index) => (
                  <CTableRow key={transaccion.id} className={index % 2 === 0 ? 'table-light' : 'table-dark'}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{transaccion.usuarioNombre}</CTableDataCell>
                    <CTableDataCell>{transaccion.carritoId}</CTableDataCell>
                    <CTableDataCell>{transaccion.tipoPagoNombre}</CTableDataCell>
                    <CTableDataCell>{new Date(transaccion.fecha).toLocaleString()}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton color="warning" size="sm" className="me-2" onClick={() => handleEditTransaccionClick(transaccion)}>
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(transaccion)}>
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

      <TransaccionModal
        visible={modalVisible}
        setVisible={setModalVisible}
        transaccionToUpdate={transaccionToUpdate}
        refreshTransaccionList={fetchTransacciones}
        showToast={showToast}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteTransaccion}
      />

      <CToaster>{toasts}</CToaster>
    </CRow>
  );
};

export default TransaccionList;
