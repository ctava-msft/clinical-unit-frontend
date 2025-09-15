# GitHub Copilot Instructions for Clinical Unit Frontend

## Project Overview

This is a **Clinical Rounds App** - a React-based healthcare application designed to streamline clinical rounds for healthcare professionals. The app features secure Azure AD authentication with security group-based authorization and is built with modern web technologies optimized for healthcare environments.

### Key Features
- **Healthcare Focus**: Clinical rounds management for hospital workflows
- **Security First**: Azure AD authentication with RBAC (Role-Based Access Control)
- **Real-time Data**: Patient information and SOAP notes management
- **Responsive Design**: Mobile-friendly interface for on-the-go clinical staff
- **Compliance Ready**: Built with healthcare data privacy and security in mind

## Tech Stack & Architecture

### Frontend Framework
- **React 18** with **TypeScript** for type safety and modern component patterns
- **Vite** for fast development and optimized builds
- **Redux Toolkit (RTK)** for state management with createSlice patterns
- **React Router** for client-side routing (if applicable)

### Styling & UI
- **Tailwind CSS** for utility-first styling
- **Headless UI** for accessible component primitives
- **Heroicons** for consistent iconography
- **CSS Modules/PostCSS** for component-scoped styles

### Authentication & Security
- **Azure AD (Microsoft Entra ID)** with MSAL (Microsoft Authentication Library)
- **Security Group-based Authorization** for role management
- **Microsoft Graph API** integration for user profile and group membership
- **Token-based API authentication** with automatic refresh

### Development Tools
- **ESLint** with TypeScript rules for code quality
- **Prettier** (implied) for code formatting
- **Docker** support for containerized deployment
- **Nginx** for production serving

## Coding Standards & Conventions

### TypeScript Guidelines
- **Strict TypeScript**: Use proper typing, avoid `any` except when absolutely necessary
- **Interface over Type**: Prefer `interface` for object shapes, `type` for unions/computed types
- **Explicit return types** for functions, especially async functions
- **Proper generic constraints** when using generics

```typescript
// Good: Explicit typing
interface PatientData {
  id: string;
  name: string;
  visitId: string;
}

// Good: Typed async function
const fetchPatient = async (id: string): Promise<PatientData> => {
  // implementation
};

// Avoid: Using any
const badFunction = (data: any) => { // ❌ Avoid
  return data.someProperty;
};
```

### React Component Patterns
- **Functional Components** with hooks (no class components)
- **TypeScript interfaces** for component props
- **Custom hooks** for reusable logic
- **Error boundaries** for graceful error handling
- **Memoization** (React.memo, useMemo, useCallback) for performance optimization

```typescript
// Good: Typed functional component
interface PatientCardProps {
  patient: PatientData;
  onSelect: (id: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(patient.id);
  }, [patient.id, onSelect]);

  return (
    <div className="p-4 border rounded-lg" onClick={handleClick}>
      <h3>{patient.name}</h3>
    </div>
  );
};
```

### State Management with Redux Toolkit
- **createSlice** for reducer logic with immer integration
- **createAsyncThunk** for async operations
- **Typed hooks** (useAppDispatch, useAppSelector)
- **RTK Query** for API data fetching (if applicable)

```typescript
// Good: RTK slice pattern
const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setSelectedPatient: (state, action: PayloadAction<string>) => {
      state.selectedPatientId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatientData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  },
});
```

### Styling Guidelines
- **Tailwind CSS** utility classes for styling
- **Responsive design** with mobile-first approach
- **Consistent spacing** using Tailwind's spacing scale
- **Healthcare-appropriate colors** (professional, accessible)
- **CSS custom properties** for theme variables when needed

```tsx
// Good: Tailwind with responsive classes
<div className="p-4 md:p-6 bg-white shadow-md rounded-lg">
  <h2 className="text-lg md:text-xl font-semibold text-gray-900">
    Patient Information
  </h2>
</div>
```

## Azure AD Authentication Patterns

### Authentication Setup
- Use **MSAL React hooks** for authentication state
- **Environment variable validation** for Azure AD configuration
- **Graceful error handling** for authentication failures
- **Token refresh** handling with silent token acquisition

```typescript
// Good: MSAL integration pattern
const AuthenticatedApp = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  return (
    <>
      <AuthenticatedTemplate>
        <MainApp />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LoginComponent />
      </UnauthenticatedTemplate>
    </>
  );
};
```

