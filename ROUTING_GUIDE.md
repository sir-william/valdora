# VALDORA Routing System Guide

## Overview

VALDORA uses the **Next.js App Router** (introduced in Next.js 13+), which provides a file-system based routing mechanism. This guide explains how routes work in the project and how to add new ones.

## Current Route Structure

Based on the project analysis, here's the current routing structure:

```
src/app/
├── layout.jsx          # Root layout (wraps all pages)
├── page.jsx           # Homepage (/)
├── not-found.jsx      # 404 page
├── globals.css        # Global styles
├── favicon.ico        # Site icon
├── dashboard/
│   └── page.jsx       # Dashboard page (/dashboard)
├── test/
│   └── page.jsx       # Test page (/test)
├── test-dashboard/
│   └── page.jsx       # Test dashboard (/test-dashboard)
└── products/          # New route we just created
    └── page.jsx       # Products page (/products)
```

## Route Mapping

| File Path | URL | Description |
|-----------|-----|-------------|
| `src/app/page.jsx` | `/` | Homepage |
| `src/app/dashboard/page.jsx` | `/dashboard` | Main dashboard |
| `src/app/test/page.jsx` | `/test` | Test page |
| `src/app/test-dashboard/page.jsx` | `/test-dashboard` | Test dashboard |
| `src/app/products/page.jsx` | `/products` | Products listing |
| `src/app/not-found.jsx` | `/404` | 404 error page |

## How to Add New Routes

### 1. Simple Page Route

To create a new page, create a folder with a `page.jsx` file:

```bash
# Create a new route for user profile
mkdir -p src/app/profile
```

```jsx
// src/app/profile/page.jsx
'use client'

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const ProfilePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="body1">
        This is the user profile page.
      </Typography>
    </Container>
  );
};

export default ProfilePage;
```

**Result**: Accessible at `/profile`

### 2. Nested Routes

Create nested folder structures for hierarchical routes:

```bash
# Create nested routes for user management
mkdir -p src/app/admin/users
mkdir -p src/app/admin/settings
```

```jsx
// src/app/admin/page.jsx
'use client'

const AdminPage = () => {
  return <div>Admin Dashboard</div>;
};

export default AdminPage;
```

```jsx
// src/app/admin/users/page.jsx
'use client'

const AdminUsersPage = () => {
  return <div>Admin Users Management</div>;
};

export default AdminUsersPage;
```

**Result**: 
- `/admin` → Admin dashboard
- `/admin/users` → User management
- `/admin/settings` → Settings page

### 3. Dynamic Routes

Use square brackets `[param]` for dynamic segments:

```bash
# Create dynamic product detail route
mkdir -p src/app/products/[id]
```

```jsx
// src/app/products/[id]/page.jsx
'use client'

import { useParams } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params.id;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Product Details
      </Typography>
      <Typography variant="body1">
        Showing details for product ID: {productId}
      </Typography>
    </Container>
  );
};

export default ProductDetailPage;
```

**Result**: `/products/123` → Shows product with ID 123

### 4. Catch-All Routes

Use `[...slug]` for catch-all routes:

```bash
# Create catch-all route for documentation
mkdir -p src/app/docs/[...slug]
```

```jsx
// src/app/docs/[...slug]/page.jsx
'use client'

import { useParams } from 'next/navigation';

const DocsPage = () => {
  const params = useParams();
  const slug = params.slug || [];

  return (
    <div>
      <h1>Documentation</h1>
      <p>Path: /{slug.join('/')}</p>
    </div>
  );
};

export default DocsPage;
```

**Result**: 
- `/docs/getting-started` → slug = ['getting-started']
- `/docs/api/authentication` → slug = ['api', 'authentication']

### 5. Route Groups

Use parentheses `(group)` to organize routes without affecting the URL:

```bash
# Create route groups for organization
mkdir -p src/app/(auth)/login
mkdir -p src/app/(auth)/register
mkdir -p src/app/(dashboard)/analytics
mkdir -p src/app/(dashboard)/reports
```

```jsx
// src/app/(auth)/login/page.jsx
'use client'

const LoginPage = () => {
  return <div>Login Page</div>;
};

export default LoginPage;
```

**Result**: 
- `/login` → Login page (not /auth/login)
- `/register` → Register page
- `/analytics` → Analytics page
- `/reports` → Reports page

