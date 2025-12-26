import { UserTypes } from 'src/types/apps/userTypes'

/**
 * Check if a specific AI agent is enabled for the user's business
 * @param user - The user object containing business configuration
 * @param agentName - The name of the AI agent to check (e.g., 'Portal Agent')
 * @returns boolean - True if the agent is enabled, false otherwise
 */
export const isAIAgentEnabled = (
  user: UserTypes | null | undefined,
  agentName: string,
): boolean => {
  if (!user?.business?.config?.aiAgents) {
    return false
  }

  const agent = user.business.config.aiAgents.find(
    (agent) => agent.agentName === agentName && agent.enabled === true,
  )

  return !!agent
}

/**
 * Get the workflow ID for a specific AI agent
 * @param user - The user object containing business configuration
 * @param agentName - The name of the AI agent
 * @returns string | null - The workflow ID if found and enabled, null otherwise
 */
export const getAIAgentWorkflowId = (
  user: UserTypes | null | undefined,
  agentName: string,
): string | null => {
  if (!user?.business?.config?.aiAgents) {
    return null
  }

  const agent = user.business.config.aiAgents.find(
    (agent) => agent.agentName === agentName && agent.enabled === true,
  )

  return agent?.workflowId || null
}