### Security Group Authorization
- **Group membership validation** on login
- **Role-based component rendering** based on security groups
- **API request authorization** with proper token scopes
- **Graceful degradation** for unauthorized users

```typescript
// Good: Security group checking
const useUserRole = () => {
  const { accounts } = useMsal();
  const account = accounts[0];
  
  const isAdmin = useMemo(() => {
    return account?.idTokenClaims?.groups?.includes(ADMIN_GROUP_ID);
  }, [account]);
  
  return { isAdmin };
};
```

## API Integration Guidelines

### HTTP Client Configuration
- **Axios** for HTTP requests with interceptors
- **Token injection** for authenticated requests
- **Error handling** with proper user feedback
- **Request/response logging** for debugging (non-PII only)

```typescript
// Good: API client setup
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Data Fetching Patterns
- **Async/await** for cleaner async code
- **Loading states** for better UX
- **Error boundaries** for error handling
- **Data caching** strategies where appropriate

## Healthcare & Compliance Considerations

### Data Privacy
- **No PII in logs** or console outputs
- **Secure token storage** using MSAL's secure cache
- **Session timeout** handling for security
- **Audit logging** for compliance requirements

### Performance & Reliability
- **Lazy loading** for large components
- **Error boundaries** for graceful degradation
- **Offline capability** considerations
- **Network resilience** with retry logic

### Accessibility
- **WCAG 2.1 AA compliance** for healthcare accessibility
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** support for clinical environments

## File Structure & Organization

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (buttons, inputs)
│   ├── forms/           # Form-specific components
│   └── patient/         # Patient-related components
├── hooks/               # Custom React hooks
├── store/               # Redux store and slices
├── auth/                # Authentication configuration
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── constants/           # Application constants
└── assets/              # Static assets (images, fonts)
```

## Testing Guidelines

### Component Testing
- **React Testing Library** for component testing
- **User-centric tests** (test behavior, not implementation)
- **Accessibility testing** included in component tests
- **Mock authentication** for testing auth-protected components

### Integration Testing
- **API integration tests** with mocked responses
- **Authentication flow testing** with MSAL mocks
- **Error scenario testing** for robustness

## Development Workflow

### Environment Setup
- **Environment variables** properly configured (see `.env.sample`)
- **Azure AD app registration** completed
- **Security groups** configured in Azure AD
- **Development certificates** for HTTPS (if needed)

### Code Quality
- **ESLint** for code linting with TypeScript rules
- **Type checking** with strict TypeScript configuration
- **Pre-commit hooks** for code quality (if configured)
- **Code reviews** focusing on security and healthcare compliance

### Deployment
- **Docker** containerization for consistent deployments
- **Environment-specific** configuration management
- **Health checks** for application monitoring
- **Security scanning** for dependency vulnerabilities

## Common Patterns & Examples

### Custom Hook Pattern
```typescript
// Good: Custom hook for patient data
const usePatientData = (patientId: string) => {
  const [data, setData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/patients/${patientId}`);
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  return { data, loading, error };
};
```

### Error Boundary Pattern
```typescript
// Good: Healthcare-specific error boundary
class ClinicalErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service (without PII)
    console.error('Clinical app error:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800">
            Something went wrong
          </h2>
          <p className="text-red-600">
            Please refresh the page or contact IT support.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Important Notes for AI Assistants

1. **Healthcare Context**: This is a clinical application. Always consider healthcare workflows, privacy regulations (HIPAA compliance), and clinical user needs.

2. **Security First**: Never compromise on authentication, authorization, or data security. Always use secure coding practices.

3. **Type Safety**: Maintain strict TypeScript typing throughout the codebase. Avoid `any` types.

4. **Performance**: Healthcare apps need to be fast and reliable. Consider performance implications of all changes.

5. **Accessibility**: Clinical staff may use assistive technologies. Ensure all UI components are accessible.

6. **Error Handling**: Healthcare apps must handle errors gracefully without exposing sensitive information.

7. **Testing**: Changes should include appropriate tests, especially for authentication and data handling logic.

8. **Documentation**: Update relevant documentation when adding new features or changing existing functionality.

When suggesting code changes or new features, always consider the healthcare context, security implications, and user experience for clinical professionals.