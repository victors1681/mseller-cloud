// ** React Imports
import { useEffect, useRef, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  AlertTitle,
  Box,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Monaco Editor
import type { Monaco } from '@monaco-editor/react'
import MonacoEditor from '@monaco-editor/react'

interface TemplateEditorProps {
  value: string
  onChange: (html: string) => void
  onValidationError?: (error: string) => void
}

const TemplateEditorTabs = ({
  value,
  onChange,
  onValidationError,
}: TemplateEditorProps) => {
  const theme = useTheme()
  const [codeValue, setCodeValue] = useState(value)
  const [showPreview, setShowPreview] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Configure Monaco with Scriban syntax highlighting
  const handleEditorWillMount = (monaco: Monaco) => {
    // Register Scriban language
    monaco.languages.register({ id: 'scriban-html' })

    // Define Scriban syntax highlighting
    monaco.languages.setMonarchTokensProvider('scriban-html', {
      tokenizer: {
        root: [
          // HTML Comments first
          [/<!--/, 'comment', '@htmlComment'],

          // Scriban comments
          [/\{\{-?\s*#/, 'comment', '@scribanComment'],

          // Scriban control blocks with keywords
          [
            /\{\{-?\s*(if|else\s+if|else|end|for|while|case|when|break|continue)\b/,
            { token: 'keyword', next: '@scribanBlock' },
          ],

          // Scriban variables and expressions
          [/\{\{-?/, { token: 'delimiter.bracket', next: '@scribanBlock' }],

          // HTML tags
          [/<\/?[\w-]+/, 'tag', '@htmlTag'],

          // Regular text
          [/[^<{]+/, 'text'],
          [/[<{]/, 'text'],
        ],

        scribanBlock: [
          [/-?\}\}/, { token: 'delimiter.bracket', next: '@pop' }],
          [
            /\b(if|else|end|for|in|while|case|when|break|continue|and|or|not)\b/,
            'keyword',
          ],
          [/\b(true|false|null)\b/, 'constant'],
          [/\|[\s]*[\w]+/, 'type.identifier'],
          [/[a-zA-Z_][\w.]*/, 'variable'],
          [/[0-9]+(\.[0-9]+)?/, 'number'],
          [/"([^"\\]|\\.)*"/, 'string'],
          [/'([^'\\]|\\.)*'/, 'string'],
          [/[+\-*/%<>=!&|]+/, 'operator'],
          [/[()[\]]/, 'delimiter'],
          [/\s+/, 'white'],
        ],

        scribanComment: [
          [/-?\}\}/, { token: 'comment', next: '@pop' }],
          [/./, 'comment'],
        ],

        htmlComment: [
          [/-->/, { token: 'comment', next: '@pop' }],
          [/./, 'comment'],
        ],

        htmlTag: [
          [/>/, 'tag', '@pop'],
          [/[\w-]+/, 'attribute.name'],
          [/=/, 'delimiter'],
          [/"[^"]*"/, 'string'],
          [/'[^']*'/, 'string'],
          [/\s+/, 'white'],
        ],
      },
    })

    // Configure theme colors for Scriban tokens
    monaco.editor.defineTheme('scriban-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
        { token: 'variable', foreground: '001080' },
        { token: 'type.identifier', foreground: '795E26' },
        { token: 'delimiter.bracket', foreground: 'A31515', fontStyle: 'bold' },
        { token: 'constant', foreground: '0000FF' },
        { token: 'number', foreground: '098658' },
        { token: 'string', foreground: 'A31515' },
        { token: 'operator', foreground: '000000' },
        { token: 'comment', foreground: '008000', fontStyle: 'italic' },
        { token: 'tag', foreground: '800000' },
        { token: 'attribute.name', foreground: 'FF0000' },
      ],
      colors: {},
    })

    monaco.editor.defineTheme('scriban-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'type.identifier', foreground: 'DCDCAA' },
        { token: 'delimiter.bracket', foreground: 'DA70D6', fontStyle: 'bold' },
        { token: 'constant', foreground: '569CD6' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'tag', foreground: '569CD6' },
        { token: 'attribute.name', foreground: '9CDCFE' },
      ],
      colors: {},
    })
  }

  // Update code value when prop changes
  useEffect(() => {
    setCodeValue(value)
  }, [value])

  // Update iframe preview content
  useEffect(() => {
    if (showPreview && iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument
      if (iframeDoc) {
        const previewHtml = getPreviewHtml(codeValue)
        iframeDoc.open()
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                  background: ${
                    theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff'
                  };
                  color: ${
                    theme.palette.mode === 'dark' ? '#e0e0e0' : '#000000'
                  };
                  zoom: 0.75;
                  transform-origin: top left;
                }
              </style>
            </head>
            <body>${previewHtml}</body>
          </html>
        `)
        iframeDoc.close()
      }
    }
  }, [showPreview, codeValue, theme.palette.mode])

  // Detect if template has Scriban logic
  const hasScribanLogic = (html: string): boolean => {
    const scribanPatterns = [
      /\{\{-?\s*for\s+/,
      /\{\{-?\s*if\s+/,
      /\{\{-?\s*else/,
      /\{\{-?\s*end\s*-?\}\}/,
      /\{\{-?\s*while\s+/,
    ]
    return scribanPatterns.some((pattern) => pattern.test(html))
  }

  // Strip Scriban syntax for preview (show placeholders)
  const getPreviewHtml = (html: string): string => {
    if (!html)
      return '<p style="color: #999; padding: 20px;">No content to preview</p>'

    // Replace Scriban variables with placeholder values
    let preview = html
      // Replace loops with a single iteration showing placeholder
      .replace(
        /\{\{-?\s*for\s+(\w+)\s+in\s+[\w.]+\s*-?\}\}([\s\S]*?)\{\{-?\s*end\s*-?\}\}/g,
        (match, itemVar, content) => {
          return content.replace(
            new RegExp(`\\{\\{\\s*${itemVar}\\.(\\w+)\\s*\\}\\}`, 'g'),
            '<span style="background: #e3f2fd; padding: 2px 4px; border-radius: 3px;">$1</span>',
          )
        },
      )
      // Replace conditionals - show content
      .replace(
        /\{\{-?\s*if\s+[\s\S]*?-?\}\}([\s\S]*?)\{\{-?\s*end\s*-?\}\}/g,
        '$1',
      )
      // Replace simple variables with placeholders
      .replace(
        /\{\{\s*([\w.]+)\s*\}\}/g,
        '<span style="background: #fff9c4; padding: 2px 4px; border-radius: 3px;">$1</span>',
      )
      // Replace variables with filters
      .replace(
        /\{\{\s*([\w.]+)\s*\|[\s\S]*?\}\}/g,
        '<span style="background: #fff9c4; padding: 2px 4px; border-radius: 3px;">$1</span>',
      )

    return preview
  }

  const handleCodeChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      setCodeValue(newValue)

      // Validate Scriban syntax
      if (hasScribanLogic(newValue)) {
        // Basic validation: check for balanced delimiters
        const opens = (newValue.match(/\{\{-?\s*(for|if|while)/g) || []).length
        const ends = (newValue.match(/\{\{-?\s*end\s*-?\}\}/g) || []).length

        if (opens !== ends) {
          onValidationError?.('Unbalanced Scriban control structures')
        }
      }

      // Call onChange with just the HTML content
      onChange(newValue)
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Info Banner with Preview Toggle */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <Alert
          severity="info"
          icon={<Icon icon="mdi:code-braces" />}
          sx={{ flex: 1 }}
        >
          <AlertTitle>Editor de Plantillas</AlertTitle>
          {showPreview && (
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 1, opacity: 0.8 }}
            >
              La vista previa muestra variables de Scriban como marcadores de
              posición. Use la vista previa del backend para la representación
              real de datos.
            </Typography>
          )}
        </Alert>

        <Tooltip
          title={
            showPreview
              ? 'Ocultar vista previa'
              : 'Mostrar vista previa en vivo'
          }
        >
          <IconButton
            onClick={() => setShowPreview(!showPreview)}
            color={showPreview ? 'primary' : 'default'}
            sx={{
              border: 1,
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Icon
              icon={showPreview ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Editor and Preview Split View */}
      <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
        {/* Monaco Editor */}
        <Box
          sx={{
            flex: showPreview ? 1 : 1,
            width: showPreview ? '50%' : '100%',
            minWidth: 0,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
            height: 600,
          }}
        >
          <MonacoEditor
            height="600px"
            defaultLanguage="scriban-html"
            value={codeValue}
            onChange={handleCodeChange}
            beforeMount={handleEditorWillMount}
            theme={
              theme.palette.mode === 'dark' ? 'scriban-dark' : 'scriban-light'
            }
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              lineNumbers: 'on',
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
              autoIndent: 'full',
              bracketPairColorization: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </Box>

        {/* Live Preview */}
        {showPreview && (
          <Paper
            elevation={1}
            sx={{
              flex: 1,
              width: '50%',
              minWidth: 0,
              height: 600,
              overflow: 'auto',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              backgroundColor:
                theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#252526' : '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                position: 'sticky',
                top: 0,
                zIndex: 1,
              }}
            >
              <Icon icon="mdi:eye-outline" fontSize={20} />
              <Typography variant="subtitle2" fontWeight={600}>
                Live Preview
              </Typography>
              <Typography variant="caption" sx={{ ml: 'auto', opacity: 0.7 }}>
                Scriban placeholders shown
              </Typography>
            </Box>
            <iframe
              ref={iframeRef}
              style={{
                width: '100%',
                height: 'calc(100% - 57px)',
                border: 'none',
                display: 'block',
              }}
              title="Preview"
            />
          </Paper>
        )}
      </Box>
    </Box>
  )
}

export default TemplateEditorTabs
