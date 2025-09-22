'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  MoreVert,
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
} from 'recharts'
import { motion } from 'framer-motion'
import { mockService } from '../../@core/services/mockService'
import { config, logger } from '../../@core/utils/config'

// Couleurs pour les graphiques
const COLORS = ['#7367F0', '#28C76F', '#FF9F43', '#EA5455', '#00CFE8']

const MetricCard = ({ title, value, change, icon: Icon, color = 'primary', loading = false }) => {
  const isPositive = change > 0
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card
        sx={{
          height: '100%',
          background: 'linear-gradient(135deg, rgba(115, 103, 240, 0.1) 0%, rgba(115, 103, 240, 0.05) 100%)',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(115, 103, 240, 0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: `${color}.main`,
                width: 48,
                height: 48,
              }}
            >
              <Icon />
            </Avatar>
            <IconButton size="small">
              <MoreVert />
            </IconButton>
          </Box>
          
          <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
            {loading ? (
              <LinearProgress sx={{ width: 80, height: 8, borderRadius: 4 }} />
            ) : (
              value
            )}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isPositive ? (
              <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
            ) : (
              <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
            )}
            <Typography
              variant="caption"
              sx={{
                color: isPositive ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}
            >
              {isPositive ? '+' : ''}{change}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              vs mois dernier
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const RevenueChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7367F0" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#7367F0" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#666" />
        <YAxis stroke="#666" />
        <RechartsTooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#7367F0"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const OrdersChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) => `${name} ${percentage}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <RechartsTooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

const TopStoresTable = ({ stores, loading }) => {
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        {[...Array(5)].map((_, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Boutique</TableCell>
            <TableCell align="right">Revenus</TableCell>
            <TableCell align="right">Commandes</TableCell>
            <TableCell align="right">Performance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stores.map((store, index) => (
            <TableRow
              key={store.name}
              sx={{
                '&:hover': { backgroundColor: 'action.hover' },
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
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
                    {store.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {store.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {store.revenue.toLocaleString()}€
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={store.orders}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  <LinearProgress
                    variant="determinate"
                    value={(store.revenue / stores[0].revenue) * 100}
                    sx={{ width: 60, height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {Math.round((store.revenue / stores[0].revenue) * 100)}%
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const DashboardAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      logger.info('Fetching analytics data')
      const response = await mockService.getAnalytics()
      
      if (response && response.success) {
        setAnalytics(response.data)
        logger.info('Analytics data loaded successfully')
      } else {
        throw new Error('Failed to fetch analytics data')
      }
    } catch (err) {
      logger.error('Error fetching analytics:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleRefresh = () => {
    fetchAnalytics()
  }

  if (error && !config.mocks.enabled) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Erreur de chargement des analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Activez les mocks dans .env.local pour voir les données de test
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Dashboard Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Vue d'ensemble de vos performances VALDORA
          </Typography>
        </motion.div>
        
        <Tooltip title="Actualiser les données">
          <IconButton
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Boutiques Totales"
            value={analytics?.overview.totalStores || 0}
            change={12.5}
            icon={Store}
            color="primary"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Commandes"
            value={analytics?.overview.totalOrders || 0}
            change={8.2}
            icon={ShoppingCart}
            color="info"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Revenus"
            value={`${analytics?.overview.totalRevenue?.toLocaleString() || 0}€`}
            change={analytics?.overview.monthlyGrowth || 0}
            icon={Euro}
            color="success"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Taux de Conversion"
            value={`${analytics?.overview.conversionRate || 0}%`}
            change={-2.1}
            icon={Analytics}
            color="warning"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Évolution des Revenus
                  </Typography>
                  <Chip label="6 derniers mois" size="small" variant="outlined" />
                </Box>
                <RevenueChart data={analytics?.revenueData || []} loading={loading} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Commandes par Statut
                </Typography>
                <OrdersChart data={analytics?.ordersByStatus || []} loading={loading} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Top Stores Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Top Boutiques
            </Typography>
            <TopStoresTable stores={analytics?.topStores || []} loading={loading} />
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  )
}

export default DashboardAnalytics
