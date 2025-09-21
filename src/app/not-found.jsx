'use client'

import { Box, Container, Typography, Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { Home, ArrowBack } from '@mui/icons-material'

export default function NotFound() {
  const router = useRouter()

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'primary.main' }}>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Page non trouvée
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => router.push('/')}
            size="large"
          >
            Retour à l'accueil
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            size="large"
          >
            Page précédente
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
