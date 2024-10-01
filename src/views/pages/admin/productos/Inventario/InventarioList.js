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
  CButtonGroup,
  CToast,
  CToastBody,
  CToaster,
} from '@coreui/react';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import InventarioModal from './InventarioModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const InventarioList = () => {
  const [inventarios, setInventarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [inventarioToUpdate, setInventarioToUpdate] = useState(null);
  const [inventarioToDelete, setInventarioToDelete] = useState(null);
  const [toasts, addToast] = useState([]);
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchInventarios();
  }, []);

  const fetchInventarios = () => {
    axios
      .get('http://157.230.227.216/api/inventarios',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setInventarios(response.data);
      })
      .catch((error) => {
        console.error('Error fetching inventarios:', error);
      });
  };

  const handleAddInventarioClick = () => {
    setInventarioToUpdate(null);
    setModalVisible(true);
  };

  const handleEditInventarioClick = (inventario) => {
    setInventarioToUpdate(inventario);
    setModalVisible(true);
  };

  const handleDeleteClick = (inventario) => {
    setInventarioToDelete(inventario);
    setDeleteModalVisible(true);
  };

  const confirmDeleteInventario = () => {
    axios
      .delete(`http://157.230.227.216/api/inventarios/${inventarioToDelete.id}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setInventarios(inventarios.filter((i) => i.id !== inventarioToDelete.id));
        setDeleteModalVisible(false);
        showToast('Inventario eliminado con éxito');
      })
      .catch((error) => {
        console.error('Error deleting inventario:', error);
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
              <strong>Lista de Inventarios</strong> <small>Todos los inventarios</small>
            </div>
            <CButton color="primary" onClick={handleAddInventarioClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Agregar Inventario
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Sucursal</CTableHeaderCell>
                  <CTableHeaderCell>Producto</CTableHeaderCell>
                  <CTableHeaderCell>Color</CTableHeaderCell>
                  <CTableHeaderCell>Tamaño</CTableHeaderCell>
                  <CTableHeaderCell>Cantidad</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {inventarios.map((inventario, index) => (
                  <CTableRow key={inventario.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{inventario.sucursal.nombre}</CTableDataCell>
                    <CTableDataCell>{inventario.productodetalle.producto.nombre}</CTableDataCell>
                    <CTableDataCell>{inventario.productodetalle.color.nombre}</CTableDataCell>
                    <CTableDataCell>{inventario.productodetalle.tamaño.nombre}</CTableDataCell>
                    <CTableDataCell>{inventario.cantidad}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditInventarioClick(inventario)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(inventario)}>
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

      <InventarioModal
        visible={modalVisible}
        setVisible={setModalVisible}
        inventarioToUpdate={inventarioToUpdate}
        refreshInventarioList={fetchInventarios}
        showToast={showToast}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteInventario}
      />

      <CToaster>{toasts}</CToaster>
    </CRow>
  );
};

export default InventarioList;
