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
import CarritoModal from './CarritoModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const CarritoList = () => {
  const [carritos, setCarritos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [carritoToUpdate, setCarritoToUpdate] = useState(null);
  const [carritoToDelete, setCarritoToDelete] = useState(null);
  const [toasts, addToast] = useState([]);

  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchCarritos();
    fetchUsuarios(); // Obtener usuarios
  }, []);

  const fetchCarritos = () => {
    axios
      .get('http://157.230.227.216/api/carritos',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setCarritos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching carritos:', error);
      });
  };

  const fetchUsuarios = () => {
    axios
      .get('http://157.230.227.216/api/usuarios',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error('Error fetching usuarios:', error);
      });
  };

  const handleAddCarritoClick = () => {
    setCarritoToUpdate(null);
    setModalVisible(true);
  };

  const handleEditCarritoClick = (carrito) => {
    setCarritoToUpdate(carrito);
    setModalVisible(true);
  };

  const handleDeleteClick = (carrito) => {
    setCarritoToDelete(carrito);
    setDeleteModalVisible(true);
  };

  const confirmDeleteCarrito = () => {
    axios
      .delete(`http://157.230.227.216/api/carritos/${carritoToDelete.id}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setCarritos(carritos.filter((c) => c.id !== carritoToDelete.id));
        setDeleteModalVisible(false);
        showToast('Carrito eliminado con éxito');
      })
      .catch((error) => {
        console.error('Error deleting carrito:', error);
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
              <strong>Lista de Carritos</strong> <small>Todos los carritos</small>
            </div>
            <CButton color="primary" onClick={handleAddCarritoClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Agregar Carrito
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Usuario</CTableHeaderCell>
                  <CTableHeaderCell>Disponible</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {carritos.map((carrito, index) => (
                  <CTableRow key={carrito.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>
                      {usuarios.find(user => user.id === carrito.usuarioId)?.nombre || 'Desconocido'}
                    </CTableDataCell>
                    <CTableDataCell>{carrito.disponible ? 'Sí' : 'No'}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="warning" size="sm" className="me-2" onClick={() => handleEditCarritoClick(carrito)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" size="sm" onClick={() => handleDeleteClick(carrito)}>
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

      <CarritoModal
        visible={modalVisible}
        setVisible={setModalVisible}
        carritoToUpdate={carritoToUpdate}
        refreshCarritoList={fetchCarritos}
        showToast={showToast}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteCarrito}
      />

      <CToaster>{toasts}</CToaster>
    </CRow>
  );
};

export default CarritoList;
