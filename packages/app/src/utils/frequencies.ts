import type { PriceTierFormValues } from '#components/PriceTierForm'
import type { PriceFrequencyTier } from '@commercelayer/sdk'
import { getUpToForForm } from './tierUpTo'

interface FrequencyOption {
  value: string
  label: string
}

export const getFrequenciesForSelect = (): FrequencyOption[] => {
  return [
    { value: '0', label: 'Hourly' },
    { value: '1', label: 'Daily' },
    { value: '7', label: 'Weekly' },
    { value: '30', label: 'Monthly' },
    { value: '60', label: 'Two months' },
    { value: '90', label: 'Three months' },
    { value: '120', label: 'Four months' },
    { value: '180', label: 'Six months' },
    { value: '365', label: 'Yearly' },
    { value: 'unlimited', label: 'Unlimited' },
    { value: 'custom', label: 'Custom' }
  ]
}

export const getFrequencyForForm = (
  tier?: PriceFrequencyTier
): Partial<PriceTierFormValues> => {
  const frequenciesForSelect = getFrequenciesForSelect()
  const upTo = getUpToForForm(tier?.up_to).toString()
  if (tier?.up_to == null) {
    return { type: 'frequency', up_to: 'unlimited', up_to_days: '' }
  } else if (frequenciesForSelect.find((freq) => freq.value === upTo) != null) {
    return {
      type: 'frequency',
      up_to: frequenciesForSelect
        .find((freq) => freq.value === upTo)
        ?.value.toString(),
      up_to_days: ''
    }
  } else {
    return {
      type: 'frequency',
      up_to: 'custom',
      up_to_days: upTo.toString()
    }
  }
}
