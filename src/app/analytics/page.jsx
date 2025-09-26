'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Store,
  ShoppingCart,
  Euro,
  Analytics,
  Refresh,
  Download,
  FilterList,
  DateRange,
  Visibility,
  People,
  Speed,
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadialBarChart,
  RadialBar,
} from 'recharts'
import { motion } from 'framer-motion'
import { mockService } from '../../@core/services/mockService'

const COLORS = ['#7367F0', '#28C76F', '#FF9F43', '#EA5455', '#00CFE8', '#9C88FF']

const AnalyticsPage = () => {
  const [tabValue, setTabValue] = useState(0)
  const [timeRange, setTimeRange] = useState('6months')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  // Données mock étendues pour les analytics
  const extendedAnalytics = {
    overview: {
      totalStores: 12,
      activeStores: 8,
      totalOrders: 156,
      totalRevenue: 45230.50,
      monthlyGrowth: 15.3,
      conversionRate: 3.2,
      avgOrderValue: 289.94,
      customerRetention: 68.5,
      pageViews: 12450,
      uniqueVisitors: 3280,
    },
    revenueData: [
      { month: 'Jan', revenue: 12500, orders: 45, visitors: 2100 },
      { month: 'Fév', revenue: 15200, orders: 52, visitors: 2350 },
      { month: 'Mar', revenue: 18900, orders: 67, visitors: 2800 },
      { month: 'Avr', revenue: 22100, orders: 78, visitors: 3100 },
      { month: 'Mai', revenue: 19800, orders: 71, visitors: 2950 },
      { month: 'Juin', revenue: 25400, orders: 89, visitors: 3280 },
    ],
    trafficSources: [
      { source: 'Recherche Organique', visitors: 1640, percentage: 50 },
      { source: 'Réseaux Sociaux', visitors: 656, percentage: 20 },
      { source: 'Publicité Payante', visitors: 492, percentage: 15 },
      { source: 'Email Marketing', visitors: 328, percentage: 10 },
      { source: 'Référencement', visitors: 164, percentage: 5 },
    ],
    topProducts: [
      { name: 'Smartphone Pro Max', sales: 89, revenue: 15680, category: 'Electronics' },
      { name: 'Chaussures Running Elite', sales: 67, revenue: 8040, category: 'Sports' },
      { name: 'Robe Élégante Noir', sales: 52, revenue: 6240, category: 'Fashion' },
      { name: 'Casque Audio Premium', sales: 43, revenue: 5160, category: 'Electronics' },
      { name: 'Sac à Main Cuir', sales: 38, revenue: 4560, category: 'Fashion' },
    ],
    customerSegments: [
      { segment: 'Nouveaux clients', count: 45, percentage: 28.8, value: 12500 },
      { segment: 'Clients fidèles', count: 67, percentage: 42.9, value: 22100 },
      { segment: 'Clients VIP', count: 23, percentage: 14.7, value: 15600 },
      { segment: 'Clients inactifs', count: 21, percentage: 13.5, value: 3200 },
    ],
    performanceMetrics: [
      { metric: 'Temps de chargement', value: 2.3, unit: 's', status: 'good' },
      { metric: 'Taux de rebond', value: 32.5, unit: '%', status: 'excellent' },
      { metric: 'Pages par session', value: 4.2, unit: '', status: 'good' },
      { metric: 'Durée de session', value: 5.8, unit: 'min', status: 'excellent' },
    ]
  }

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Simuler le chargement des données
      setTimeout(() => {
        setAnalytics(extendedAnalytics)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error)
      setLoading(false)
    }
  }

  const MetricCard = ({ title, value, change, icon: Icon, color = 'primary', suffix = '' }) => {
    const isPositive = change > 0
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
      >
        <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48 }}>
                <Icon />
              </Avatar>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                  {value}{suffix}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {isPositive ? (
                    <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                  ) : (
                    <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{ color: isPositive ? 'success.main' : 'error.main', fontWeight: 600 }}
                  >
                    {isPositive ? '+' : ''}{change}%
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const RevenueChart = () => (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={analytics?.revenueData || []}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#666" />
        <YAxis yAxisId="left" stroke="#666" />
        <YAxis yAxisId="right" orientation="right" stroke="#666" />
        <RechartsTooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="revenue" fill="#7367F0" name="Revenus (€)" />
        <Line yAxisId="right" type="monotone" dataKey="visitors" stroke="#28C76F" strokeWidth={3} name="Visiteurs" />
      </ComposedChart>
    </ResponsiveContainer>
  )

  const TrafficSourcesChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={analytics?.trafficSources || []}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ source, percentage }) => `${source} (${percentage}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="visitors"
        >
          {(analytics?.trafficSources || []).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <RechartsTooltip />
      </PieChart>
    </ResponsiveContainer>
  )

  const CustomerSegmentsChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={analytics?.customerSegments || []}>
        <RadialBar dataKey="percentage" cornerRadius={10} fill="#7367F0" />
        <RechartsTooltip />
      </RadialBarChart>
    </ResponsiveContainer>
  )

  const renderOverviewTab = () => (
    <Box>
      {/* Métriques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Revenus Totaux"
            value={analytics?.overview.totalRevenue?.toLocaleString() || 0}
            change={analytics?.overview.monthlyGrowth || 0}
            icon={Euro}
            color="success"
            suffix="€"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Commandes"
            value={analytics?.overview.totalOrders || 0}
            change={8.2}
            icon={ShoppingCart}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Visiteurs Uniques"
            value={analytics?.overview.uniqueVisitors?.toLocaleString() || 0}
            change={12.5}
            icon={People}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Taux de Conversion"
            value={analytics?.overview.conversionRate || 0}
            change={-2.1}
            icon={Analytics}
            color="warning"
            suffix="%"
          />
        </Grid>
      </Grid>

      {/* Graphique principal */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Évolution des Revenus et Visiteurs
            </Typography>
            <Chip label="6 derniers mois" size="small" variant="outlined" />
          </Box>
          <RevenueChart />
        </CardContent>
      </Card>

      {/* Métriques de performance */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Métriques de Performance
          </Typography>
          <Grid container spacing={3}>
            {analytics?.performanceMetrics?.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {metric.value}{metric.unit}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {metric.metric}
                  </Typography>
                  <Chip
                    label={metric.status}
                    size="small"
                    color={metric.status === 'excellent' ? 'success' : 'primary'}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )

  const renderTrafficTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Sources de Trafic
            </Typography>
            <TrafficSourcesChart />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Détails des Sources
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Source</TableCell>
                  <TableCell align="right">Visiteurs</TableCell>
                  <TableCell align="right">Pourcentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics?.trafficSources?.map((source, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: COLORS[index % COLORS.length],
                          }}
                        />
                        {source.source}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{source.visitors.toLocaleString()}</TableCell>
                    <TableCell align="right">{source.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderCustomersTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Segments de Clientèle
            </Typography>
            <CustomerSegmentsChart />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Analyse des Segments
            </Typography>
            {analytics?.customerSegments?.map((segment, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {segment.segment}
                  </Typography>
                  <Typography variant="body2">
                    {segment.count} clients ({segment.percentage}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={segment.percentage}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Valeur: {segment.value.toLocaleString()}€
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderProductsTab = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Top Produits
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produit</TableCell>
                <TableCell align="right">Ventes</TableCell>
                <TableCell align="right">Revenus</TableCell>
                <TableCell align="right">Catégorie</TableCell>
                <TableCell align="right">Performance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics?.topProducts?.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: COLORS[index % COLORS.length],
                          fontSize: '0.875rem',
                        }}
                      >
                        {product.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Chip label={product.sales} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {product.revenue.toLocaleString()}€
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip label={product.category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <LinearProgress
                      variant="determinate"
                      value={(product.revenue / analytics.topProducts[0].revenue) * 100}
                      sx={{ width: 60, height: 6, borderRadius: 3 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Analytics Avancées
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analyse détaillée des performances de votre plateforme VALDORA
          </Typography>
        </motion.div>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Période</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Période"
            >
              <MenuItem value="7days">7 jours</MenuItem>
              <MenuItem value="30days">30 jours</MenuItem>
              <MenuItem value="3months">3 mois</MenuItem>
              <MenuItem value="6months">6 mois</MenuItem>
              <MenuItem value="1year">1 an</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Actualiser">
            <IconButton onClick={loadAnalytics} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Exporter">
            <IconButton>
              <Download />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Vue d'ensemble" />
          <Tab label="Trafic" />
          <Tab label="Clients" />
          <Tab label="Produits" />
        </Tabs>
      </Card>

      {/* Content */}
      <motion.div
        key={tabValue}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {tabValue === 0 && renderOverviewTab()}
        {tabValue === 1 && renderTrafficTab()}
        {tabValue === 2 && renderCustomersTab()}
        {tabValue === 3 && renderProductsTab()}
      </motion.div>
    </Container>
  )
}

export default AnalyticsPage

// Configuration pour la navigation automatique
export const navigationConfig = {
  label: 'Analytics',
  icon: 'tabler-chart-line',
  section: 'Analytics & Reporting',
  order: 25,
  enabled: true,
  permissions: ['user', 'admin'],
  description: 'Tableaux de bord et analyses avancées avec Recharts'
}
