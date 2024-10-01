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
  CButtonGroup
} from '@coreui/react';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ValoracionModal from './ValoracionModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const ValoracionList = () => {
  const [valoraciones, setValoraciones] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [valoracionToUpdate, setValoracionToUpdate] = useState(null);
  const [valoracionToDelete, setValoracionToDelete] = useState(null);
  const [toasts, addToast] = useState([]);
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchValoraciones();
  }, []);

  const fetchValoraciones = () => {
    axios
      .get('http://157.230.227.216/api/valoraciones', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setValoraciones(response.data);
      })
      .catch((error) => {
        console.error('Error fetching valoraciones:', error);
      });
  };

  const handleAddValoracionClick = () => {
    setValoracionToUpdate(null);
    setModalVisible(true);
  };

  const handleEditValoracionClick = (valoracion) => {
    setValoracionToUpdate(valoracion);
    setModalVisible(true);
  };

  const handleDeleteClick = (valoracion) => {
    setValoracionToDelete(valoracion);
    setDeleteModalVisible(true);
  };

  const confirmDeleteValoracion = () => {
    axios
      .delete(`http://157.230.227.216/api/valoraciones/${valoracionToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setValoraciones(valoraciones.filter((v) => v.id !== valoracionToDelete.id));
        setDeleteModalVisible(false);
        showToast('Valoración eliminada con éxito');
      })
      .catch((error) => {
        console.error('Error deleting valoracion:', error);
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
              <strong>Lista de Valoraciones</strong> <small>Todas las valoraciones</small>
            </div>
            <CButton color="primary" onClick={handleAddValoracionClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Agregar Valoración
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Usuario</CTableHeaderCell>
                  <CTableHeaderCell>Producto</CTableHeaderCell>
                  <CTableHeaderCell>Comentario</CTableHeaderCell>
                  <CTableHeaderCell>Calificación</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {valoraciones.map((valoracion, index) => (
                  <CTableRow key={valoracion.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{valoracion.usuario?.nombre}</CTableDataCell>
                    <CTableDataCell>{valoracion.producto?.nombre}</CTableDataCell>
                    <CTableDataCell>{valoracion.comentario}</CTableDataCell>
                    <CTableDataCell>{valoracion.calificacion}</CTableDataCell>
                    <CTableDataCell>{new Date(valoracion.fecha).toLocaleString()}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditValoracionClick(valoracion)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(valoracion)}>
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

      <ValoracionModal
        visible={modalVisible}
        setVisible={setModalVisible}
        valoracionToUpdate={valoracionToUpdate}
        refreshValoracionList={fetchValoraciones}
        showToast={showToast}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteValoracion}
      />

      <CToaster>{toasts}</CToaster>
    </CRow>
  );
};

export default ValoracionList;
