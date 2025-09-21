import { useState, useMemo } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  GetApp,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  error = null,
  
  // Pagination
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  
  // Sorting
  orderBy = '',
  order = 'asc',
  onSort,
  
  // Selection
  selectable = false,
  selected = [],
  onSelectionChange,
  
  // Search
  searchable = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Rechercher...',
  
  // Actions
  actions = [],
  rowActions = [],
  
  // Styling
  dense = false,
  stickyHeader = false,
  maxHeight,
  
  // Custom
  emptyMessage = 'Aucune donnée disponible',
  onRowClick,
  rowKey = 'id',
  
  // Filters
  filters = [],
  activeFilters = {},
  onFilterChange,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRowId, setSelectedRowId] = useState(null)

  // Handle select all
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((row) => row[rowKey])
      onSelectionChange?.(newSelected)
    } else {
      onSelectionChange?.([])
    }
  }

  // Handle individual row selection
  const handleRowSelect = (event, id) => {
    event.stopPropagation()
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    onSelectionChange?.(newSelected)
  }

  // Handle sort
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    onSort?.(property, isAsc ? 'desc' : 'asc')
  }

  // Handle row actions menu
  const handleRowActionsClick = (event, rowId) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedRowId(rowId)
  }

  const handleRowActionsClose = () => {
    setAnchorEl(null)
    setSelectedRowId(null)
  }

  // Memoized calculations
  const isSelected = (id) => selected.indexOf(id) !== -1
  const numSelected = selected.length
  const rowCount = data.length

  // Render cell content
  const renderCellContent = (column, row) => {
    const value = row[column.field]
    
    if (column.renderCell) {
      return column.renderCell({ value, row, column })
    }

    if (column.type === 'boolean') {
      return (
        <Chip
          label={value ? 'Oui' : 'Non'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      )
    }

    if (column.type === 'date') {
      return value ? new Date(value).toLocaleDateString('fr-FR') : '-'
    }

    if (column.type === 'currency') {
      return value ? `${value.toLocaleString('fr-FR')} €` : '-'
    }

    if (column.type === 'status') {
      const statusConfig = column.statusConfig?.[value] || {}
      return (
        <Chip
          label={statusConfig.label || value}
          color={statusConfig.color || 'default'}
          size="small"
        />
      )
    }

    return value || '-'
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Toolbar */}
      {(searchable || actions.length > 0 || numSelected > 0) && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
              bgcolor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
            }),
          }}
        >
          {numSelected > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} sélectionné(s)
            </Typography>
          ) : (
            <Box sx={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', gap: 2 }}>
              {searchable && (
                <TextField
                  size="small"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 250 }}
                />
              )}
              
              {filters.length > 0 && (
                <IconButton>
                  <FilterList />
                </IconButton>
              )}
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {actions.map((action, index) => (
              <Tooltip key={index} title={action.tooltip || action.label}>
                <IconButton
                  onClick={() => action.onClick(selected)}
                  disabled={action.disabled || (action.requireSelection && numSelected === 0)}
                >
                  {action.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Toolbar>
      )}

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{ maxHeight }}
      >
        <Table
          stickyHeader={stickyHeader}
          size={dense ? 'small' : 'medium'}
        >
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || 'left'}
                  padding={column.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === column.field ? order : false}
                  sx={{ minWidth: column.minWidth }}
                >
                  {column.sortable !== false && onSort ? (
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : 'asc'}
                      onClick={() => handleSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
              
              {rowActions.length > 0 && (
                <TableCell align="right" padding="checkbox">
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (rowActions.length > 0 ? 1 : 0)}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (rowActions.length > 0 ? 1 : 0)}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {data.map((row, index) => {
                  const isItemSelected = isSelected(row[rowKey])
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <motion.tr
                      key={row[rowKey]}
                      component={TableRow}
                      hover
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                      sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onChange={(event) => handleRowSelect(event, row[rowKey])}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                      )}
                      
                      {columns.map((column) => (
                        <TableCell
                          key={column.field}
                          align={column.align || 'left'}
                          padding={column.disablePadding ? 'none' : 'normal'}
                        >
                          {renderCellContent(column, row)}
                        </TableCell>
                      ))}
                      
                      {rowActions.length > 0 && (
                        <TableCell align="right" padding="checkbox">
                          <IconButton
                            size="small"
                            onClick={(event) => handleRowActionsClick(event, row[rowKey])}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      )}
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {onPageChange && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(event) => onRowsPerPageChange?.(parseInt(event.target.value, 10))}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
        />
      )}

      {/* Row Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleRowActionsClose}
      >
        {rowActions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              const selectedRow = data.find(row => row[rowKey] === selectedRowId)
              action.onClick(selectedRow)
              handleRowActionsClose()
            }}
            disabled={action.disabled}
          >
            {action.icon && <Box sx={{ mr: 1, display: 'flex' }}>{action.icon}</Box>}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default DataTable
