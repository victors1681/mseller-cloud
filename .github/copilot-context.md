# MSeller Cloud - GitHub Copilot Context

## 📋 Project Overview

**MSeller Cloud** is an advanced Next.js 13+ TypeScript application built with Material-UI 5.x using the Materio theme template. It serves as a comprehensive business management platform with multi-module architecture, Firebase authentication, and Redux Toolkit state management.

### 🏗️ Architecture Pattern

- **Framework**: Next.js 13.5+ with App Router and Pages Router hybrid
- **Language**: TypeScript with strict mode
- **UI Framework**: Material-UI 5.12+ with Materio theme template
- **State Management**: Redux Toolkit with modular slice architecture
- **Authentication**: Firebase Auth with custom context wrapper
- **Database**: Firebase Firestore with emulator support
- **Styling**: Emotion CSS-in-JS with Material-UI theming

## 🛠️ Tech Stack

### Core Dependencies

```json
{
  "next": "^13.5.6",
  "react": "18.2.0",
  "@mui/material": "5.12.2",
  "@mui/system": "5.12.1",
  "@mui/x-data-grid": "6.0.3",
  "@reduxjs/toolkit": "1.9.5",
  "firebase": "^10.7.1",
  "typescript": "5.0.4"
}
```

### Key Libraries

- **Forms**: React Hook Form with Yup validation
- **Charts**: ApexCharts, Chart.js, Recharts
- **Date Handling**: date-fns, moment
- **UI Components**: MUI Lab, Keen Slider, React DatePicker
- **Development**: ESLint, Prettier, Jest with Testing Library

## 📁 Project Structure

```text
src/
├── @core/                      # Materio theme core components
│   ├── components/            # Reusable core UI components
│   ├── context/               # Core context providers
│   ├── hooks/                 # Custom core hooks
│   ├── layouts/               # Layout components and types
│   ├── styles/                # Core styling utilities
│   ├── theme/                 # Material-UI theme configuration
│   └── utils/                 # Core utility functions
├── components/                # Application-specific components
├── configs/                   # Configuration files
│   ├── auth.ts               # Auth configuration
│   ├── themeConfig.ts        # Theme settings
│   └── restClient.ts         # API client setup
├── context/                   # Application contexts
│   ├── AuthContext.tsx       # Firebase authentication context
│   └── types.ts              # Context type definitions
├── firebase/                  # Firebase integration
│   ├── index.ts              # Firebase functions and utilities
│   └── firebaseConfig.ts     # Firebase configuration
├── pages/                     # Next.js pages (routing)
│   ├── apps/                 # Business module pages
│   │   ├── clients/          # Client management pages
│   │   ├── products/         # Product management pages
│   │   ├── invoices/         # Invoice management pages
│   │   └── [other-modules]/  # Additional business modules
│   ├── login/                # Authentication pages
│   └── _app.tsx             # App wrapper
├── store/                     # Redux store
│   ├── index.ts              # Store configuration
│   └── apps/                 # Feature-based slices
│       ├── user/             # User management slice
│       ├── clients/          # Client management slice
│       ├── products/         # Product management slice
│       └── [other-modules]/  # Additional module slices
├── types/                     # TypeScript type definitions
│   └── apps/                 # Application-specific types
├── views/                     # Page view components
│   ├── apps/                 # Business module views
│   │   ├── clients/          # Client management views
│   │   ├── products/         # Product management views
│   │   └── [other-modules]/  # Additional module views
│   └── pages/                # General page views
└── utils/                     # Utility functions
```

## 🎨 Theme Configuration

### Materio Theme Integration

- **Base**: Materio admin template with Material-UI 5.x
- **Customization**: Custom theme overrides in `@core/theme/`
- **Components**: Reusable components in `@core/components/`
- **Layouts**: Vertical and horizontal layout options

### Theme Features

- Dark/Light mode support
- RTL/LTR direction support
- Responsive design breakpoints
- Custom color palette
- Typography scaling
- Component style overrides

## 🔐 Authentication System

### Firebase Authentication

- **Provider**: Firebase Auth with email/password
- **Context**: `AuthContext.tsx` wraps the entire application
- **Persistence**: Browser local/session persistence
- **Emulator**: Development emulator support
- **Features**: Sign up, sign in, password reset, profile management

### Auth Flow

```typescript
// Auth context pattern
const AuthContext = createContext<AuthValuesType>({
  user: null,
  loading: true,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  // ... other auth methods
})
```

## 🗃️ State Management

### Redux Toolkit Architecture

- **Store**: Centralized in `store/index.ts`
- **Slices**: Feature-based in `store/apps/`
- **Pattern**: Each business module has its own slice

### Module Structure

Each business module follows this pattern:

```text
store/apps/[module]/
├── index.ts          # Main slice with reducers
├── types.ts          # TypeScript interfaces
└── [additional files]
```

### Available Modules

