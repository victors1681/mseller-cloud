// ** ConfiguracionEmpresa Types for Business Configuration Module

// ============================================
// Enums
// ============================================

export enum TipoComprobanteFiscal {
  Ninguno = 0, // None
  NCF = 1, // Número de Comprobante Fiscal
  ECF = 2, // e-Comprobante Fiscal
}

// ============================================
// Main Entity
// ============================================

export interface ConfiguracionEmpresa {
  id: string
  businessId: string
  codigoPais: string
  codigoMoneda: string
  zonaHoraria: string
  codigoIdioma: string
  formatoFecha: string
  separadorDecimal: string
  separadorMiles: string
  tipoComprobanteFiscal: TipoComprobanteFiscal
  diasMaximosDevolucionITBIS: number | null
  creadoPor: string
  fechaCreacion: string
  actualizadoPor: string | null
  fechaActualizacion: string | null
}

// ============================================
// Request/Response Types
// ============================================

export interface CreateConfiguracionRequest {
  codigoPais: string
  codigoMoneda: string
  zonaHoraria: string
  codigoIdioma?: string
  formatoFecha?: string
  separadorDecimal?: string
  separadorMiles?: string
  tipoComprobanteFiscal: TipoComprobanteFiscal
  diasMaximosDevolucionITBIS: number | null
}

export interface UpdateConfiguracionRequest {
  codigoPais?: string
  codigoMoneda?: string
  zonaHoraria?: string
  codigoIdioma?: string
  formatoFecha?: string
  separadorDecimal?: string
  separadorMiles?: string
  tipoComprobanteFiscal?: TipoComprobanteFiscal
  diasMaximosDevolucionITBIS?: number | null
}

// ============================================
// Store State
// ============================================

export interface ConfiguracionEmpresaState {
  data: ConfiguracionEmpresa | null
  loading: boolean
  error: string | null
  hasConfiguration: boolean
}

// ============================================
// Validation
// ============================================

export interface ReturnValidationResult {
  canProcessReturn: boolean
  canRefundITBIS: boolean
  message?: string
  diasTranscurridos?: number
  diasMaximos?: number | null
}

// ============================================
// Country Defaults
// ============================================

export interface CountryDefaults {
  codigoPais: string
  codigoMoneda: string
  zonaHoraria: string
  codigoIdioma: string
  formatoFecha: string
  separadorDecimal: string
  separadorMiles: string
  tipoComprobanteFiscal: TipoComprobanteFiscal
  diasMaximosDevolucionITBIS: number | null
}

export interface CountryOption {
  code: string
  name: string
  currency: string
  timezone: string
  language: string
}

export interface CurrencyOption {
  code: string
  name: string
  symbol: string
}

export interface TimezoneOption {
  value: string
  label: string
}

// ============================================
// Helper Constants
// ============================================

export const COUNTRY_DEFAULTS: Record<string, CountryDefaults> = {
  DO: {
    codigoPais: 'DO',
    codigoMoneda: 'DOP',
    zonaHoraria: 'America/Santo_Domingo',
    codigoIdioma: 'es-DO',
    formatoFecha: 'dd/MM/yyyy',
    separadorDecimal: '.',
    separadorMiles: ',',
    tipoComprobanteFiscal: TipoComprobanteFiscal.NCF,
    diasMaximosDevolucionITBIS: 30,
  },
  US: {
    codigoPais: 'US',
    codigoMoneda: 'USD',
    zonaHoraria: 'America/New_York',
    codigoIdioma: 'en-US',
    formatoFecha: 'MM/dd/yyyy',
    separadorDecimal: '.',
    separadorMiles: ',',
    tipoComprobanteFiscal: TipoComprobanteFiscal.Ninguno,
    diasMaximosDevolucionITBIS: null,
  },
  MX: {
    codigoPais: 'MX',
    codigoMoneda: 'MXN',
    zonaHoraria: 'America/Mexico_City',
    codigoIdioma: 'es-MX',
    formatoFecha: 'dd/MM/yyyy',
    separadorDecimal: '.',
    separadorMiles: ',',
    tipoComprobanteFiscal: TipoComprobanteFiscal.Ninguno,
    diasMaximosDevolucionITBIS: null,
  },
}

export const TIPO_COMPROBANTE_LABELS: Record<TipoComprobanteFiscal, string> = {
  [TipoComprobanteFiscal.Ninguno]: 'Ninguno (No Aplica)',
  [TipoComprobanteFiscal.NCF]: 'NCF (Número de Comprobante Fiscal)',
  [TipoComprobanteFiscal.ECF]: 'ECF (e-Comprobante Fiscal)',
}

export const TAX_LABEL_BY_COUNTRY: Record<string, string> = {
  DO: 'ITBIS',
  MX: 'IVA',
  US: 'Tax',
}

export const COUNTRIES: CountryOption[] = [
  {
    code: 'DO',
    name: 'República Dominicana',
    currency: 'DOP',
    timezone: 'America/Santo_Domingo',
    language: 'es-DO',
  },
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en-US',
  },
  {
    code: 'MX',
    name: 'México',
    currency: 'MXN',
    timezone: 'America/Mexico_City',
    language: 'es-MX',
  },
]

export const CURRENCIES: CurrencyOption[] = [
  { code: 'DOP', name: 'Peso Dominicano', symbol: 'RD$' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
]

export const TIMEZONES: TimezoneOption[] = [
  { value: 'America/Santo_Domingo', label: 'America/Santo Domingo (GMT-4)' },
  { value: 'America/New_York', label: 'America/New York (GMT-5)' },
  { value: 'America/Mexico_City', label: 'America/Mexico City (GMT-6)' },
]
