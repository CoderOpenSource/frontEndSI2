import React from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')

  // Verifica si el token está presente y si el rol es 'ADMIN'
  if (!token || userRole !== "ADMIN") {
    return <Navigate to="/login" />
  }

  // Si está autenticado y tiene el rol correcto, renderiza el componente solicitado
  return <Component {...rest} />
}

// Validar las propiedades que se pasan al componente
ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired, // El componente que se debe renderizar
}

export default ProtectedRoute
