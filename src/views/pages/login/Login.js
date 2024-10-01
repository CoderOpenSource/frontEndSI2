import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToastClose,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastColor, setToastColor] = useState('primary')
  const [autohide, setAutohide] = useState(true)
  const [loginAttempts, setLoginAttempts] = useState(0) // Contador de intentos fallidos
  const [lockoutEndTime, setLockoutEndTime] = useState(null) // Tiempo de bloqueo en formato timestamp

  const navigate = useNavigate()

  // Cargar los intentos fallidos y tiempo de bloqueo desde localStorage
  useEffect(() => {
    const storedAttempts = localStorage.getItem('loginAttempts')
    const storedLockoutEndTime = localStorage.getItem('lockoutEndTime')

    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts, 10))
    }
    if (storedLockoutEndTime) {
      setLockoutEndTime(parseInt(storedLockoutEndTime, 10))
    }
  }, [])

  // Guardar los intentos fallidos y tiempo de bloqueo en localStorage
  useEffect(() => {
    if (loginAttempts > 0) {
      localStorage.setItem('loginAttempts', loginAttempts)
    }
    if (lockoutEndTime) {
      localStorage.setItem('lockoutEndTime', lockoutEndTime)
    }
  }, [loginAttempts, lockoutEndTime])

  // Función para verificar si el bloqueo está activo
  const isLockedOut = () => {
    if (!lockoutEndTime) return false
    const now = new Date().getTime()
    return now < lockoutEndTime
  }

  // Función para obtener el tiempo restante de bloqueo en minutos
  const getRemainingLockoutTime = () => {
    if (!lockoutEndTime) return 0
    const now = new Date().getTime()
    return Math.max(0, Math.ceil((lockoutEndTime - now) / 1000 / 60))
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    // Verificar si el usuario está bloqueado
    if (isLockedOut()) {
      const remainingTime = getRemainingLockoutTime()
      setToastMessage(`Too many failed attempts. Please try again in ${remainingTime} minutes.`)
      setToastColor('danger')
      setAutohide(false)
      setShowToast(true)
      return
    }

    const loginData = {
      username: username,
      password: password,
    }

    try {
      const response = await fetch('http://157.230.227.216/authenticate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Login exitoso', data)

        if (data.rol === 'ADMIN') {
          localStorage.setItem('token', data.token)
          localStorage.setItem('role', data.rol)
          localStorage.setItem('userId', data.id)

          setToastMessage('Logged in succeed')
          setToastColor('success')
          setAutohide(true)
          setShowToast(true)

          // Reiniciar el contador de intentos fallidos
          setLoginAttempts(0)

          setTimeout(() => {
            navigate('/dashboard')
          }, 1000)
        } else {
          setToastMessage('Error: Only admin users can access the dashboard')
          setToastColor('danger')
          setAutohide(false)
          setShowToast(true)
        }
      } else {
        setToastMessage('Error: Invalid email or password')
        setToastColor('danger')
        setAutohide(false)
        setShowToast(true)

        // Incrementar los intentos fallidos
        setLoginAttempts((prev) => prev + 1)

        // Si alcanza 3 intentos fallidos, bloquear el inicio de sesión por 5 minutos
        if (loginAttempts + 1 >= 3) {
          const lockoutTime = new Date().getTime() + 5 * 60 * 1000 // Bloqueo por 5 minutos
          setLockoutEndTime(lockoutTime)
          setToastMessage('Too many failed attempts. Please try again in 5 minutes.')
          setToastColor('danger')
          setAutohide(false)
          setShowToast(true)
        }
      }
    } catch (error) {
      setToastMessage('Network Error: Please try again later')
      setToastColor('danger')
      setAutohide(false)
      setShowToast(true)
    }
  }

  // Aquí especificamos la URL de la imagen de fondo
  const backgroundImage = "https://i.blogs.es/9b7676/tienda-de-ropa-amazon-2/650_1200.jpeg"

  return (
    <div className="login-container" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>

      {/* Toast Notification */}
      {showToast && (
        <CToast
          autohide={autohide}
          visible={true}
          color={toastColor}
          className="position-fixed bottom-0 end-0 p-3"
        >
          {!autohide && <CToastClose className="float-end" onClick={() => setShowToast(false)} />}
          <CToastBody className="text-white">{toastMessage}</CToastBody>
        </CToast>
      )}
    </div>
  )
}

export default Login
