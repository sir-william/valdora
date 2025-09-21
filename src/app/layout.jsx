'use client'

import { Provider } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import { store } from '../redux-store/store'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

// VALDORA Theme
const valdoraTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7367F0',
      light: '#9E95F5',
      dark: '#5A54CC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6D788D',
      light: '#8792A5',
      dark: '#4C5564',
    },
    success: {
      main: '#28C76F',
      light: '#48DA89',
      dark: '#1F9D57',
    },
    error: {
      main: '#EA5455',
      light: '#EE7677',
      dark: '#CE4040',
    },
    warning: {
      main: '#FF9F43',
      light: '#FFB976',
      dark: '#E08D3C',
    },
    info: {
      main: '#00CFE8',
      light: '#33D9ED',
      dark: '#00A1B5',
    },
    background: {
      default: '#F8F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3A3E49',
      secondary: '#6D788D',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
})

// Metadata moved to head tag in component

const RootLayout = ({ children }) => {
  return (
    <html id='__next' lang='fr' dir='ltr'>
      <head>
        <title>VALDORA - Plateforme SaaS E-commerce</title>
        <meta name="description" content="VALDORA - Plateforme SaaS complète pour la création et gestion de boutiques en ligne avec intelligence artificielle" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <Provider store={store}>
          <ThemeProvider theme={valdoraTheme}>
            <CssBaseline />
            <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
              }}
            >
              {children}
            </Box>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}

export default RootLayout
