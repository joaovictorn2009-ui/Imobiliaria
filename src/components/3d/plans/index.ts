import { ALPHAVILLE } from './alphaville'
import type { PlanSpec } from './types'

/** Imóveis com modelo 3D / planta. Para adicionar outro, crie o arquivo da planta e registre aqui. */
export const PLANS = {
  alphaville: ALPHAVILLE,
} satisfies Record<string, PlanSpec>

export type PlanId = keyof typeof PLANS

export function planForProperty(propertyId: string): PlanId | null {
  const found = (Object.keys(PLANS) as PlanId[]).find((id) => PLANS[id].propertyId === propertyId)
  return found ?? null
}
