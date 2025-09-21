import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  CircularProgress,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { loginStart, loginSuccess, loginFailure } from '../../../redux-store/slices/authSlice'

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  tenant: z.string().optional(),
})

const LoginForm = ({ onSuccess, redirectTo = '/dashboard' }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      tenant: '',
    },
  })

  const handleLogin = async (data) => {
    try {
      setIsLoading(true)
      setError('')
      dispatch(loginStart())

      // Simulate API call - replace with actual authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Identifiants invalides')
      }

      const result = await response.json()
      
      dispatch(loginSuccess({
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken,
        tenant: result.tenant,
        permissions: result.permissions,
        roles: result.roles,
      }))

      if (onSuccess) {
        onSuccess(result)
      } else {
        router.push(redirectTo)
      }
    } catch (err) {
      const errorMessage = err.message || 'Une erreur est survenue lors de la connexion'
      setError(errorMessage)
      dispatch(loginFailure(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 8,
          boxShadow: (theme) => theme.shadows[10],
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Connexion
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connectez-vous à votre compte VALDORA
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit(handleLogin)}>
            {/* Email Field */}
            <TextField
              {...register('email')}
              fullWidth
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Password Field */}
            <TextField
              {...register('password')}
              fullWidth
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Tenant Field (Optional) */}
            <TextField
              {...register('tenant')}
              fullWidth
              label="Tenant (Optionnel)"
              error={!!errors.tenant}
              helperText={errors.tenant?.message || 'Laissez vide pour le tenant par défaut'}
              disabled={isLoading}
              sx={{ mb: 3 }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <LoginIcon />
                )
              }
              sx={{
                py: 1.5,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>

            {/* Divider */}
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ou
              </Typography>
            </Divider>

            {/* Links */}
            <Box textAlign="center">
              <Link
                href="/auth/forgot-password"
                variant="body2"
                color="primary"
                sx={{ textDecoration: 'none' }}
              >
                Mot de passe oublié ?
              </Link>
            </Box>

            <Box textAlign="center" mt={2}>
              <Typography variant="body2" color="text.secondary">
                Pas encore de compte ?{' '}
                <Link
                  href="/auth/register"
                  color="primary"
                  sx={{ textDecoration: 'none' }}
                >
                  S'inscrire
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default LoginForm