## Layout System

### Root Layout

The root layout (`src/app/layout.jsx`) wraps all pages:

```jsx
// src/app/layout.jsx
'use client'

import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
// ... other imports

const RootLayout = ({ children }) => {
  return (
    <html lang='fr'>
      <body>
        <Provider store={store}>
          <ThemeProvider theme={valdoraTheme}>
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}

export default RootLayout
```

### Nested Layouts

You can create layouts for specific route groups:

```jsx
// src/app/(dashboard)/layout.jsx
'use client'

import Sidebar from '@/components/layout/Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
```

## Navigation Between Routes

### Using Next.js Link

```jsx
import Link from 'next/link';

const Navigation = () => {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/products">Products</Link>
      <Link href="/products/123">Product 123</Link>
    </nav>
  );
};
```

### Programmatic Navigation

```jsx
'use client'

import { useRouter } from 'next/navigation';

const MyComponent = () => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push('/dashboard');
    // or
    router.replace('/login'); // Replace current entry
    // or
    router.back(); // Go back
  };

  return (
    <button onClick={handleNavigation}>
      Go to Dashboard
    </button>
  );
};
```

## Route Parameters and Search Params

### Getting Route Parameters

```jsx
'use client'

import { useParams } from 'next/navigation';

const ProductPage = () => {
  const params = useParams();
  // For /products/[id] route
  const productId = params.id;
  
  return <div>Product ID: {productId}</div>;
};
```

### Getting Search Parameters

```jsx
'use client'

import { useSearchParams } from 'next/navigation';

const SearchPage = () => {
  const searchParams = useSearchParams();
  // For URL: /search?q=laptop&category=electronics
  const query = searchParams.get('q'); // 'laptop'
  const category = searchParams.get('category'); // 'electronics'
  
  return (
    <div>
      <p>Query: {query}</p>
      <p>Category: {category}</p>
    </div>
  );
};
```

## Best Practices

### 1. File Naming Convention

- Use `page.jsx` for route pages
- Use `layout.jsx` for layouts
- Use `loading.jsx` for loading states
- Use `error.jsx` for error boundaries
- Use `not-found.jsx` for 404 pages

### 2. Client vs Server Components

- Use `'use client'` directive for components that need browser APIs
- Server components are the default and are better for performance
- Most VALDORA pages use client components due to interactivity

### 3. Route Organization

```
src/app/
├── (auth)/              # Authentication routes
│   ├── login/
│   └── register/
├── (dashboard)/         # Dashboard routes
│   ├── analytics/
│   └── reports/
├── (public)/           # Public routes
│   ├── about/
│   └── contact/
└── api/                # API routes (if needed)
```

### 4. SEO and Metadata

```jsx
// src/app/products/page.jsx
export const metadata = {
  title: 'Products - VALDORA',
  description: 'Browse our amazing products',
};

const ProductsPage = () => {
  // Component code
};

export default ProductsPage;
```

## Example: Complete E-commerce Route Structure

Here's how you might structure routes for a complete e-commerce application:

```
src/app/
├── layout.jsx                    # Root layout
├── page.jsx                     # Homepage (/)
├── (auth)/
│   ├── login/page.jsx           # /login
│   ├── register/page.jsx        # /register
│   └── layout.jsx               # Auth layout
├── (shop)/
│   ├── products/
│   │   ├── page.jsx             # /products
│   │   ├── [id]/page.jsx        # /products/123
│   │   └── category/
│   │       └── [slug]/page.jsx  # /products/category/electronics
│   ├── cart/page.jsx            # /cart
│   └── checkout/page.jsx        # /checkout
├── (account)/
│   ├── profile/page.jsx         # /profile
│   ├── orders/
│   │   ├── page.jsx             # /orders
│   │   └── [id]/page.jsx        # /orders/456
│   └── layout.jsx               # Account layout with sidebar
└── (admin)/
    ├── dashboard/page.jsx       # /dashboard
    ├── products/
    │   ├── page.jsx             # /products (admin view)
    │   ├── new/page.jsx         # /products/new
    │   └── [id]/edit/page.jsx   # /products/123/edit
    └── layout.jsx               # Admin layout
```

This structure provides a clean, organized way to handle all the routes in a complex e-commerce application while maintaining the benefits of Next.js App Router.
