'use client'

import { useState, useEffect } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Badge,
  Box,
  Button,
  Divider,
  Avatar,
  Chip
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  MarkEmailRead as MarkReadIcon,
  Visibility as ViewAllIcon
} from '@mui/icons-material'

// Mock notifications data (will be replaced with API calls)
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New tenant registered',
    body: 'TechCorp has successfully registered and is awaiting approval.',
    type: 'info',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    url: '/admin/tenants/1'
  },
  {
    id: 2,
    title: 'Payment received',
    body: 'Monthly subscription payment of $99 received from DataFlow Inc.',
    type: 'success',
    read: false,
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    url: '/billing/payments'
  },
  {
    id: 3,
    title: 'System maintenance',
    body: 'Scheduled maintenance will begin at 2:00 AM UTC tonight.',
    type: 'warning',
    read: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 4,
    title: 'API rate limit exceeded',
    body: 'Client "MobileApp" has exceeded the API rate limit.',
    type: 'error',
    read: false,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    url: '/admin/api-logs'
  },
  {
    id: 5,
    title: 'New feature available',
    body: 'Advanced analytics dashboard is now available for all users.',
    type: 'info',
    read: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    url: '/features/analytics'
  }
]

const NotificationsMenu = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main', fontSize: 16 }} />
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main', fontSize: 16 }} />
      default:
        return <InfoIcon sx={{ color: 'info.main', fontSize: 16 }} />
    }
  }

  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)

    // Telemetry
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'nav.notifications.opened', {
        unread_count: unreadCount
      })
    }
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Mark all as read
  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )

    // Telemetry
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'nav.notifications.mark_all_read', {
        count: unreadCount
      })
    }

    // Here you would make an API call to mark all as read
    // await markAllNotificationsRead()
  }

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )

    // Navigate to URL if provided
    if (notification.url) {
      window.location.href = notification.url
    }

    handleMenuClose()
  }

  // Simulate real-time updates (in real app, this would be WebSocket/SSE)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving a new notification occasionally
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const newNotification = {
          id: Date.now(),
          title: 'New activity',
          body: 'Something interesting happened in your application.',
          type: 'info',
          read: false,
          timestamp: new Date(),
          url: '/dashboard'
        }
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]) // Keep only 10 most recent
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = notification.timestamp.toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(notification)
    return groups
  }, {})

  return (
    <>
      <Tooltip title={`${unreadCount} unread notifications`} arrow>
        <IconButton
          onClick={handleMenuOpen}
          size="medium"
          aria-label={`${unreadCount} unread notifications`}
          aria-haspopup="menu"
          aria-expanded={open}
          sx={{
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'action.hover',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <Badge 
            badgeContent={unreadCount > 99 ? '99+' : unreadCount} 
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.7rem',
                minWidth: 18,
                height: 18
              }
            }}
          >
            {unreadCount > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 380,
            maxHeight: 500,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">
              Notifications
            </Typography>
            <Chip
              label={`${unreadCount} unread`}
              size="small"
              color={unreadCount > 0 ? 'error' : 'default'}
              variant={unreadCount > 0 ? 'filled' : 'outlined'}
            />
          </Box>
          
          {unreadCount > 0 && (
            <Button
              startIcon={<MarkReadIcon />}
              onClick={handleMarkAllRead}
              size="small"
              sx={{ mt: 1, fontSize: '0.75rem' }}
            >
              Mark all as read
            </Button>
          )}
        </Box>

        {/* Notifications List */}
        <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
          {notifications.length > 0 ? (
            Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
              <Box key={date}>
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'block',
                    color: 'text.secondary',
                    fontWeight: 'medium',
                    backgroundColor: 'background.default'
                  }}
                >
                  {new Date(date).toDateString() === new Date().toDateString() ? 'Today' : date}
                </Typography>
                
                {dateNotifications.map((notification) => (
                  <MenuItem
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      alignItems: 'flex-start',
                      backgroundColor: notification.read ? 'transparent' : 'action.hover',
                      '&:hover': {
                        backgroundColor: notification.read ? 'action.hover' : 'action.selected'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {notification.title}
                          </Typography>
                          {!notification.read && (
                            <CircleIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {notification.body}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            {formatTimestamp(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                  </MenuItem>
                ))}
              </Box>
            ))
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1 }}>
              <Button
                fullWidth
                startIcon={<ViewAllIcon />}
                onClick={() => {
                  window.location.href = '/notifications'
                  handleMenuClose()
                }}
                sx={{ justifyContent: 'flex-start' }}
              >
                View all notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  )
}

export default NotificationsMenu
