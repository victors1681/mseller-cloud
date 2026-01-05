# Scriban Template Editor - Architectural Solution

## The Problem

**Visual HTML editors (like GrapesJS) and templating languages (like Scriban) are fundamentally incompatible.**

### Why This Happens

1. **GrapesJS operates on the DOM tree** - It parses HTML into a DOM structure, allows visual manipulation, then serializes back to HTML
2. **Scriban syntax is not HTML** - Control structures like `{{- for -}}` are treated as text nodes by the DOM parser
3. **DOM manipulation breaks scope** - When GrapesJS rearranges elements, it can move Scriban delimiters to invalid positions

### Example of the Problem

**Original Scriban template:**

```html
<table>
  <tbody>
    {{- for item in document.detalle -}}
    <tr>
      <td>{{ item.cantidad_formatted }}</td>
    </tr>
    {{- end -}}
  </tbody>
</table>
```

**After GrapesJS visual editing:**

```html
<div class="table-container">
  {{- for item in document.detalle -}} {{- end -}}
  <table>
    <tbody>
      <tr>
        <td>{{ item.cantidad_formatted }}</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Result:** The `item` variable is used outside its scope - **template fails**.

---

## The Solution: Dual-Mode Architecture

### Overview

**Separate visual design from template logic:**

- **Visual Mode (GrapesJS)** - For designing layout, styles, and static content
- **Code Mode (Monaco Editor)** - For editing Scriban logic, loops, conditionals

### Architecture Components

```
┌─────────────────────────────────────────┐
│     TemplateEditorTabs Component        │
│  (Smart mode switching & validation)    │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼────────┐
│  Visual Mode   │    │   Code Mode     │
│   (GrapesJS)   │    │ (Monaco Editor) │
│                │    │                 │
│ • Drag & Drop  │    │ • Syntax Highlight│
│ • Style Panel  │    │ • Validation    │
│ • Components   │    │ • Full Control  │
│                │    │                 │
│ ⚠️ NO SCRIBAN  │    │ ✅ SCRIBAN SAFE │
└────────────────┘    └─────────────────┘
```

### Key Features

#### 1. **Intelligent Mode Detection**

```typescript
const hasScribanLogic = (html: string): boolean => {
  const scribanPatterns = [
    /\{\{-?\s*for\s+/, // {{- for item in list -}}
    /\{\{-?\s*if\s+/, // {{- if condition -}}
    /\{\{-?\s*else/, // {{- else -}}
    /\{\{-?\s*end\s*-?\}\}/, // {{- end -}}
    /\{\{-?\s*while\s+/, // {{- while condition -}}
  ]
  return scribanPatterns.some((pattern) => pattern.test(html))
}
```

#### 2. **Protective Warnings**

- Detects Scriban control structures automatically
- Shows error alert when in Visual Mode with Scriban logic
- Blocks mode switching with confirmation dialog
- Guides users to Code Mode for safe editing

#### 3. **Validation**

- Real-time syntax checking in Code Mode
- Balanced delimiter validation (`{{- for -}}` must have `{{- end -}}`)
- Immediate feedback on errors

---

## Implementation Guide

### Step 1: Replace GrapeJSEditor with TemplateEditorTabs

**Before (in ReportDetailView.tsx):**

```tsx
<GrapeJSEditor
  value={formData.contenidoScriban}
  projectData={formData.contenidoGrapesJs}
  onChange={(html, projectJson) => {
    setFormData({
      ...formData,
      contenidoScriban: html,
      contenidoGrapesJs: projectJson,
    })
  }}
/>
```

**After:**

```tsx
import TemplateEditorTabs from './components/TemplateEditorTabs'

;<TemplateEditorTabs
  value={formData.contenidoScriban}
  projectData={formData.contenidoGrapesJs}
  onChange={(html, projectJson) => {
    setFormData({
      ...formData,
      contenidoScriban: html,
      contenidoGrapesJs: projectJson,
    })
  }}
  onValidationError={(error) => {
    console.error('Template validation error:', error)
    // Optionally show a snackbar notification
  }}
/>
```

### Step 2: Update Import in ReportDetailView.tsx

```typescript
// Remove or comment out:
// import GrapeJSEditor from './components/GrapeJSEditor'

// Add:
import TemplateEditorTabs from './components/TemplateEditorTabs'
```

### Step 3: (Optional) Update EditReportTemplateModal

Apply the same changes to the modal component for consistency.

---

## User Workflow

### For Templates WITHOUT Scriban Logic (Static Templates)

1. ✅ **Use Visual Mode**
2. Drag & drop components
3. Style with visual tools
4. Save directly

### For Templates WITH Scriban Logic (Dynamic Templates)

1. ⚠️ **Use Code Mode**
2. Edit Scriban syntax with:
   - Syntax highlighting
   - Line numbers
   - Auto-completion
   - Validation
3. Preview changes (implement preview feature separately)
4. Save when validation passes

### Migration Workflow

**Converting existing static template to dynamic:**

1. Start in Visual Mode
2. Design the layout visually
3. Switch to Code Mode
4. Add Scriban control structures at correct positions
5. Stay in Code Mode for all future edits

---

## Technical Details

### Monaco Editor Features

- **Language**: HTML with embedded Scriban
- **Theme**: Auto-switches with app theme (light/dark)
- **Height**: 600px (configurable)
- **Features Enabled**:
  - Line numbers
  - Word wrap
  - Format on paste
  - Bracket pair colorization
  - Auto-indentation

### File Structure

```
src/views/apps/reports/
├── ReportDetailView.tsx (updated)
├── components/
│   ├── TemplateEditorTabs.tsx (NEW - main component)
│   ├── GrapeJSEditor.tsx (kept for non-Scriban use)
│   └── EditReportTemplateModal.tsx (optionally updated)
```

### Dependencies Added

```json
{
  "dependencies": {
    "@monaco-editor/react": "^4.7.0",
    "monaco-editor": "^0.55.1"
  }
}
```

---

## Alternative Solutions Considered

### ❌ Option 1: Pre/Post-Processing with HTML Comments

**Concept:** Wrap Scriban in HTML comments before GrapesJS parsing

```html
<!-- SCRIBAN_LOOP_START -->
{{- for item in document.detalle -}}
<!-- SCRIBAN_LOOP_END -->
```

**Problems:**

- GrapesJS can still move comments
- Complex to maintain
- Error-prone parsing
- Doesn't scale with nested structures

### ❌ Option 2: Custom GrapesJS Components with `draggable: false`

**Concept:** Create locked GrapesJS components for Scriban blocks

**Problems:**

- Brittle - users can still delete/copy
- Poor UX - confusing locked elements
- Doesn't prevent all DOM manipulation
- Hard to maintain as templates grow

### ❌ Option 3: Backend Preprocessing

**Concept:** Fix structure on the backend before rendering

**Problems:**

- Cannot reconstruct lost scope information
- Would need AI/heuristics to guess intent
- Unreliable and complex
- Doesn't prevent the root cause

### ✅ **Our Solution: Dual-Mode Architecture**

**Why it works:**

- ✅ Prevents the problem at the source
- ✅ Clear mental model for users
- ✅ Professional code editing experience
- ✅ Maintains backward compatibility
- ✅ Scales to complex templates
- ✅ Production-ready and maintainable

---

## Best Practices

### When to Use Each Mode

| Template Type                  | Recommended Mode | Reason                            |
| ------------------------------ | ---------------- | --------------------------------- |
| **Email templates (no loops)** | Visual Mode      | Simple layout, no dynamic content |
| **Static PDFs**                | Visual Mode      | Fixed structure, no variables     |
| **Invoice/Order templates**    | Code Mode        | Contains loops, conditionals      |
| **Report templates**           | Code Mode        | Dynamic sections, complex logic   |
| **Simple receipts**            | Visual Mode      | Can use variables without loops   |

### Template Development Workflow

1. **Start in Visual Mode** - Design the basic layout
2. **Switch to Code Mode** - Add Scriban control structures
3. **Test thoroughly** - Validate with backend
4. **Lock the template** - Mark as "uses Scriban logic" in metadata
5. **Future edits** - Always use Code Mode for Scriban templates

### Metadata Recommendation

Add a flag to your template type:

```typescript
export interface PlantillaReporte {
  id: number
  nombre: string
  contenidoGrapesJs: string
  contenidoScriban: string
  tipoPlantilla: TipoPlantilla
  usesScribanLogic: boolean // NEW - helps UI decide default mode
}
```

---

## Monaco Editor Configuration

### Custom Language Support (Future Enhancement)

You can register Scriban as a custom language in Monaco:

```typescript
import * as monaco from 'monaco-editor'

monaco.languages.register({ id: 'scriban-html' })

monaco.languages.setMonarchTokensProvider('scriban-html', {
  tokenizer: {
    root: [
      [/\{\{-?/, 'delimiter.scriban'],
      [/-?\}\}/, 'delimiter.scriban'],
      [/for|if|else|end|while/, 'keyword.scriban'],
      // ... more rules
    ],
  },
})
```

This provides:

- Better syntax highlighting for Scriban
- Auto-completion for Scriban keywords
- Error detection

---

## Testing Strategy

### Unit Tests

```typescript
describe('TemplateEditorTabs', () => {
  it('detects Scriban logic in template', () => {
    const html = '<div>{{- for item in list -}}</div>'
    expect(hasScribanLogic(html)).toBe(true)
  })

  it('shows warning when switching to visual mode with Scriban', () => {
    // Test warning dialog appears
  })

  it('validates balanced Scriban delimiters', () => {
    // Test validation logic
  })
})
```

### Integration Tests

1. Create template in Visual Mode
2. Switch to Code Mode
3. Add Scriban loop
4. Attempt to switch back to Visual Mode
5. Verify warning appears
6. Confirm and verify Visual Mode loads
7. Save template
8. Reload and verify integrity

### Backend Validation

```csharp
// Ensure backend validates Scriban syntax
public class TemplateValidator
{
    public ValidationResult ValidateScribanSyntax(string template)
    {
        try
        {
            var parsed = Template.Parse(template);
            return ValidationResult.Success();
        }
        catch (ScribanParseException ex)
        {
            return ValidationResult.Error(ex.Message);
        }
    }
}
```

---

## Migration Path for Existing Templates

### Phase 1: Add TemplateEditorTabs (Non-Breaking)

- ✅ Install dependencies
- ✅ Add TemplateEditorTabs component
- ✅ Update ReportDetailView.tsx
- ⏳ Keep both modes available
- ⏳ No changes to existing templates

### Phase 2: User Training

- Document which templates need Code Mode
- Add in-app tutorials
- Email notification to users
- Create video guide

### Phase 3: Add Metadata Flag

- Run migration script to analyze existing templates
- Mark templates with Scriban logic
- Default to Code Mode for marked templates

### Phase 4: Deprecate Visual Mode for Complex Templates

- Show persistent warning for Scriban templates in Visual Mode
- Eventually disable Visual Mode for complex templates

---

## Summary

### The Problem

GrapesJS DOM manipulation destroys Scriban control structure scope.

### The Solution

Dual-mode architecture: Visual Mode for static templates, Code Mode for Scriban logic.

### Key Benefits

- ✅ **Prevents corruption** at the source
- ✅ **Professional UX** with Monaco Editor
- ✅ **Clear guidance** for users
- ✅ **Scales** to complex templates
- ✅ **Production-ready** and maintainable

### Next Steps

1. ✅ Dependencies installed
2. ✅ Component created
3. ⏳ Integrate into ReportDetailView
4. ⏳ Test with real templates
5. ⏳ Deploy and monitor

---

**This is the industry-standard approach for managing templates with embedded logic. Major platforms like SendGrid, Mailchimp, and Shopify use similar dual-mode architectures.**
