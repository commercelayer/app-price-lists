import { isMockedId, makePriceVolumeTier } from '#mocks'
import { useCoreApi } from '@commercelayer/app-elements'
import type { PriceVolumeTier } from '@commercelayer/sdk'
import type { KeyedMutator } from 'swr'

export function usePriceVolumeTierDetails(id: string): {
  tier: PriceVolumeTier
  isLoading: boolean
  error: any
  mutateTier: KeyedMutator<PriceVolumeTier>
} {
  const {
    data: tier,
    isLoading,
    error,
    mutate: mutateTier
  } = useCoreApi(
    'price_volume_tiers',
    'retrieve',
    !isMockedId(id) ? [id] : null,
    {
      fallbackData: makePriceVolumeTier()
    }
  )

  return { tier, error, isLoading, mutateTier }
}
