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
import CarritoProductoDetalleModal from './CarritoProductoDetalleModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const CarritoProductoDetalleList = () => {
  const [detalles, setDetalles] = useState([]);
  const [productosDetalles, setProductosDetalles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [detalleToUpdate, setDetalleToUpdate] = useState(null);
  const [detalleToDelete, setDetalleToDelete] = useState(null);
  const [toasts, addToast] = useState([]);

  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchDetalles();
    fetchProductosDetalles(); // Obtener productos detalles
  }, []);

  const fetchDetalles = () => {
    axios
      .get('http://157.230.227.216/api/carrito-producto-detalles',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setDetalles(response.data);
      })
      .catch((error) => {
        console.error('Error fetching detalles:', error);
      });
  };

  const fetchProductosDetalles = () => {
    axios
      .get('http://157.230.227.216/api/productos-detalles',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setProductosDetalles(response.data);
      })
      .catch((error) => {
        console.error('Error fetching productos detalles:', error);
      });
  };

  const handleAddDetalleClick = () => {
    setDetalleToUpdate(null);
    setModalVisible(true);
  };

  const handleEditDetalleClick = (detalle) => {
    setDetalleToUpdate(detalle);
    setModalVisible(true);
  };

  const handleDeleteClick = (detalle) => {
    setDetalleToDelete(detalle);
    setDeleteModalVisible(true);
  };

  const confirmDeleteDetalle = () => {
    axios
      .delete(`http://157.230.227.216/api/carrito-producto-detalles/${detalleToDelete.id}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setDetalles(detalles.filter((d) => d.id !== detalleToDelete.id));
        setDeleteModalVisible(false);
        showToast('Detalle eliminado con éxito');
      })
      .catch((error) => {
        console.error('Error deleting detalle:', error);
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
              <strong>Lista de Detalles del Carrito</strong> <small>Todos los detalles</small>
            </div>
            <CButton color="primary" onClick={handleAddDetalleClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Agregar Detalle
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Carrito ID</CTableHeaderCell>
                  <CTableHeaderCell>Producto</CTableHeaderCell>
                  <CTableHeaderCell>Cantidad</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {detalles.map((detalle, index) => {
                  const producto = productosDetalles.find(pd => pd.id === detalle.productoDetalleId);
                  return (
                    <CTableRow key={detalle.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{detalle.carritoId}</CTableDataCell>
                      <CTableDataCell>{producto ? producto.producto.nombre : 'Desconocido'}</CTableDataCell>
                      <CTableDataCell>{detalle.cantidad}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="warning" size="sm" className="me-2" onClick={() => handleEditDetalleClick(detalle)}>
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(detalle)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <CarritoProductoDetalleModal
        visible={modalVisible}
        setVisible={setModalVisible}
        detalleToUpdate={detalleToUpdate}
        refreshDetalleList={fetchDetalles}
        showToast={showToast}
      />
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteDetalle}
      />
      <CToaster>{toasts}</CToaster>
    </CRow>
  );
};

export default CarritoProductoDetalleList;
