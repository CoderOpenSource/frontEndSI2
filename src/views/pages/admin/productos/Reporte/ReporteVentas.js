import React, { useState, useEffect } from 'react';
import {
  CCard, CCardBody, CForm, CFormInput, CFormLabel, CButton, CFormSelect,
  CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CSpinner, CCardHeader
} from '@coreui/react';
import axios from 'axios';

const ReporteVentas = () => {
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    idUsuario: '',
    idProducto: '',
    idTipoPago: '',
  });

  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  // Obtén el token almacenado en localStorage
  const token = localStorage.getItem('token') || ''
  // Fetch Productos, Usuarios, Tipos de Pago y Reportes
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [productosResponse, usuariosResponse, tiposPagoResponse, reportesResponse] = await Promise.all([
          axios.get('http://157.230.227.216/api/productos',{
            headers: {
              Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
            },
          }),
          axios.get('http://157.230.227.216/api/usuarios',{
            headers: {
              Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
            },
          }),
          axios.get('http://157.230.227.216/api/tipo-pagos',{
            headers: {
              Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
            },
          }),
          axios.get('http://157.230.227.216/api/reportes/ventas/all',{
            headers: {
              Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
            },
          })  // Fetch reportes ya generados
        ]);

        setProductos(productosResponse.data);
        setUsuarios(usuariosResponse.data);
        setTiposPago(tiposPagoResponse.data);
        setReportes(reportesResponse.data);  // Cargar los reportes generados
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchDatos();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const generarReporte = async (formato) => {
    const apiUrl = `http://157.230.227.216/api/reportes/ventas/${formato}`;

    // Asignar valores nulos a los filtros vacíos
    const params = {
      fechaInicio: filters.fechaInicio || null,
      fechaFin: filters.fechaFin || null,
      idUsuario: filters.idUsuario ? parseInt(filters.idUsuario, 10) : null,
      idProducto: filters.idProducto ? parseInt(filters.idProducto, 10) : null,
      idTipoPago: filters.idTipoPago ? parseInt(filters.idTipoPago, 10) : null
    };

    // Mostrar los parámetros que estás enviando
    console.log('Parámetros enviados:', params);

    try {
      setLoading(true);
      const response = await axios.get(apiUrl, { params, headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        } });
      const reporteGenerado = response.data;

      // Abrir el archivo generado en una nueva pestaña
      if (reporteGenerado.url) {
        window.open(reporteGenerado.url, '_blank');
      }

      // Actualizar la lista de reportes
      setReportes([...reportes, reporteGenerado]);

    } catch (error) {
      console.error('Error al generar el reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarReporte = async (id) => {
    try {
      await axios.delete(`http://157.230.227.216/api/reportes/ventas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      });
      setReportes(reportes.filter((reporte) => reporte.id !== id));
    } catch (error) {
      console.error('Error al eliminar el reporte:', error);
    }
  };

  return (
    <>
      <CCard>
        <CCardBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="fechaInicio">Fecha Inicio</CFormLabel>
              <CFormInput
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={filters.fechaInicio}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="fechaFin">Fecha Fin</CFormLabel>
              <CFormInput
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={filters.fechaFin}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="idUsuario">Usuario</CFormLabel>
              <CFormSelect
                id="idUsuario"
                name="idUsuario"
                value={filters.idUsuario}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre}
                  </option>
                ))}
              </CFormSelect>
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="idProducto">Producto</CFormLabel>
              <CFormSelect
                id="idProducto"
                name="idProducto"
                value={filters.idProducto}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </CFormSelect>
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="idTipoPago">Tipo de Pago</CFormLabel>
              <CFormSelect
                id="idTipoPago"
                name="idTipoPago"
                value={filters.idTipoPago}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un tipo de pago</option>
                {tiposPago.map((tipoPago) => (
                  <option key={tipoPago.id} value={tipoPago.id}>
                    {tipoPago.nombre}
                  </option>
                ))}
              </CFormSelect>
            </div>

            <CButton color="primary" onClick={() => generarReporte('excel')} disabled={loading}>
              {loading ? <CSpinner size="sm" /> : 'Generar Excel'}
            </CButton>
            <CButton color="danger" onClick={() => generarReporte('pdf')} className="ml-2" disabled={loading}>
              {loading ? <CSpinner size="sm" /> : 'Generar PDF'}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Tabla de reportes generados */}
      <CCard>
        <CCardHeader>
          <h4>Reportes Generados</h4>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Fecha</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {reportes.map((reporte, index) => (
                <CTableRow key={reporte.id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{new Date(reporte.fecha).toLocaleString()}</CTableDataCell>
                  <CTableDataCell>
                    {reporte.urlPdf && (
                      <CButton color="danger" className="me-2" onClick={() => window.open(reporte.urlPdf, '_blank')}>
                        Ver PDF
                      </CButton>
                    )}
                    {reporte.urlExcel && (
                      <CButton color="primary" onClick={() => window.open(reporte.urlExcel, '_blank')}>
                        Ver Excel
                      </CButton>
                    )}
                    <CButton color="secondary" className="ms-2" onClick={() => eliminarReporte(reporte.id)}>
                      Eliminar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  );
};

export default ReporteVentas;
