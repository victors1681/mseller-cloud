// ** Base PDF Template Class and Registry System

import {
  PDFTemplate,
  PDFTemplateComponent,
  PDFTemplateEngine,
  PDFTemplateRegistry,
  TemplateContext,
  TemplateMetadata,
  TemplateNotFoundError,
  TemplateValidationError,
} from '../../types/apps/pdfTemplateTypes'
import {
  BaseStylesComponent,
  BusinessHeaderComponent,
  CustomerInfoComponent,
  DocumentDetailsComponent,
  DocumentHeaderComponent,
  EnhancedItemsTableComponent,
  FooterComponent,
  ItemsTableComponent,
  NotesComponent,
  TotalsSummaryComponent,
} from './components'

// ============================================
// Base PDF Template Class
// ============================================

/**
 * Abstract Base PDF Template
 * All PDF templates should extend this class
 */
export abstract class BasePDFTemplate implements PDFTemplate {
  abstract templateId: string
  abstract templateName: string
  abstract documentTypes: string[]
  abstract version: string

  protected components: Map<string, PDFTemplateComponent> = new Map()

  constructor() {
    // Register default components
    this.registerComponent(new BaseStylesComponent())
    this.registerComponent(new BusinessHeaderComponent())
    this.registerComponent(new DocumentHeaderComponent())
    this.registerComponent(new CustomerInfoComponent())
    this.registerComponent(new ItemsTableComponent())
    this.registerComponent(new TotalsSummaryComponent())
    this.registerComponent(new NotesComponent())
    this.registerComponent(new FooterComponent())

    // Register enhanced components
    this.registerComponent(new DocumentDetailsComponent())
    this.registerComponent(new EnhancedItemsTableComponent())
  }

  /**
   * Register a component for use in this template
   */
  registerComponent(component: PDFTemplateComponent): void {
    this.components.set(component.name, component)
  }

  /**
   * Get a registered component by name
   */
  protected getComponent(name: string): PDFTemplateComponent | undefined {
    return this.components.get(name)
  }

  /**
   * Render a component by name
   */
  protected renderComponent(name: string, context: TemplateContext): string {
    const component = this.getComponent(name)
    if (!component) {
      console.warn(
        `Component '${name}' not found in template '${this.templateId}'`,
      )
      return ''
    }
    return component.render(context)
  }

  /**
   * Main render method - must be implemented by subclasses
   */
  abstract render(context: TemplateContext): string

  /**
   * Validate template context - can be overridden by subclasses
   */
  validate(context: TemplateContext): boolean {
    if (!context.document) {
      return false
    }
    return true
  }

