const verticalMenuData = () => [
  {
    label: 'Home',
    href: '/',
    icon: 'tabler-smart-home'
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'tabler-dashboard'
  },
  {
    label: 'Products',
    href: '/products',
    icon: 'tabler-package'
  },
  {
    label: 'Test Dashboard',
    href: '/test-dashboard',
    icon: 'tabler-chart-line'
  },
  {
    label: 'Test',
    href: '/test',
    icon: 'tabler-flask'
  },
  {
    sectionTitle: 'Administration'
  },
  {
    label: 'Tenants',
    href: '/admin/tenants',
    icon: 'tabler-building',
    children: [
      {
        label: 'Liste des tenants',
        href: '/admin/tenants'
      },
      {
        label: 'Nouveau tenant',
        href: '/admin/tenants/new'
      }
    ]
  },
  {
    label: 'About',
    href: '/about',
    icon: 'tabler-info-circle'
  }
]

export default verticalMenuData
