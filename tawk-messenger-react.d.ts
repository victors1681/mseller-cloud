declare module '@tawk.to/tawk-messenger-react' {
  import { ComponentType, RefObject } from 'react'

  export interface TawkMessengerProps {
    propertyId: string
    widgetId: string
    ref?: RefObject<TawkMessengerRef>
    tawkOnLoad?: () => void
    tawkOnStatusChange?: (status: string) => void
    tawkOnBeforeLoad?: () => void
    tawkOnChatMaximized?: () => void
    tawkOnChatMinimized?: () => void
    tawkOnChatHidden?: () => void
    tawkOnChatStarted?: () => void
    tawkOnChatEnded?: () => void
    tawkOnPrechatSubmit?: (data: any) => void
    tawkOnOfflineSubmit?: (data: any) => void
    tawkOnChatMessageVisitor?: (message: string) => void
    tawkOnChatMessageAgent?: (message: string) => void
    tawkOnChatMessageSystem?: (message: string) => void
    tawkOnAgentJoinChat?: (data: any) => void
    tawkOnAgentLeaveChat?: (data: any) => void
    tawkOnChatSatisfaction?: (satisfaction: string) => void
    tawkOnVisitorNameChanged?: (visitorName: string) => void
    tawkOnFileUpload?: (link: string) => void
    tawkOnTagsUpdated?: (tags: string[]) => void
    tawkOnUnreadCountChanged?: (unreadCount: number) => void
    autoStart?: boolean
    customStyle?: {
      zIndex?: number | string
      visibility?: {
        desktop?: {
          xOffset?: string | number
          yOffset?: string | number
          position?: 'br' | 'bl' | 'cr' | 'cl' | 'tr' | 'tl'
        }
        mobile?: {
          xOffset?: string | number
          yOffset?: string | number
          position?: 'br' | 'bl' | 'cr' | 'cl' | 'tr' | 'tl'
        }
      }
    }
  }

  export interface TawkMessengerRef {
    tawkMaximize: () => void
    tawkMinimize: () => void
    tawkToggle: () => void
    tawkPopup: () => void
    tawkShowWidget: () => void
    tawkHideWidget: () => void
    tawkToggleVisibility: () => void
    tawkGetWindowType: () => string
    tawkEndChat: () => void
    tawkSetAttributes: (
      attributes: Record<string, any>,
      callback?: (error: any) => void,
    ) => void
    tawkAddEvent: (
      event: string,
      metadata?: Record<string, any>,
      callback?: (error: any) => void,
    ) => void
    tawkAddTags: (tags: string[], callback?: (error: any) => void) => void
    tawkRemoveTags: (tags: string[], callback?: (error: any) => void) => void
    tawkOnLoaded: () => boolean | undefined
    tawkOnBeforeLoaded: () => boolean | undefined
    tawkWidgetPosition: () => string
    tawkGetStatus: () => 'online' | 'away' | 'offline'
    tawkIsChatMaximized: () => boolean
    tawkIsChatMinimized: () => boolean
    tawkIsChatHidden: () => boolean
    tawkIsChatOngoing: () => boolean
    tawkIsVisitorEngaged: () => boolean
    tawkVisitor: (visitorData: {
      name: string
      email: string
      hash?: string
    }) => void
    start: () => void
    shutdown: () => void
    switchWidget: (
      options: { propertyId: string; widgetId: string },
      callback?: () => void,
    ) => void
  }

  const TawkMessengerReact: ComponentType<TawkMessengerProps>
  export default TawkMessengerReact
}
