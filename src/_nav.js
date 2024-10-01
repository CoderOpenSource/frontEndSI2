import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'MANAGE DATA',
  },
  {
    component: CNavGroup,
    name: 'Manage Usuario',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Manage Usuario',
        to: '/UsuarioList',
      },
      {
        component: CNavItem,
        name: 'Manage Roles',
        to: '/RolList',
      },

    ],
  },
  {
    component: CNavGroup,
    name: 'Manage Products',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Manage Categoria',
        to: '/categorias',
      },
      {
        component: CNavItem,
        name: 'Manage Sub Categoria',
        to: '/Subcategorias',
      },
      {
        component: CNavItem,
        name: 'Manage Producto',
        to: '/Productos',
      },
      {
        component: CNavItem,
        name: 'Manage Color',
        to: '/Colors',
      },
      {
        component: CNavItem,
        name: 'Manage Tamaño',
        to: '/Tamaño',
      },
      {
        component: CNavItem,
        name: 'Manage ProductoDetalle',
        to: '/ProductosDetalle',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Producto Favoritos',
    to: '/ProductoFavorits',
  },
  {
    component: CNavItem,
    name: 'Valoracion',
    to: '/Valoracion',
  },
  {
    component: CNavGroup,
    name: 'Manage Sucursal',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Manage Sucursal',
        to: '/Sucursal',
      },
      {
        component: CNavItem,
        name: 'Manage Inventario',
        to: '/Inventario',
      }
    ],
  },
  {
    component: CNavGroup,
    name: 'Manage Transacciones',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Manage Carrito',
        to: '/Carrito',
        badge: {
          color: 'success',
          text: 'NEW',
        },
      },
      {
        component: CNavItem,
        name: 'Manage CarritoProductoDetalle',
        to: '/CarritoProductoDetalle',
      },
      {
        component: CNavItem,
        name: 'Manage Factura',
        to: '/Factura',
      },
      {
        component: CNavItem,
        name: 'Manage TipoPago',
        to: '/TipoPago',
      },
      {
        component: CNavItem,
        name: 'Manage Transaccion',
        to: '/Transaccion',
      },
      {
        component: CNavItem,
        name: 'Manage ReporteVentas',
        to: '/ReporteVentas',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        component: CNavItem,
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        component: CNavItem,
        name: 'Modal',
        to: '/notifications/modals',
      },
      {
        component: CNavItem,
        name: 'Toasts',
        to: '/notifications/toasts',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Widgets',
    to: '/widgets',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Docs',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
]

export default _nav
