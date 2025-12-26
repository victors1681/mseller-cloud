# ChatKit Integration - MSeller Cloud

## Overview

This document describes the ChatKit integration in MSeller Cloud. ChatKit is OpenAI's embeddable chat widget that connects to AI agent workflows created in Agent Builder.

## Architecture

### File Structure

```
src/
├── pages/
│   ├── api/
│   │   └── chatkit/
│   │       └── session.ts          # API endpoint for creating ChatKit sessions
│   └── apps/
│       └── chatkit/
│           └── index.tsx            # ChatKit page component
├── views/
│   └── apps/
│       └── chatkit/
│           ├── ChatKitComponent.tsx # Main ChatKit React component
│           └── ChatKitView.tsx      # View wrapper with info cards
├── types/
│   └── apps/
│       └── chatkitTypes.ts          # TypeScript type definitions
└── navigation/
    └── vertical/
        └── index.ts                 # Navigation menu (updated)
```

## Components

### 1. ChatKitComponent (`ChatKitComponent.tsx`)

The main React component that handles:

- Using the official `@openai/chatkit-react` package
- Creating and managing ChatKit sessions
- Rendering the chat interface with the `<ChatKit>` component
- Error handling and loading states
- Mobile-responsive design

**Props:**

```typescript
interface ChatKitProps {
  workflowId: string // Your OpenAI workflow ID
  userId?: string // Optional user ID for tracking
  className?: string // Custom CSS class
  onError?: (error: Error) => void // Error callback
  onSessionCreated?: (session: ChatKitSession) => void // Session creation callback
}
```

**Features:**

- Official ChatKit React SDK integration
- Automatic session management with refresh support
- Loading and error states with UI feedback
- Mobile-first responsive design
- Clean and simple implementation

### 2. ChatKitView (`ChatKitView.tsx`)

A view wrapper that provides:

- Info cards explaining the chat assistant
- Session information display
- Error handling UI
- Responsive layout for mobile and desktop

### 3. API Endpoint (`/api/chatkit/session`)

Server-side API endpoint that:

- Creates ChatKit sessions via OpenAI API
- Exchanges workflow ID for client secret
- Handles authentication with OpenAI
- Returns session credentials to client

**Request:**

```typescript
POST /api/chatkit/session
{
  "workflowId": "wf_...",
  "userId": "optional-user-id"
}
```

**Response:**

```typescript
{
  "client_secret": "cs_...",
  "session_id": "sess_..."
}
```

## Configuration

### Environment Variables

Add the following to your `.env` or `.env.local` file:

```bash
# OpenAI API Key for ChatKit (server-side only)
OPENAI_API_KEY=sk-...

# Your workflow ID from Agent Builder (client-side accessible)
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_694bcfa27d008190bfea49d38cf488680c8fe335749752f0
```

### Workflow ID

The workflow ID is provided by OpenAI Agent Builder when you create an agent workflow. Set it in your environment file:

```bash
# .env or .env.local
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_694bcfa27d008190bfea49d38cf488680c8fe335749752f0
```

The component will automatically use this environment variable. If not set, it falls back to the default workflow ID.

## Installation

### 1. Install Dependencies

Install the official ChatKit React package:

```bash
yarn add @openai/chatkit-react
```

or with npm:

```bash
npm install @openai/chatkit-react
```

### 2. Environment Setup

1. Create an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env.local` file
3. Create an agent workflow in [Agent Builder](https://platform.openai.com/docs/guides/agent-builder)
4. Copy your workflow ID

### 3. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3000/apps/chatkit`
3. The chat should load and be ready to interact

## Usage

### Basic Usage

```tsx
import ChatKitComponent from 'src/views/apps/chatkit/ChatKitComponent'

function MyPage() {
  return (
    <ChatKitComponent
      workflowId="wf_694bcfa27d008190bfea49d38cf488680c8fe335749752f0"
      userId="user-123"
      onSessionCreated={(session) => console.log('Session created:', session)}
      onError={(error) => console.error('ChatKit error:', error)}
    />
  )
}
```

The component uses the official `@openai/chatkit-react` package which provides:

