# ChatKit Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy your API key (starts with `sk-`)

### Step 2: Create an Agent Workflow

1. Visit [Agent Builder](https://platform.openai.com/docs/guides/agent-builder)
2. Click "Create Workflow"
3. Design your agent workflow (or use a template)
4. Copy your Workflow ID (starts with `wf_`)

### Step 3: Install Dependencies

```bash
yarn add @openai/chatkit-react
```

### Step 4: Configure Environment

Add to your `.env` or `.env.local` file:

```bash
# Server-side API key
OPENAI_API_KEY=sk-your-actual-api-key-here

# Client-side workflow ID
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_694bcfa27d008190bfea49d38cf488680c8fe335749752f0
```

### Step 5: Run the App

```bash
npm run dev
```

Navigate to: `http://localhost:3000/apps/chatkit`

## ✅ What's Included

- ✨ Official `@openai/chatkit-react` integration
- 📱 Mobile-responsive design
- 🔐 Secure server-side session management
- 🎨 Material-UI integration
- 🚨 Error handling and loading states
- 📊 Session tracking
- 🎯 Navigation menu integration

## 📂 Files Created

```
✓ src/types/apps/chatkitTypes.ts
✓ src/pages/api/chatkit/session.ts
✓ src/views/apps/chatkit/ChatKitComponent.tsx
✓ src/views/apps/chatkit/ChatKitView.tsx
✓ src/pages/apps/chatkit/index.tsx
✓ src/navigation/vertical/index.ts (updated)
✓ docs/chatkit-integration.md
```

## 🎯 Next Steps

1. **Test the Integration**: Visit `/apps/chatkit` and start chatting
2. **Customize the Workflow**: Adjust your agent in Agent Builder
3. **Add Custom Styling**: Modify the component CSS
4. **Implement Analytics**: Track chat interactions
5. **Add Features**: Extend with file uploads, voice input, etc.

## 💡 Tips

- Check browser console for any errors
- Ensure your OpenAI account has ChatKit beta access
- Test on mobile devices for responsive behavior
- Monitor API usage in OpenAI dashboard

## 🆘 Quick Troubleshooting

| Issue                      | Solution                                                                  |
| -------------------------- | ------------------------------------------------------------------------- |
| Package installation fails | Use `yarn add @openai/chatkit-react` or add `--legacy-peer-deps` with npm |
| Session creation fails     | Verify OPENAI_API_KEY in .env.local                                       |
| Chat not displaying        | Check browser console for errors                                          |
| Workflow not responding    | Verify workflow ID is correct                                             |

## 📚 Documentation

For detailed documentation, see [chatkit-integration.md](./chatkit-integration.md)

## 🎉 You're All Set!

Your ChatKit integration is ready to use. Access it from the navigation menu under "Chat AI".
