import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  DatePicker,
} from '@mui/material'
import {
  ShoppingCart,
  Visibility,
  Edit,
  LocalShipping,
  Payment,
  Cancel,
  CheckCircle,
  Schedule,
  TrendingUp,
  Euro,
  Person,
  MoreVert,
  FilterList,
  GetApp,
  Refresh,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useGetOrdersQuery, useUpdateOrderMutation } from '../../../redux-store/services/valdoraApi'
import DataTable from '../../../@core/components/data/DataTable'

// Order status configuration
const orderStatusConfig = {
  pending: {
    label: 'En attente',
    color: 'warning',
    icon: Schedule,
    description: 'Commande en attente de traitement'
  },
  processing: {
    label: 'En traitement',
    color: 'info',
    icon: ShoppingCart,
    description: 'Commande en cours de préparation'
  },
  shipped: {
    label: 'Expédiée',
    color: 'primary',
    icon: LocalShipping,
    description: 'Commande expédiée'
  },
  delivered: {
    label: 'Livrée',
    color: 'success',
    icon: CheckCircle,
    description: 'Commande livrée avec succès'
  },
  cancelled: {
    label: 'Annulée',
    color: 'error',
    icon: Cancel,
    description: 'Commande annulée'
  },
  refunded: {
    label: 'Remboursée',
    color: 'default',
    icon: Payment,
    description: 'Commande remboursée'
  }
}

// Payment status configuration
const paymentStatusConfig = {
  pending: { label: 'En attente', color: 'warning' },
  paid: { label: 'Payée', color: 'success' },
  failed: { label: 'Échec', color: 'error' },
  refunded: { label: 'Remboursée', color: 'default' },
  partial: { label: 'Partiel', color: 'info' }
}

