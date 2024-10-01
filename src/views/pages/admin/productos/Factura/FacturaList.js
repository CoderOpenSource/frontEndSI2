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
  CToaster,
  CToast,
  CToastBody,
  CButtonGroup,
} from '@coreui/react';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import FacturaModal from './FacturaModal'; // Modal para crear/editar factura
import ConfirmDeleteModal from './ConfirmDeleteModal'; // Modal para eliminar factura

const FacturaList = () => {
  const [facturas, setFacturas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [facturaToUpdate, setFacturaToUpdate] = useState(null);
  const [facturaToDelete, setFacturaToDelete] = useState(null);
  const [toasts, addToast] = useState([]);
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = () => {
    axios
      .get('http://157.230.227.216/api/facturas',{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setFacturas(response.data);
      })
      .catch((error) => {
        console.error('Error fetching facturas:', error);
      });
  };

  const handleAddFacturaClick = () => {
    setFacturaToUpdate(null);
    setModalVisible(true);
  };

  const handleEditFacturaClick = (factura) => {
    setFacturaToUpdate(factura);
    setModalVisible(true);
  };

  const handleDeleteClick = (factura) => {
    setFacturaToDelete(factura);
    setDeleteModalVisible(true);
  };

  const confirmDeleteFactura = () => {
    axios
      .delete(`http://157.230.227.216/api/facturas/${facturaToDelete.id}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then(() => {
        setFacturas(facturas.filter((f) => f.id !== facturaToDelete.id));
        setDeleteModalVisible(false);
        showToast('Factura eliminada con éxito');
      })
      .catch((error) => {
        console.error('Error deleting factura:', error);
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
              <strong>Lista de Facturas</strong>
            </div>
            <CButton color="primary" onClick={handleAddFacturaClick}>
              <CIcon icon={cilPlus} className="me-2" />
              Añadir Factura
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead>
                <CTableRow color="dark">
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Transacción ID</CTableHeaderCell>
                  <CTableHeaderCell>URL PDF</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {facturas.map((factura, index) => (
                  <CTableRow key={factura.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{factura.transaccionId}</CTableDataCell>
                    <CTableDataCell>
                      {factura.urlPdf ? (
                        <a href={factura.urlPdf} target="_blank" rel="noopener noreferrer">
                          Ver PDF
                        </a>
                      ) : (
                        'Sin archivo'
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{factura.fecha ? new Date(factura.fecha).toLocaleString() : 'Sin fecha'}</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton
                          color="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditFacturaClick(factura)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDeleteClick(factura)}>
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

      <FacturaModal
        visible={modalVisible}
        setVisible={setModalVisible}
        facturaToUpdate={facturaToUpdate}
        refreshFacturaList={fetchFacturas}
        showToast={showToast}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onConfirm={confirmDeleteFactura}
      />

      <CToaster>{toasts}</CToaster>
    </CRow>
  );
};

export default FacturaList;
