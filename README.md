# MSeller Cloud UI

Modern web interface for MSeller, built with Next.js, Material-UI, and Firebase integration for cloud-based sales management.

## Tech Stack

- **Frontend:** Next.js 13, Material-UI 5, TypeScript
- **State Management:** Redux Toolkit, React-Query
- **Form Handling:** React Hook Form, Yup Validation
- **Backend Integration:** Firebase / Emulator
- **UI Components:** Material Icons, Custom Components
- **Maps Integration:** Google Maps API
- **Payments:** Stripe Integration

## Prerequisites

- Node.js >= 16
- Yarn >= 1.22
- Firebase CLI (`npm install -g firebase-tools`)
- MSeller Core API access
- Google Maps API Key
- Stripe Account

## Quick Start

1. **Clone and Install:**

````bash
git clone https://github.com/your-org/mseller-cloud-ui.git
cd mseller-cloud-ui
yarn install

2. Environment Setup:

```cp .env.example .env.local```

3. Configure Environment:

````

# Firebase

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Services

NEXT_PUBLIC_GOOGLE_MAP=your_google_maps_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_key

```

## Development

## Local Development
```

# Standard development

yarn dev

# With local API (localhost:5186)

yarn dev:local

# With integration API

yarn dev:mseller

```

## Firebase Development
```

# Start emulator

firebase emulators:start

# Development with emulator

yarn dev:firebase

# With emulator + local API

yarn dev:firebase-local

```


## Building & Deployment
```

# Production build

yarn build

# Start production server

yarn start

# Static export

yarn export

```

## Project Structure
```

src/
├── components/ # Reusable UI components
│ ├── common/ # Shared components
│ ├── forms/ # Form components
│ └── layouts/ # Layout components
├── pages/ # Next.js pages
├── store/ # Redux store
│ ├── slices/ # Redux slices
│ └── services/ # API services
├── hooks/ # Custom hooks
├── styles/ # Global styles
├── types/ # TypeScript types
└── utils/ # Helper functions

```

## Code Conventions

- Use TypeScript for all new code
- Follow Material-UI theme system
- Write unit tests for utilities
- Use React Hook Form for forms
- Follow Redux Toolkit patterns


## Available Scripts

`yarn dev` - Development server
`yarn build` - Production build
`yarn start` - Production server
`yarn lint` - Lint code
`yarn test` - Run tests
`yarn build:icons` - Build icon bundle

### Version
Current Version: 2.2.0

### Support
Documentation: docs.mseller.app
Email: support@mseller.app
Issues: GitHub Issues

License
Proprietary - All rights reserved `Mobile Seller LLC`
```