- `user` - User management and profile
- `clients` - Client/customer management
- `products` - Product catalog management
- `invoices` - Invoice and billing
- `collections` - Collection management
- `documents` - Document handling
- `transports` - Transport/shipping
- `sellers` - Sales representative management
- `drivers` - Driver management
- `locations` - Location/warehouse management
- `paymentTypes` - Payment method management
- `offers` - Special offers and promotions
- `calendar` - Calendar and scheduling
- `chat` - Communication features
- `email` - Email management
- `ecf` - Electronic fiscal documents
- `business` - Business configuration
- `pos` - Point of sale
- `permissions` - User permissions and ACL

## 🧭 Routing & Navigation

### Page Structure

- **Pattern**: `/pages/apps/[module]/[action]/`
- **Views**: Corresponding view components in `/views/apps/[module]/`
- **Actions**: Common actions include `list`, `add`, `edit`, `view`

### Example Module Structure

```text
pages/apps/clients/
├── list/index.tsx        # Client listing page
├── add/index.tsx         # Add new client page
└── [id]/
    ├── index.tsx         # View client details
    └── edit/index.tsx    # Edit client page

views/apps/clients/
├── list/                 # List view components
├── add/                  # Add form components
└── shared-drawer/        # Shared components
```

## 🎯 Development Patterns

### Component Conventions

1. **File Naming**: PascalCase for components, camelCase for utilities
2. **Import Order**: React → Next → MUI → Third Party → Local
3. **Props**: Define interfaces for all component props
4. **Styling**: Use MUI's `styled` or `sx` prop for styling

### State Management Patterns

1. **Local State**: Use `useState` for component-specific state
2. **Global State**: Use Redux for cross-component shared state
3. **Server State**: Consider caching patterns for API data
4. **Form State**: Use React Hook Form for complex forms

### API Integration

1. **Firebase Functions**: Use `httpsCallable` for backend communication
2. **Error Handling**: Implement proper error boundaries and user feedback
3. **Loading States**: Show loading indicators during async operations
4. **Emulator Support**: Use Firebase emulators for development

## 🔧 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled, avoid `any` types
- **ESLint**: Follow configured rules for consistency
- **Prettier**: Auto-format code on save
- **Imports**: Use absolute imports with path aliases

### Path Aliases

```typescript
{
  "@/*": ["./src/*"],
  "@core/*": ["./src/@core/*"],
  "@components/*": ["./src/components/*"],
  "@configs/*": ["./src/configs/*"],
  "@views/*": ["./src/views/*"]
}
```

### Testing

- **Framework**: Jest with React Testing Library
- **Coverage**: Aim for meaningful test coverage
- **Types**: Test user interactions and business logic

### Environment Setup

- **Development**: `npm run dev` with hot reload
- **Local API**: `npm run dev:local` connects to localhost:5186
- **Firebase**: `npm run dev:firebase` uses Firebase emulators
- **Build**: `npm run build` for production builds

## 📦 Key Features

### Business Modules

1. **Client Management**: Customer profiles, contact info, preferences
2. **Product Catalog**: Inventory management, pricing, categories
3. **Invoice System**: Billing, payment tracking, tax management
4. **Collection Management**: Payment collection and tracking
5. **Document Management**: File uploads, categorization, sharing
6. **Transport Management**: Shipping, logistics, tracking
7. **POS Integration**: Point of sale operations
8. **ECF Support**: Electronic fiscal document compliance
9. **Multi-location**: Warehouse and location management
10. **User Permissions**: Role-based access control

### UI Features

1. **Data Tables**: Advanced filtering, sorting, pagination
2. **Forms**: Complex validation with real-time feedback
3. **Charts**: Multiple chart types for analytics
4. **Responsive Design**: Mobile-first approach
5. **Theme Customization**: User-configurable themes
6. **Internationalization**: Multi-language support ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project configured
- Environment variables set up

### Development Commands

```bash
npm run dev                    # Start development server
npm run dev:local             # Connect to local API
npm run dev:firebase          # Use Firebase emulators
npm run build                 # Production build
npm run lint                  # Run ESLint
npm run test                  # Run tests
```

### Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_EMULATOR_ENABLED=true  # Enable Firebase emulators
TARGET=http://localhost:5186        # Local API target
```

## 💡 Best Practices

### When Adding New Features

1. **Create Redux Slice**: Add to `store/apps/[module]/`
2. **Define Types**: Create TypeScript interfaces
3. **Add Pages**: Follow the `pages/apps/[module]/` structure
4. **Create Views**: Implement in `views/apps/[module]/`
5. **Update Navigation**: Add to navigation configuration
6. **Write Tests**: Add unit and integration tests

### Performance Optimization

1. **Code Splitting**: Use dynamic imports for heavy components
2. **Image Optimization**: Use Next.js Image component
3. **Bundle Analysis**: Monitor bundle size regularly
4. **Memoization**: Use React.memo and useMemo appropriately

### Security Considerations

1. **Authentication**: Always verify user permissions
2. **API Calls**: Validate data before sending to Firebase
3. **Environment Variables**: Never expose secrets in client code
4. **Error Handling**: Don't leak sensitive information in errors

This context should help GitHub Copilot understand the MSeller Cloud codebase structure, patterns, and best practices for generating relevant and consistent code suggestions.
