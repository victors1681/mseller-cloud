# ECF Module

This module contains Electronic Invoicing (ECF) configuration pages for the application.

## Structure

- `/apps/ecf/integration/` - Electronic Invoicing Integration Configuration

  - `list/` - ECF configuration list and management
  - `index.tsx` - Redirects to ECF list

- `/apps/ecf/business/` - Business Information Configuration
  - `index.tsx` - Business information form

## Navigation

The ECF module is now organized under the "Configuración" menu with the following structure:

```text
Configuración
├── ECF
│   ├── Integración (ECF Integration List)
│   └── Empresa (Business Form)
└── Cuenta (Account Settings)
```

## Features

### Business Configuration Form

- Complete business information form
- All BusinessType fields except businessId
- Form validation
- PUT request to update business data
- Loading and error states

### ECF Integration Configuration

- Moved from `/apps/ecf/list` to `/apps/ecf/integration/list`
- Maintains all existing functionality
- Accessible through new navigation structure
