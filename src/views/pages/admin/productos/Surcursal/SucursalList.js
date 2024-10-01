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
import SucursalModal from './SucursalModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const SucursalList = () => {
  const [sucursales, setSucursales] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [sucursalToUpdate, setSucursalToUpdate] = useState(null);
  const [sucursalToDelete, setSucursalToDelete] = useState(null);
  const [toasts, addToast] = useState([]);
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchSucursales();
  }, []);

  const fetchSucursales = () => {
    axios
      .get('http://157.230.227.216/api/sucursales',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setSucursales(response.data);
      })
      .catch((error) => {
        console.error('Error fetching sucursales:', error);
      });
  };

  const handleAddSucursalClick = () => {
    setSucursalToUpdate(null);
    setModalVisible(true);
  };

  const handleEditSucursalClick = (sucursal) => {
    setSucursalToUpdate(sucursal);
    setModalVisible(true);
  };

  const handleDeleteClick = (sucursal) => {
    setSucursalToDelete(sucursal);
    setDeleteModalVisible(true);
  };

  const confirmDeleteSucursal = () => {
    axios
      .delete(`http://157.230.227.216/api/sucursales/${sucursalToDelete.id}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setSucursales(sucursales.filter((s) => s.id !== sucursalToDelete.id));
        setDeleteModalVisible(false);
        showToast('Sucursal eliminada con éxito');
      })
      .catch((error) => {
        console.error('Error deleting sucursal:', error);
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
              <strong>Lista de Sucursales</strong> <small>Todas las sucursales</small>
            </div>
            <CButton color="primary" onClick={handleAddSucursalClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Agregar Sucursal
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Nombre</CTableHeaderCell>
                  <CTableHeaderCell>Dirección</CTableHeaderCell>
                  <CTableHeaderCell>Teléfono</CTableHeaderCell>
                  <CTableHeaderCell>Latitud</CTableHeaderCell>
                  <CTableHeaderCell>Longitud</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {sucursales.map((sucursal, index) => (
                  <CTableRow key={sucursal.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{sucursal.nombre}</CTableDataCell>
                    <CTableDataCell>{sucursal.direccion}</CTableDataCell>
                    <CTableDataCell>{sucursal.telefono}</CTableDataCell>
                    <CTableDataCell>{sucursal.latitud}</CTableDataCell>
                    <CTableDataCell>{sucursal.longitud}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditSucursalClick(sucursal)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(sucursal)}>
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

      <SucursalModal
        visible={modalVisible}
        setVisible={setModalVisible}
        sucursalToUpdate={sucursalToUpdate}
        refreshSucursalList={fetchSucursales}
        showToast={showToast}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteSucursal}
      />

      <CToaster>{toasts}</CToaster>
    </CRow>
  );
};

export default SucursalList;
