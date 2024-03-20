import { isMockedId, makePriceFrequencyTier } from '#mocks'
import { useCoreApi } from '@commercelayer/app-elements'
import type { PriceFrequencyTier } from '@commercelayer/sdk'
import type { KeyedMutator } from 'swr'

export function usePriceFrequencyTierDetails(id: string): {
  tier: PriceFrequencyTier
  isLoading: boolean
  error: any
  mutateTier: KeyedMutator<PriceFrequencyTier>
} {
  const {
    data: tier,
    isLoading,
    error,
    mutate: mutateTier
  } = useCoreApi(
    'price_frequency_tiers',
    'retrieve',
    !isMockedId(id) ? [id] : null,
    {
      fallbackData: makePriceFrequencyTier()
    }
  )

  return { tier, error, isLoading, mutateTier }
}
