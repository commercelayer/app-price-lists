import type { PriceTierType } from '#types'

import type { PriceTierFormValues } from '#components/PriceTierForm'
import { getFrequenciesForSelect } from './frequencies'

export const getPriceTierSdkResource = (
  type: PriceTierType
): 'price_frequency_tiers' | 'price_volume_tiers' => {
  return type === 'frequency' ? 'price_frequency_tiers' : 'price_volume_tiers'
}

export const getUpToFromForm = (
  formValues: PriceTierFormValues
): number | null => {
  if (formValues.type === 'volume') {
    return null
  }
  const frequency = formValues.up_to
  if (frequency === 'unlimited') {
    return null
  } else if (frequency === 'custom') {
    return parseInt(formValues.up_to_days ?? '')
  } else {
    return parseInt(formValues.up_to)
  }
}

type UpTo = number | null | undefined

export const getUpToForVolumeForm = (upTo: UpTo): string => {
  return parseInt(upTo?.toString() ?? '').toString()
}

export const isUpToForFrequencyFormCustom = (upTo: UpTo): boolean => {
  const frequenciesForSelect = getFrequenciesForSelect()
  const upToString = getUpToForVolumeForm(upTo)
  return (
    upTo != null &&
    frequenciesForSelect.find((freq) => freq.value === upToString) == null
  )
}

export const getUpToForFrequencyForm = (upTo: UpTo): string => {
  const frequenciesForSelect = getFrequenciesForSelect()
  const upToString = getUpToForVolumeForm(upTo)
  const upToInFrequencies = frequenciesForSelect.find(
    (freq) => freq.value === upToString
  )
  if (upTo == null) {
    return 'unlimited'
  } else if (upToInFrequencies != null) {
    return upToInFrequencies.value
  } else {
    return upToString
  }
}

export const getUpToForForm = (upTo: UpTo, type: PriceTierType): string => {
  if (type === 'frequency') {
    return getUpToForFrequencyForm(upTo)
  } else {
    return getUpToForVolumeForm(upTo)
  }
}

export const getUpToForVolumeLabel = (upTo: UpTo): string => {
  return upTo == null ? `♾️` : parseInt(upTo?.toString() ?? '').toString()
}

export const getUpToForFrequencyLabel = (upTo: UpTo): string => {
  const upToAsNumber = parseInt(upTo?.toString() ?? '')
  const frequenciesForSelect = getFrequenciesForSelect()
  const knownFrequency = frequenciesForSelect.find(
    (freq) => parseInt(freq.value) === upToAsNumber
  )
  if (upTo == null) {
    return `♾️`
  } else if (knownFrequency != null) {
    return knownFrequency.label
  } else {
    return `${upToAsNumber} days`
  }
}

export const getUpToForTable = (upTo: UpTo, type: PriceTierType): string => {
  if (type === 'frequency') {
    return getUpToForFrequencyLabel(upTo)
  } else {
    return getUpToForVolumeLabel(upTo)
  }
}