const OrderList = () => {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: null, end: null })
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  // API calls
  const {
    data: ordersData,
    isLoading,
    error,
    refetch
  } = useGetOrdersQuery({
    page: page + 1,
    limit: rowsPerPage,
    order: { [orderBy]: order },
    ...(searchValue && { search: searchValue }),
    ...(statusFilter && { status: statusFilter }),
    ...(paymentFilter && { paymentStatus: paymentFilter }),
    ...(dateRange.start && { startDate: dateRange.start }),
    ...(dateRange.end && { endDate: dateRange.end }),
  })

  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation()

  // Memoized data
  const orders = useMemo(() => {
    return ordersData?.['hydra:member'] || []
  }, [ordersData])

  const totalCount = useMemo(() => {
    return ordersData?.['hydra:totalItems'] || 0
  }, [ordersData])

  // Calculate stats
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const processingOrders = orders.filter(o => o.status === 'processing').length
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length

    return {
      totalRevenue,
      pendingOrders,
      processingOrders,
      deliveredOrders
    }
  }, [orders])

  // Table columns
  const columns = [
    {
      field: 'orderNumber',
      headerName: 'N° Commande',
      minWidth: 120,
      renderCell: ({ value, row }) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            #{value || row.id}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(row.createdAt).toLocaleDateString('fr-FR')}
          </Typography>
        </Box>
      )
    },
    {
      field: 'customer',
      headerName: 'Client',
      minWidth: 200,
      renderCell: ({ value, row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {value?.name || row.customerName || 'Client inconnu'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {value?.email || row.customerEmail || '-'}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Statut',
      minWidth: 130,
      renderCell: ({ value }) => {
        const config = orderStatusConfig[value] || orderStatusConfig.pending
        const IconComponent = config.icon
        
        return (
          <Tooltip title={config.description}>
            <Chip
              icon={<IconComponent />}
              label={config.label}
              color={config.color}
              size="small"
              variant="outlined"
            />
          </Tooltip>
        )
      }
    },
    {
      field: 'paymentStatus',
      headerName: 'Paiement',
      minWidth: 120,
      renderCell: ({ value }) => {
        const config = paymentStatusConfig[value] || paymentStatusConfig.pending
        
        return (
          <Chip
            label={config.label}
            color={config.color}
            size="small"
          />
        )
      }
    },
    {
      field: 'total',
      headerName: 'Total',
      type: 'currency',
      minWidth: 100,
      align: 'right',
      renderCell: ({ value }) => (
        <Typography variant="body2" fontWeight="medium">
          {value ? `${value.toLocaleString('fr-FR')} €` : '-'}
        </Typography>
      )
    },
    {
      field: 'itemsCount',
      headerName: 'Articles',
      minWidth: 80,
      align: 'center',
      renderCell: ({ value, row }) => (
        <Chip
          label={value || row.items?.length || 0}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'shippingMethod',
      headerName: 'Livraison',
      minWidth: 120,
      renderCell: ({ value }) => (
        <Typography variant="body2">
          {value || 'Standard'}
        </Typography>
      )
    }
  ]

  // Actions
  const handleView = (order) => {
    router.push(`/orders/${order.id}`)
  }

  const handleEdit = (order) => {
    router.push(`/orders/${order.id}/edit`)
  }

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setUpdateDialogOpen(true)
  }

  const handleConfirmStatusUpdate = async () => {
    if (selectedOrder && newStatus) {
      try {
        await updateOrder({
          id: selectedOrder.id,
          status: newStatus
        }).unwrap()
        setUpdateDialogOpen(false)
        setSelectedOrder(null)
        refetch()
      } catch (error) {
        console.error('Update error:', error)
      }
    }
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export orders')
  }

  // Row actions
  const rowActions = [
    {
      label: 'Voir détails',
      icon: <Visibility />,
      onClick: handleView
    },
    {
      label: 'Modifier',
      icon: <Edit />,
      onClick: handleEdit
    },
    {
      label: 'Changer statut',
      icon: <LocalShipping />,
      onClick: handleUpdateStatus
    }
  ]

  // Table actions
  const tableActions = [
    {
      label: 'Actualiser',
      icon: <Refresh />,
      onClick: () => refetch(),
      tooltip: 'Actualiser la liste'
    },
    {
      label: 'Exporter',
      icon: <GetApp />,
      onClick: handleExport,
      tooltip: 'Exporter les commandes'
    }
  ]

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Réessayer
            </Button>
          }
        >
          Erreur lors du chargement des commandes : {error.message}
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestion des commandes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suivez et gérez toutes vos commandes en temps réel
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => {/* TODO: Open filters */}}
        >
          Filtres avancés
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText'
                    }}
                  >
                    <Euro />
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      {stats.totalRevenue.toLocaleString('fr-FR')} €
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chiffre d'affaires
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'warning.light',
                      color: 'warning.contrastText'
                    }}
                  >
                    <Schedule />
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      {stats.pendingOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      En attente
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'info.light',
                      color: 'info.contrastText'
                    }}
                  >
                    <ShoppingCart />
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      {stats.processingOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      En traitement
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'success.light',
                      color: 'success.contrastText'
                    }}
                  >
                    <CheckCircle />
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      {stats.deliveredOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Livrées
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <DataTable
            data={orders}
            columns={columns}
            loading={isLoading}
            error={error}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={totalCount}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            orderBy={orderBy}
            order={order}
            onSort={(field, direction) => {
              setOrderBy(field)
              setOrder(direction)
            }}
            searchable
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Rechercher par numéro, client..."
            rowActions={rowActions}
            actions={tableActions}
            onRowClick={handleView}
            emptyMessage="Aucune commande trouvée"
          />
        </Card>
      </motion.div>

      {/* Status Update Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Modifier le statut de la commande
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Commande #{selectedOrder?.orderNumber || selectedOrder?.id}
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel>Nouveau statut</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Nouveau statut"
            >
              {Object.entries(orderStatusConfig).map(([key, config]) => (
                <MenuItem key={key} value={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <config.icon />
                    {config.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setUpdateDialogOpen(false)}
            disabled={isUpdating}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirmStatusUpdate}
            disabled={isUpdating || !newStatus}
            variant="contained"
          >
            {isUpdating ? 'Mise à jour...' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default OrderList