- The `useChatKit` hook for session management
- The `<ChatKit>` component for rendering the chat interface
- Automatic session refresh handling
- Built-in error boundaries

### With Custom Styling

```tsx
<ChatKitComponent
  workflowId={WORKFLOW_ID}
  className="custom-chatkit"
  userId={auth.user?.id}
/>

<style jsx global>{`
  .custom-chatkit {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`}</style>
```

## Customization

### Theming

ChatKit supports custom theming. You can add custom CSS to style the chat interface:

```css
/* In your global styles or styled component */
.chatkit-container {
  --chatkit-primary-color: #9155fd; /* Match your theme */
  --chatkit-background-color: #fff;
  --chatkit-text-color: #333;
  --chatkit-border-radius: 8px;
}
```

### Mobile Optimization

The component is already mobile-optimized with:

- Full-screen on mobile devices
- Touch-friendly UI
- Responsive spacing and sizing
- Adaptive height calculations

## API Reference

### Types

```typescript
// Session data returned from API
interface ChatKitSession {
  clientSecret: string
  sessionId?: string
  userId?: string
}

// Component configuration
interface ChatKitConfig {
  workflowId: string
  userId?: string
  deviceId?: string
}

// Individual message (for future extensions)
interface ChatKitMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}
```

### API Endpoints

#### POST `/api/chatkit/session`

Creates a new ChatKit session.

**Request Body:**

- `workflowId` (required): OpenAI workflow ID
- `userId` (optional): User identifier for tracking

**Response:**

- `client_secret`: Secret for initializing chat
- `session_id`: Unique session identifier

**Error Responses:**

- `400`: Bad Request (missing workflowId)
- `405`: Method Not Allowed (non-POST request)
- `500`: Server error or OpenAI API error

## Security Considerations

1. **API Key Protection**: Never expose your OpenAI API key in client-side code
2. **Session Management**: Sessions are created server-side only
3. **User Authentication**: Integrate with your existing auth system
4. **Rate Limiting**: Consider adding rate limiting to the session endpoint
5. **CORS**: The API endpoint respects Next.js CORS defaults

## Troubleshooting

### Package Installation Issues

If you encounter peer dependency issues during installation:

```bash
yarn add @openai/chatkit-react
```

If using npm and encountering conflicts:

```bash
npm install @openai/chatkit-react --legacy-peer-deps
```

### Session Creation Fails

If sessions fail to create:

1. Verify your `OPENAI_API_KEY` is set correctly
2. Check that your workflow ID is valid
3. Review API endpoint logs for detailed errors
4. Ensure your OpenAI account has ChatKit beta access

### Chat Not Displaying

If the chat doesn't render:

1. Check browser console for JavaScript errors
2. Verify the workflow ID is correct
3. Ensure `@openai/chatkit-react` package is installed
4. Check that the session was created successfully
5. Verify there are no CSS conflicts affecting the chat container

## Best Practices

1. **Error Handling**: Always provide fallback UI for errors
2. **Loading States**: Show clear loading indicators
3. **Mobile First**: Test on mobile devices frequently
4. **Session Refresh**: Implement session refresh logic for long sessions
5. **User Context**: Pass relevant user data for personalized responses
6. **Analytics**: Track chat interactions for insights
7. **Accessibility**: Ensure keyboard navigation works

## Future Enhancements

- [ ] Session persistence across page reloads
- [ ] Chat history storage in database
- [ ] Custom message templates
- [ ] File upload support
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Custom widgets integration
- [ ] Voice input support

## Resources

- [ChatKit Documentation](https://platform.openai.com/docs/guides/chatkit)
- [Agent Builder Guide](https://platform.openai.com/docs/guides/agent-builder)
- [ChatKit JS SDK](https://github.com/openai/chatkit-js)
- [ChatKit Python SDK](https://github.com/openai/chatkit-python)
- [ChatKit Playground](https://chatkit.studio/playground)
- [ChatKit World Demo](https://chatkit.world/)

## Support

For issues specific to this integration, contact the development team.
For ChatKit-specific issues, refer to [OpenAI Support](https://help.openai.com/).
