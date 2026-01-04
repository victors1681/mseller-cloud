# Document Renderer Component

Reusable component for rendering and printing documents using the PlantillaReporte system.

## Features

- ✅ Auto-print with configurable delay
- ✅ Optional preview mode with thumbnail
- ✅ Batch printing support
- ✅ Same-tab rendering (POS-friendly)
- ✅ Print lifecycle callbacks
- ✅ Mobile-responsive
- ✅ Kiosk mode detection

## Usage

### Basic Modal with Auto-Print

```typescript
import { DocumentRendererModal } from 'src/views/ui/documentRenderer'

const MyComponent = () => {
  const [open, setOpen] = useState(false)

  return (
    <DocumentRendererModal
      open={open}
      onClose={() => setOpen(false)}
      documentNo="14659-90000017"
      tipoDocumento={0} // 0=Order, 1=Invoice, 2=Quote
      onPrintCompleted={(docNo) => {
        console.log('Printed:', docNo)
        setOpen(false)
      }}
    />
  )
}
```

### With Preview Mode

```typescript
<DocumentRendererModal
  open={open}
  onClose={() => setOpen(false)}
  documentNo="14659-90000017"
  tipoDocumento={1}
  showPreview={true} // Shows minimal thumbnail + full preview
  autoPrint={false} // Requires manual print button click
  title="Vista Previa de Factura"
/>
```

### Batch Printing

```typescript
<DocumentRendererModal
  open={open}
  onClose={() => setOpen(false)}
  documentNos={['14659-90000017', '14659-90000018', '14659-90000019']}
  tipoDocumento={0}
  onPrintCompleted={(docNo) => console.log('Printed:', docNo)}
/>
```

### Same-Tab Renderer (POS)

```typescript
import { DocumentRendererPage } from 'src/views/ui/documentRenderer'

const POSReceipt = () => {
  const [showPrint, setShowPrint] = useState(false)

  if (!showPrint) return <POSInterface />

  return (
    <DocumentRendererPage
      documentNo="14659-90000017"
      tipoDocumento={4} // POS ticket
      onPrintCompleted={() => {
        setShowPrint(false) // Return to POS interface
        toast.success('Impreso exitosamente')
      }}
      onPrintCancelled={(error) => {
        setShowPrint(false)
        toast.error(error || 'Impresión cancelada')
      }}
    />
  )
}
```

### Using the Hook Directly

```typescript
import { useDocumentRenderer } from 'src/hooks/useDocumentRenderer'

const CustomComponent = () => {
  const { htmlContent, loading, error, fetchDocument, isMobile } =
    useDocumentRenderer({
      documentNo: '14659-90000017',
      tipoDocumento: 0,
      autoFetch: true,
    })

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {htmlContent && (
        <iframe
          srcDoc={htmlContent}
          style={{ width: '100%', height: '600px' }}
        />
      )}
    </div>
  )
}
```

## Props

### DocumentRendererModal

| Prop               | Type                     | Default  | Description                   |
| ------------------ | ------------------------ | -------- | ----------------------------- |
| `open`             | `boolean`                | required | Modal open state              |
| `onClose`          | `() => void`             | required | Close handler                 |
| `documentNo`       | `string`                 | -        | Single document number        |
| `documentNos`      | `string[]`               | -        | Multiple documents for batch  |
| `tipoDocumento`    | `number`                 | required | Document type (0-10)          |
| `plantillaId`      | `number`                 | -        | Optional template ID override |
| `showPreview`      | `boolean`                | `false`  | Show preview before print     |
| `autoPrint`        | `boolean`                | `true`   | Auto-trigger print dialog     |
| `autoCloseDelay`   | `number`                 | `2000`   | Delay (ms) before auto-close  |
| `title`            | `string`                 | -        | Custom dialog title           |
| `onPrintStarted`   | `(docNo) => void`        | -        | Print started callback        |
| `onPrintCompleted` | `(docNo) => void`        | -        | Print completed callback      |
| `onPrintCancelled` | `(docNo, error) => void` | -        | Print cancelled callback      |

### DocumentRendererPage

| Prop               | Type              | Default  | Description              |
| ------------------ | ----------------- | -------- | ------------------------ |
| `documentNo`       | `string`          | required | Document number          |
| `tipoDocumento`    | `number`          | required | Document type            |
| `plantillaId`      | `number`          | -        | Optional template ID     |
| `onPrintCompleted` | `() => void`      | -        | Print completed callback |
| `onPrintCancelled` | `(error) => void` | -        | Print cancelled callback |
| `autoCloseDelay`   | `number`          | `2000`   | Delay before callback    |

## Document Types

| Value | Type                                      |
| ----- | ----------------------------------------- |
| 0     | Order (Pedido)                            |
| 1     | Invoice (Factura)                         |
| 2     | Quote (Cotización)                        |
| 3     | Purchase Order (Orden de Compra)          |
| 4     | Receipt (Recibo/Ticket POS)               |
| 5     | Credit Note (Nota de Crédito)             |
| 6     | Debit Note (Nota de Débito)               |
| 7     | Return Order (Devolución)                 |
| 8     | Delivery Note (Nota de Entrega)           |
| 9     | Transport Invoice (Factura de Transporte) |

## Silent Printing (Kiosk Mode)

True silent printing (without user interaction) requires special browser configuration:

### Chrome Kiosk Mode

```bash
# Launch Chrome in kiosk mode with silent printing
chrome --kiosk-printing --enable-print-preview=false --kiosk "http://localhost:3000/pos"
```

### Electron Alternative

For true silent printing in POS systems, consider using Electron:

```javascript
// main.js
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({
  webPreferences: {
    enableRemoteModule: true,
  },
})

// Silent print
win.webContents.print({ silent: true, printBackground: true })
```

### POS Deployment Checklist

1. ✅ Configure Chrome kiosk mode with `--kiosk-printing` flag
2. ✅ Use dedicated print workstation with thermal printer
3. ✅ Test print completion detection with your printer model
4. ✅ Configure auto-return to POS interface after print
5. ✅ Set appropriate `autoCloseDelay` based on printer speed
6. ✅ Implement print queue for offline scenarios (Phase 2)

## Mobile Behavior

On mobile devices, `window.print()` behavior varies:

- **iOS Safari**: Shows native print preview, allows PDF save
- **Android Chrome**: Shows print preview or triggers PDF download
- **Mobile Firefox**: Shows print settings dialog

The component detects mobile and shows appropriate messaging. For consistent mobile PDF generation, a dedicated PDF endpoint is recommended (future enhancement).

## Browser Compatibility

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (full support)
- ⚠️ IE11 (not tested, deprecated)

## Future Enhancements

- [ ] PDF endpoint integration for mobile (`preferPdf` prop)
- [ ] Offline print queue with IndexedDB
- [ ] Print history tracking
- [ ] Printer selection UI
- [ ] Print template cache (5min TTL)
