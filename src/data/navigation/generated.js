/**
 * Navigation générée automatiquement
 * ⚠️  Ne pas modifier ce fichier manuellement
 * Généré le: 2025-09-22T10:50:34.993Z
 * Composants scannés: 4
 */

const generatedNavigation = [
  {
    "sectionTitle": "Administration",
    "items": [
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
  }
];

export default generatedNavigation;

// Métadonnées de génération
export const generationMetadata = {
  generatedAt: '2025-09-22T10:50:34.993Z',
  componentsCount: 4,
  components: [
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
    "file": "src/app/demo-navigation/page.jsx",
    "label": "Navigation Auto-Détection",
    "section": "Démonstration",
    "enabled": true
  }
]
};
