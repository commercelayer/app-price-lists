import type { PriceTierFormValues } from '#components/PriceTierForm'
import { getFrequenciesForSelect } from './frequencies'

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

export const getUpToForForm = (upTo: number | null | undefined): number => {
  return parseInt(upTo?.toString() ?? '')
}

export const getUpToForFrequencyLabel = (
  upTo: number | null | undefined
): string => {
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