  /**
   * Get template metadata
   */
  getMetadata(): TemplateMetadata {
    return {
      id: this.templateId,
      name: this.templateName,
      description: `Template for ${this.documentTypes.join(', ')} documents`,
      documentTypes: this.documentTypes,
      version: this.version,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  /**
   * Create basic HTML document structure
   */
  protected createHTMLDocument(title: string, content: string): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${this.renderComponent('BaseStyles', {} as TemplateContext)}
      </head>
      <body>
        <div class="container">
          ${content}
        </div>
      </body>
      </html>
    `
  }
}

// ============================================
// Template Registry Implementation
// ============================================

/**
 * PDF Template Registry
 * Manages all registered PDF templates
 */
export class PDFTemplateRegistryImpl implements PDFTemplateRegistry {
  private templates: Map<string, PDFTemplate> = new Map()
  private documentTypeMap: Map<string, string[]> = new Map()

  /**
   * Register a template
   */
  register(template: PDFTemplate): void {
    this.templates.set(template.templateId, template)

    // Update document type mapping
    for (const docType of template.documentTypes) {
      const existing = this.documentTypeMap.get(docType) || []
      if (!existing.includes(template.templateId)) {
        existing.push(template.templateId)
        this.documentTypeMap.set(docType, existing)
      }
    }
  }

  /**
   * Unregister a template
   */
  unregister(templateId: string): void {
    const template = this.templates.get(templateId)
    if (template) {
      // Remove from document type mapping
      for (const docType of template.documentTypes) {
        const existing = this.documentTypeMap.get(docType) || []
        const filtered = existing.filter((id) => id !== templateId)
        if (filtered.length > 0) {
          this.documentTypeMap.set(docType, filtered)
        } else {
          this.documentTypeMap.delete(docType)
        }
      }

      this.templates.delete(templateId)
    }
  }

  /**
   * Get template by document type and optional template ID
   */
  getTemplate(documentType: string, templateId?: string): PDFTemplate | null {
    if (templateId) {
      const template = this.templates.get(templateId)
      if (template && template.documentTypes.includes(documentType)) {
        return template
      }
      return null
    }

    // Get first available template for document type
    const availableTemplates = this.documentTypeMap.get(documentType)
    if (availableTemplates && availableTemplates.length > 0) {
      const template = this.templates.get(availableTemplates[0])
      return template || null
    }

    return null
  }

  /**
   * Get available templates metadata
   */
  getAvailableTemplates(documentType?: string): TemplateMetadata[] {
    const templates = Array.from(this.templates.values())

    if (documentType) {
      return templates
        .filter((template) => template.documentTypes.includes(documentType))
        .map((template) => template.getMetadata())
    }

    return templates.map((template) => template.getMetadata())
  }

  /**
   * Check if template exists
   */
  hasTemplate(templateId: string): boolean {
    return this.templates.has(templateId)
  }

  /**
   * Get all registered templates
   */
  getAllTemplates(): PDFTemplate[] {
    return Array.from(this.templates.values())
  }

  /**
   * Get templates by document type
   */
  getTemplatesByDocumentType(documentType: string): PDFTemplate[] {
    const templateIds = this.documentTypeMap.get(documentType) || []
    return templateIds
      .map((id) => this.templates.get(id))
      .filter((template): template is PDFTemplate => template !== undefined)
  }
}

// ============================================
// Template Engine Implementation
// ============================================

/**
 * PDF Template Engine
 * Handles template rendering and component management
 */
export class PDFTemplateEngineImpl implements PDFTemplateEngine {
  private registry: PDFTemplateRegistry
  private globalComponents: Map<string, PDFTemplateComponent> = new Map()

  constructor(registry: PDFTemplateRegistry) {
    this.registry = registry
  }

  /**
   * Render template by ID
   */
  async render(templateId: string, context: TemplateContext): Promise<string> {
    const template = this.registry
      .getAllTemplates()
      .find((t: PDFTemplate) => t.templateId === templateId)
    if (!template) {
      throw new TemplateNotFoundError(templateId)
    }

    return this.renderTemplate(template, context)
  }

  /**
   * Render template directly
   */
  async renderTemplate(
    template: PDFTemplate,
    context: TemplateContext,
  ): Promise<string> {
    // Debug: Template rendering started
    console.log('renderTemplate:', template.templateId)

    // Validate context
    if (!template.validate(context)) {
      console.error('Template validation failed for:', template.templateId)
      throw new TemplateValidationError(template.templateId, [
        'Invalid context data',
      ])
    }

    // Add metadata to context
    const enrichedContext: TemplateContext = {
      ...context,
      metadata: {
        generatedAt: new Date().toISOString(),
        version: template.version,
        templateId: template.templateId,
        ...context.metadata,
      },
    }

    try {
      const result = template.render(enrichedContext)
      console.log('Template rendered successfully, HTML length:', result.length)
      return result
    } catch (error) {
      console.error(`Error rendering template '${template.templateId}':`, error)
      throw error
    }
  }

  /**
   * Register template in the registry
   */
  registerTemplate(template: PDFTemplate): void {
    this.registry.register(template)
  }

  /**
   * Register global component
   */
  registerComponent(component: PDFTemplateComponent): void {
    this.globalComponents.set(component.name, component)
  }

  /**
   * Get global component
   */
  getGlobalComponent(name: string): PDFTemplateComponent | undefined {
    return this.globalComponents.get(name)
  }
}

// ============================================
// Singleton Instance
// ============================================

// Create singleton instances
export const templateRegistry = new PDFTemplateRegistryImpl()
export const templateEngine = new PDFTemplateEngineImpl(templateRegistry)

// Export for easy access
export { templateEngine as engine, templateRegistry as registry }