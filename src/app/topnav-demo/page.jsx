'use client'

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Button,
  Paper
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Brightness4 as ThemeIcon,
  Menu as MenuIcon
} from '@mui/icons-material'

// Navigation configuration for dynamic detection
export const navigationConfig = {
  title: 'TopNav Demo',
  path: '/topnav-demo',
  icon: 'TestTube',
  badge: 'Demo',
  section: 'Démonstration',
  description: 'Test page for TopNav component functionality'
};

const TopNavDemo = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          TopNav Component Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Cette page démontre toutes les fonctionnalités du composant TopNav sticky et responsive.
        </Typography>
        <Chip 
          label="Demo Page" 
          color="primary" 
          variant="outlined" 
          sx={{ mr: 1 }}
        />
        <Chip 
          label="TopNav Testing" 
          color="secondary" 
          variant="outlined" 
        />
      </Box>

      <Grid container spacing={3}>
        {/* Features Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Fonctionnalités Implémentées
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Barre de navigation sticky"
                    secondary="64px desktop, 56px mobile avec backdrop blur"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SearchIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Palette de recherche"
                    secondary="Ctrl/Cmd + K pour ouvrir, navigation clavier"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <ThemeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Toggle thème"
                    secondary="System → Light → Dark avec persistance"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Sélecteur de langue"
                    secondary="10 langues avec recherche et persistance"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Menu notifications"
                    secondary="Badge temps réel, groupement par date"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Menu utilisateur"
                    secondary="Profil, paramètres, billing avec badge"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Responsive Behavior */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📱 Comportement Responsive
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <MenuIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="≥1024px - Desktop"
                    secondary="Barre complète avec tous les éléments"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <MenuIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="768-1024px - Tablet"
                    secondary="Recherche max-width ~420px, menu overflow"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <MenuIcon color="error" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="<768px - Mobile"
                    secondary="Logo + icône recherche + 2-3 icônes max"
                  />
                </ListItem>
              </List>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                <strong>Test Responsive:</strong> Redimensionnez votre navigateur pour voir les adaptations automatiques.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* API Integration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔌 Intégration API
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Services mock intégrés avec RTK Query:
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="GET /me"
                    secondary="Données utilisateur actuelles"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="GET /notifications"
                    secondary="Liste des notifications avec filtres"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="PATCH /notifications/mark-all-read"
                    secondary="Marquer toutes comme lues"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="GET /billing/alerts"
                    secondary="Alertes de facturation"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="POST /auth/logout"
                    secondary="Déconnexion utilisateur"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Accessibility */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ♿ Accessibilité
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Contraste 4.5:1"
                    secondary="Respect des standards WCAG"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Cibles tactiles ≥44×44px"
                    secondary="Optimisé pour mobile et tablette"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="ARIA complet"
                    secondary="Labels, rôles, états et propriétés"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Navigation clavier"
                    secondary="Tab, Esc, flèches, Enter"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Testing Instructions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🧪 Instructions de Test
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      1. Test de Recherche
                    </Typography>
                    <Typography variant="body2">
                      • Appuyez sur <strong>Ctrl/Cmd + K</strong><br/>
                      • Tapez pour rechercher<br/>
                      • Utilisez ↑↓ pour naviguer<br/>
                      • Appuyez sur Enter pour sélectionner
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, backgroundColor: 'secondary.light', color: 'secondary.contrastText' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      2. Test des Notifications
                    </Typography>
                    <Typography variant="body2">
                      • Cliquez sur l'icône cloche<br/>
                      • Testez "Mark all as read"<br/>
                      • Cliquez sur une notification<br/>
                      • Vérifiez les badges temps réel
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, backgroundColor: 'success.light', color: 'success.contrastText' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      3. Test Responsive
                    </Typography>
                    <Typography variant="body2">
                      • Redimensionnez la fenêtre<br/>
                      • Testez sur mobile/tablette<br/>
                      • Vérifiez le menu overflow<br/>
                      • Testez le toggle sidebar
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TopNavDemo
