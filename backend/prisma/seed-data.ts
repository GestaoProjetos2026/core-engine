export type AdminUserDef = {
  email: string;
  name: string;
  passwordEnvKey: string;
  defaultPassword: string;
};

export type M2mAppDef = {
  clientId: string;
  name: string;
  secretEnvKey: string;
  defaultSecret: string;
  scopeCodes: readonly string[];
  squad?: string;
};

export const adminUserDefs: AdminUserDef[] = [
  {
    email: 'admin@example.com',
    name: 'Admin Core',
    passwordEnvKey: 'SEED_PASSWORD_ADMIN_CORE',
    defaultPassword: 'AdminCore2026!',
  },
  {
    email: 'admin@hotmail.com',
    name: 'Admin Hotmail',
    passwordEnvKey: 'SEED_PASSWORD_ADMIN_HOTMAIL',
    defaultPassword: 'AdminHotmail2026!',
  },
  {
    email: 'admincrm@example.com',
    name: 'Admin CRM',
    passwordEnvKey: 'SEED_PASSWORD_ADMIN_CRM',
    defaultPassword: 'AdminCrm2026!',
  },
  {
    email: 'adminfiscal@example.com',
    name: 'Admin Fiscal',
    passwordEnvKey: 'SEED_PASSWORD_ADMIN_FISCAL',
    defaultPassword: 'AdminFiscal2026!',
  },
  {
    email: 'admdesk@example.com',
    name: 'Admin Desk',
    passwordEnvKey: 'SEED_PASSWORD_ADMIN_DESK',
    defaultPassword: 'AdminDesk2026!',
  },
  {
    email: 'admindevops@example.com',
    name: 'Admin DevOps',
    passwordEnvKey: 'SEED_PASSWORD_ADMIN_DEVOPS',
    defaultPassword: 'AdminDevops2026!',
  },
];

export const viewerUserDef: AdminUserDef = {
  email: 'viewer@example.com',
  name: 'Viewer User',
  passwordEnvKey: 'SEED_PASSWORD_VIEWER',
  defaultPassword: 'ViewerDemo2026!',
};

/** Integrações M2M por persona (deploy) + squads consumidoras (task 15). */
export const m2mAppDefs: M2mAppDef[] = [
  {
    clientId: 'erp-core-client',
    name: 'ERP Core Integration',
    secretEnvKey: 'SEED_M2M_SECRET_CORE',
    defaultSecret: 'M2mCore2026!Secret',
    scopeCodes: ['identity:read', 'read:all'],
    squad: 'Core',
  },
  {
    clientId: 'erp-hotmail-client',
    name: 'ERP Hotmail Integration',
    secretEnvKey: 'SEED_M2M_SECRET_HOTMAIL',
    defaultSecret: 'M2mHotmail2026!Secret',
    scopeCodes: ['identity:read', 'read:all'],
    squad: 'Core',
  },
  {
    clientId: 'erp-crm-client',
    name: 'ERP CRM Integration',
    secretEnvKey: 'SEED_M2M_SECRET_CRM',
    defaultSecret: 'M2mCrm2026!Secret',
    scopeCodes: ['identity:read', 'customers:read'],
    squad: 'Squad 3',
  },
  {
    clientId: 'erp-fiscal-client',
    name: 'ERP Fiscal Integration',
    secretEnvKey: 'SEED_M2M_SECRET_FISCAL',
    defaultSecret: 'M2mFiscal2026!Secret',
    scopeCodes: ['identity:read', 'finance:read'],
    squad: 'Squad 2',
  },
  {
    clientId: 'erp-desk-client',
    name: 'ERP Desk Integration',
    secretEnvKey: 'SEED_M2M_SECRET_DESK',
    defaultSecret: 'M2mDesk2026!Secret',
    scopeCodes: ['identity:read', 'tickets:read'],
    squad: 'Squad 4',
  },
  {
    clientId: 'erp-devops-client',
    name: 'ERP DevOps Integration',
    secretEnvKey: 'SEED_M2M_SECRET_DEVOPS',
    defaultSecret: 'M2mDevops2026!Secret',
    scopeCodes: ['identity:read', 'read:all'],
    squad: 'DevOps',
  },
  {
    clientId: 'finance-fiscal',
    name: 'Finance Fiscal (Squad 2 demo)',
    secretEnvKey: 'SEED_M2M_SECRET_FINANCE_FISCAL',
    defaultSecret: 'FinanceFiscal-Demo2026!',
    scopeCodes: ['identity:read', 'finance:read'],
    squad: 'Squad 2',
  },
  {
    clientId: 'crm-leads',
    name: 'CRM Leads (Squad 3 demo)',
    secretEnvKey: 'SEED_M2M_SECRET_CRM_LEADS',
    defaultSecret: 'CrmLeads-Demo2026!',
    scopeCodes: ['identity:read', 'customers:read'],
    squad: 'Squad 3',
  },
  {
    clientId: 'service-desk',
    name: 'Service Desk (Squad 4 demo)',
    secretEnvKey: 'SEED_M2M_SECRET_SERVICE_DESK',
    defaultSecret: 'ServiceDesk-Demo2026!',
    scopeCodes: ['identity:read', 'tickets:read'],
    squad: 'Squad 4',
  },
];

export const e2eM2mAppDef: M2mAppDef = {
  clientId: 'test-client-id',
  name: 'Test Application',
  secretEnvKey: 'SEED_M2M_SECRET_E2E',
  defaultSecret: 'test-client-secret',
  scopeCodes: [
    'identity:read',
    'read:all',
    'write:all',
    'test:scope',
    'orders:read',
    'orders:write',
    'customers:read',
    'customers:write',
    'products:read',
    'products:write',
  ],
  squad: 'Core QA',
};
