import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  IconButton,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
} from '@mui/material'
import { Logout as LogoutIcon, ExitToApp } from '@mui/icons-material'
import { logout } from '../../../redux-store/slices/authSlice'
import { selectUser } from '../../../redux-store/slices/authSlice'

const LogoutButton = ({ 
  variant = 'button', // 'button' | 'icon' | 'menuItem'
  showConfirmDialog = true,
  onLogoutSuccess,
  redirectTo = '/auth/login',
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const handleLogoutClick = () => {
    if (showConfirmDialog) {
      setShowDialog(true)
    } else {
      handleLogout()
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      
      // Call logout API if needed
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (apiError) {
        // Continue with logout even if API call fails
        console.warn('Logout API call failed:', apiError)
      }

      // Clear Redux state
      dispatch(logout())

      // Clear any stored tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        sessionStorage.clear()
      }

      setShowDialog(false)

      if (onLogoutSuccess) {
        onLogoutSuccess()
      } else {
        router.push(redirectTo)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDialogClose = () => {
    setShowDialog(false)
  }

  // Render different variants
  const renderButton = () => {
    switch (variant) {
      case 'icon':
        return (
          <IconButton
            onClick={handleLogoutClick}
            disabled={isLoading}
            color="inherit"
            {...props}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <LogoutIcon />
            )}
          </IconButton>
        )

      case 'menuItem':
        return (
          <MenuItem
            onClick={handleLogoutClick}
            disabled={isLoading}
            {...props}
          >
            {isLoading ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : (
              <ExitToApp sx={{ mr: 1 }} />
            )}
            Déconnexion
          </MenuItem>
        )

      default:
        return (
          <Button
            onClick={handleLogoutClick}
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <LogoutIcon />
              )
            }
            {...props}
          >
            {isLoading ? 'Déconnexion...' : 'Déconnexion'}
          </Button>
        )
    }
  }

  return (
    <>
      {renderButton()}

      {/* Confirmation Dialog */}
      <Dialog
        open={showDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirmer la déconnexion
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir vous déconnecter ?
            {user?.email && (
              <>
                <br />
                <strong>Compte :</strong> {user.email}
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleLogout}
            disabled={isLoading}
            variant="contained"
            color="error"
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <LogoutIcon />
              )
            }
          >
            {isLoading ? 'Déconnexion...' : 'Déconnexion'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LogoutButton
