import type { PriceFrequencyTier, PriceVolumeTier } from '@commercelayer/sdk'

export const makePriceVolumeTier = (): PriceVolumeTier => {
  return {
    type: 'price_volume_tiers',
    id: '',
    created_at: '',
    updated_at: '',
    name: 'UpTo100',
    price_amount_cents: 0,
    up_to: 100
  }
}

export const makePriceFrequencyTier = (): PriceFrequencyTier => {
  return {
    type: 'price_frequency_tiers',
    id: '',
    created_at: '',
    updated_at: '',
    name: 'Weekly',
    price_amount_cents: 0,
    up_to: 7
  }
}
