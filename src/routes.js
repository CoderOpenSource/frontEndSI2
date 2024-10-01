import React from 'react'
import ProtectedRoute from "src/components/ProtectedRoute";
import SucursalList from "src/views/pages/admin/productos/Surcursal/SucursalList";
import TipoPagoList from "src/views/pages/admin/productos/TipoPago/TipoPagoList";

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

//RUTA DE CATEGORIA

const CategoriaList = React.lazy(() => import('./views/pages/admin/productos/Categoria/CategoriaList'))
// RUTA DE SUBCATEGORIA
const SubCategoriaList = React.lazy(() => import('./views/pages/admin/productos/Sub Categoria/SubcategoriaList'))
// RUTA DE COLOR
const ColorList = React.lazy(() => import('./views/pages/admin/productos/Color/ColorList'))
/// RUTA TAMAÑO
const TamañoList = React.lazy(() => import('./views/pages/admin/productos/Tamaño/TamañoList'))
// RUTA PRODUCTO
const ProductoList = React.lazy(() => import('./views/pages/admin/productos/Producto/ProductoList'))
// RUTA PRODUCTO DETALLE
const ProductoDetalleList = React.lazy(() => import('./views/pages/admin/productos/ProductoDetalle/ProductoDetalleList'))
// RUTA PRODUCTO FAVORITO
const ProductOFavoritoList = React.lazy(() => import('./views/pages/admin/productos/ProductoFavorito/FavoritoList'))
// RUTA SURCURSAL
const SurcursalList = React.lazy(() => import('./views/pages/admin/productos/Surcursal/SucursalList'))
//// RUTA INVENTARIO
const InventarioList = React.lazy(() => import('./views/pages/admin/productos/Inventario/InventarioList'))
// RUTA VALORACION
const ValoracionList = React.lazy(() => import('./views/pages/admin/productos/Valoracion/ValoracionList'))
// RUTA CARRITO
const CarritoList = React.lazy(() => import('./views/pages/admin/productos/Carrito/CarritoList'))
// RUTA CARRITOPRODUCTODETTALLE
const CarritoProductoDetalleList = React.lazy(() => import('./views/pages/admin/productos/CarritoProductoDetalle/CarritoProductoDetalleList'))
// RUTA TIPOPAGO
/// RUTA TRANSACCION
const TransaccionList = React.lazy(() => import('./views/pages/admin/productos/Transaccion/TransaccionList'))
/// RUTA FACTURA
const FacturaList = React.lazy(() => import('./views/pages/admin/productos/Factura/FacturaList'))
/// RUTA REPORTE
const ReporteVentas = React.lazy(() => import('./views/pages/admin/productos/Reporte/ReporteVentas'))
/// RUTA USUARIO

const UsuarioList = React.lazy(() => import('./views/pages/admin/productos/Usuario/UsuarioList'))
// ruta rol
const RolList = React.lazy(() => import('./views/pages/admin/productos/Rol/RolList'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/', exact: true, name: 'Home' },
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: <ProtectedRoute element={Dashboard}/>,
  },
  {
    path: '/UsuarioList',
    name: 'UsuarioList',
    element: <ProtectedRoute element={UsuarioList}/>,
  },
  {
    path: '/RolList',
    name: 'RolList',
    element: <ProtectedRoute element={RolList}/>,
  },
  {
    path: '/categorias',
    name: 'CategoriaList',
    element: <ProtectedRoute element={CategoriaList}/>,
  },
  {
    path: '/Subcategorias',
    name: 'SubcategoriaList',
    element: <ProtectedRoute element={SubCategoriaList}/>,
  },
  {
    path: '/Colors',
    name: 'ColorList',
    element: <ProtectedRoute element={ColorList}/>,
  },
  {
    path: '/Tamaño',
    name: 'TamañoList',
    element: <ProtectedRoute element={TamañoList}/>,
  },
  {
    path: '/Productos',
    name: 'ProductoList',
    element: <ProtectedRoute element={ProductoList}/>,
  },
  {
    path: '/ProductosDetalle',
    name: 'ProductoDetalleList',
    element: <ProtectedRoute element={ProductoDetalleList}/>,
  },
  {
    path: '/ProductoFavorits',
    name: 'ProductoFavoritoList',
    element: <ProtectedRoute element={ProductOFavoritoList}/>,
  },
  {
    path: '/Sucursal',
    name: 'SurcursalList',
    element: <ProtectedRoute element={SucursalList}/>,
  },
  {
    path: '/Inventario',
    name: 'InventarioList',
    element: <ProtectedRoute element={InventarioList}/>,
  },
  {
    path: '/Valoracion',
    name: 'ValoracionList',
    element: <ProtectedRoute element={ValoracionList}/>,
  },
  {
    path: '/Carrito',
    name: 'CarritoList',
    element: <ProtectedRoute element={CarritoList}/>,
  },
  {
    path: '/CarritoProductoDetalle',
    name: 'CarritoProductoDetalleList',
    element: <ProtectedRoute element={CarritoProductoDetalleList}/>,
  },
  {
    path: '/TipoPago',
    name: 'TipoPagoList',
    element: <ProtectedRoute element={TipoPagoList}/>,
  },
  {
    path: '/Transaccion',
    name: 'TransaccionList',
    element: <ProtectedRoute element={TransaccionList}/>,
  },
  {
    path: '/ReporteVentas',
    name: 'ReporteVentas',
    element: <ProtectedRoute element={ReporteVentas}/>,
  },
  {
    path: '/Factura',
    name: 'FacturaList',
    element: <ProtectedRoute element={FacturaList}/>,
  },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
