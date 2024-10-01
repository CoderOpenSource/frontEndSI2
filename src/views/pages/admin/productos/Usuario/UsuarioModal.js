import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CForm,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import axios from 'axios'

const UsuarioModal = ({
                        visible,
                        setVisible,
                        usuarioToUpdate = null,
                        refreshUsuarioList,
                        showToast,
                      }) => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [estado, setEstado] = useState('ACTIVO')
  const [roles, setRoles] = useState([]) // Estado para almacenar los roles
  const [rolId, setRolId] = useState('') // Estado para el rol seleccionado

  // Obtiene el token almacenado (puedes usar localStorage o sessionStorage)
  const token = localStorage.getItem('token') || ''

  // Cargar roles disponibles al montar el componente
  useEffect(() => {
    axios
      .get('http://157.230.227.216/api/roles', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
        },
      })
      .then((response) => {
        setRoles(response.data)
      })
      .catch((error) => {
        console.error('Error al cargar los roles:', error)
      })
  }, [])

  useEffect(() => {
    if (usuarioToUpdate) {
      setNombre(usuarioToUpdate.nombre)
      setEmail(usuarioToUpdate.email)
      setEstado(usuarioToUpdate.estado)
      setRolId(usuarioToUpdate.rol.id) // Establecer el rol actual del usuario
      setPassword('') // Restablecer la contraseña si se está actualizando
    } else {
      setNombre('')
      setEmail('')
      setPassword('')
      setEstado('ACTIVO')
      setRolId('') // Restablecer el rol seleccionado
    }
  }, [usuarioToUpdate])

  const handleSave = async () => {
    const usuarioData = {
      nombre,
      email,
      estado,
      rol: { id: rolId }, // Enviar el rol seleccionado
    }

    if (password) {
      usuarioData.password = password // Solo enviar la contraseña si está presente
    }

    try {
      const request = usuarioToUpdate
        ? axios.put(`http://157.230.227.216/api/usuarios/${usuarioToUpdate.id}`, usuarioData, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
          },
        })
        : axios.post('http://157.230.227.216/api/usuarios', usuarioData, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en las cabeceras
          },
        })

      await request
      setVisible(false)
      refreshUsuarioList()
      showToast(usuarioToUpdate ? 'Usuario actualizado' : 'Usuario creado', 'success')
    } catch (error) {
      console.error('Error al guardar usuario:', error)
      showToast('Error al guardar usuario', 'danger')
    }
  }

  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>{usuarioToUpdate ? 'Actualizar Usuario' : 'Crear Usuario'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput
            type="text"
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa el nombre"
          />
          <CFormInput
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa el correo electrónico"
          />
          <CFormInput
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa la contraseña"
          />
          <CFormSelect label="Estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </CFormSelect>

          {/* Select para el rol */}
          <CFormSelect label="Rol" value={rolId} onChange={(e) => setRolId(e.target.value)}>
            <option value="">Selecciona un rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </CFormSelect>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSave}>
          {usuarioToUpdate ? 'Actualizar Usuario' : 'Guardar Usuario'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

UsuarioModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  usuarioToUpdate: PropTypes.object,
  refreshUsuarioList: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
}

export default UsuarioModal
