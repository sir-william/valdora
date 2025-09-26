/**
 * Navigation générée automatiquement
 * ⚠️  Ne pas modifier ce fichier manuellement
 * Généré le: 2025-09-26T13:28:58.668Z
 * Composants scannés: 9
 */

const generatedNavigation = [
  {
    "sectionTitle": "Administration",
    "items": [
      {
        "label": "Feature Flags",
        "href": "/admin/feature-flags",
        "icon": "tabler-settings",
        "order": 90,
        "permissions": [
          "admin"
        ],
        "children": []
      },
      {
        "label": "Gestion des Utilisateurs",
        "href": "/admin/user-management",
        "icon": "tabler-users",
        "order": 300,
        "permissions": [
          "user.read.all",
          "user.manage.all"
        ],
        "children": []
      },
      {
        "label": "Gestion des Rôles",
        "href": "/src/views/user-role-permission/roles/RoleList.jsx",
        "icon": "tabler-shield",
        "order": 310,
        "permissions": [
          "role.read.all",
          "role.manage.all"
        ],
        "children": []
      },
      {
        "label": "Gestion des Permissions",
        "href": "/src/views/user-role-permission/permissions/PermissionList.jsx",
        "icon": "tabler-key",
        "order": 320,
        "permissions": [
          "permission.read.all",
          "permission.manage.all"
        ],
        "children": []
      }
    ]
  },
  {
    "sectionTitle": "Analytics & Reporting",
    "items": [
      {
        "label": "Analytics",
        "href": "/analytics",
        "icon": "tabler-chart-line",
        "order": 25,
        "permissions": [
          "user",
          "admin"
        ],
        "children": []
      }
    ]
  },
  {
    "sectionTitle": "Démonstration",
    "items": [
      {
        "label": "Navigation Auto-Détection",
        "href": "/demo-navigation",
        "icon": "tabler-wand",
        "order": 200,
        "permissions": [
          "user"
        ],
        "children": []
      }
    ]
  },
  {
    "sectionTitle": "Développement",
    "items": [
      {
        "label": "Test API",
        "href": "/api-test",
        "icon": "tabler-flask",
        "order": 80,
        "permissions": [
          "admin",
          "developer"
        ],
        "children": []
      }
    ]
  },
  {
    "sectionTitle": "Intelligence Artificielle",
    "items": [
      {
        "label": "Génération IA",
        "href": "/ai-generation",
        "icon": "tabler-magic",
        "order": 15,
        "permissions": [
          "user",
          "admin"
        ],
        "children": []
      },
      {
        "label": "Brouillons IA",
        "href": "/ai-drafts",
        "icon": "tabler-file-text",
        "order": 16,
        "permissions": [
          "user",
          "admin"
        ],
        "children": []
      }
    ]
  }
];

export default generatedNavigation;

// Métadonnées de génération
export const generationMetadata = {
  generatedAt: '2025-09-26T13:28:58.668Z',
  componentsCount: 9,
  components: [
  {
    "file": "src/app/admin/feature-flags/page.jsx",
    "label": "Feature Flags",
    "section": "Administration",
    "enabled": true
  },
  {
    "file": "src/views/user-role-permission/users/UserList.jsx",
    "label": "Gestion des Utilisateurs",
    "section": "Administration",
    "enabled": true
  },
  {
    "file": "src/views/user-role-permission/roles/RoleList.jsx",
    "label": "Gestion des Rôles",
    "section": "Administration",
    "enabled": true
  },
  {
    "file": "src/views/user-role-permission/permissions/PermissionList.jsx",
    "label": "Gestion des Permissions",
    "section": "Administration",
    "enabled": true
  },
  {
    "file": "src/app/analytics/page.jsx",
    "label": "Analytics",
    "section": "Analytics & Reporting",
    "enabled": true
  },
  {
    "file": "src/app/demo-navigation/page.jsx",
    "label": "Navigation Auto-Détection",
    "section": "Démonstration",
    "enabled": true
  },
  {
    "file": "src/app/api-test/page.jsx",
    "label": "Test API",
    "section": "Développement",
    "enabled": true
  },
  {
    "file": "src/app/ai-generation/page.jsx",
    "label": "Génération IA",
    "section": "Intelligence Artificielle",
    "enabled": true
  },
  {
    "file": "src/app/ai-drafts/page.jsx",
    "label": "Brouillons IA",
    "section": "Intelligence Artificielle",
    "enabled": true
  }
]
};
