'use client'

import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Smartphone as MobileIcon,
  Computer as DesktopIcon,
  Menu as MenuIcon,
  ExpandMore as ExpandIcon
} from '@mui/icons-material'

// Configuration de navigation pour ce composant
export const navigationConfig = {
  label: 'Demo Responsive',
  href: '/responsive-demo',
  icon: 'tabler-device-mobile',
  section: 'Démonstration',
  order: 75,
  enabled: true,
  badge: { label: 'Test', color: 'info' }
};

const ResponsiveDemoPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        🎯 Démonstration Navigation Responsive
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Testez le système de navigation dynamique avec effet toggle et responsive design
      </Typography>

      <Grid container spacing={3}>
        {/* Fonctionnalités */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                ✨ Fonctionnalités Implémentées
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Navigation Dynamique"
                    secondary="Détection automatique des composants avec navigationConfig"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Sidebar Responsive"
                    secondary="Adaptation automatique mobile/desktop"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Effet Toggle"
                    secondary="Élargir/rétrécir avec animations fluides"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Hamburger Menu"
                    secondary="Menu mobile avec overlay"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Sub-menus"
                    secondary="Navigation hiérarchique avec expansion"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Instructions de test */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="secondary">
                🧪 Instructions de Test
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Cette page a été automatiquement ajoutée au menu grâce au système de détection dynamique !
                </Typography>
              </Alert>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  <DesktopIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Test Desktop :
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Cliquez sur le bouton fléché dans le header du sidebar pour rétrécir/élargir
                  <br />
                  • Testez l'expansion des sous-menus
                  <br />
                  • Vérifiez les animations et tooltips
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  <MobileIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Test Mobile :
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Réduisez la fenêtre ou utilisez les outils développeur
                  <br />
                  • Cliquez sur le hamburger menu (☰) dans la barre du haut
                  <br />
                  • Testez la navigation et la fermeture automatique
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Auto-détecté" color="success" size="small" />
                <Chip label="Responsive" color="primary" size="small" />
                <Chip label="Animations" color="secondary" size="small" />
                <Chip label="Toggle Effect" color="info" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statut du système */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎉 Système de Navigation Dynamique Responsive - ACTIF
              </Typography>
              <Typography variant="body1">
                Le système détecte automatiquement tous les composants avec <code>navigationConfig</code> 
                et les affiche dans le menu responsive avec effet toggle. 
                Chaque nouveau composant ajouté apparaîtra automatiquement dans la navigation !
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ResponsiveDemoPage
