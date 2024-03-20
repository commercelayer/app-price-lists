import {
  PriceTierForm,
  type PriceTierFormValues
} from '#components/PriceTierForm'
import { appRoutes } from '#data/routes'
import { usePriceFrequencyTierDetails } from '#hooks/usePriceFrequencyTierDetails'
import { usePriceListDetails } from '#hooks/usePriceListDetails'
import { getFrequencyForForm } from '#utils/frequencies'
import { getUpToFromForm } from '#utils/tierUpTo'
import {
  Button,
  EmptyState,
  PageLayout,
  SkeletonTemplate,
  Spacer,
  useCoreSdkProvider,
  useTokenProvider
} from '@commercelayer/app-elements'
import {
  type PriceFrequencyTier,
  type PriceFrequencyTierUpdate,
  type PriceList
} from '@commercelayer/sdk'
import { useState } from 'react'
import { Link, useLocation, useRoute } from 'wouter'

export function PriceFrequencyTierEdit(): JSX.Element {
  const {
    canUser,
    settings: { mode }
  } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()
  const [, setLocation] = useLocation()

  const [apiError, setApiError] = useState<any>()
  const [isSaving, setIsSaving] = useState(false)

  const [, params] = useRoute<{
    priceListId: string
    priceId: string
    tierId: string
  }>(appRoutes.priceFrequencyTierEdit.path)

  const priceListId = params?.priceListId ?? ''
  const priceId = params?.priceId ?? ''
  const tierId = params?.tierId ?? ''
  const {
    priceList,
    error,
    isLoading: isLoadingPriceList
  } = usePriceListDetails(priceListId)
  const {
    tier,
    isLoading: isLoadingTier,
    error: errorTier,
    mutateTier
  } = usePriceFrequencyTierDetails(tierId)

  const pageTitle = 'Edit tier'

  if (error != null || errorTier != null) {
    return (
      <PageLayout
        title={pageTitle}
        navigationButton={{
          onClick: () => {
            setLocation(
              appRoutes.priceDetails.makePath({ priceListId, priceId })
            )
          },
          label: pageTitle,
          icon: 'arrowLeft'
        }}
        mode={mode}
      >
        <EmptyState
          title='Not authorized'
          action={
            <Link
              href={appRoutes.priceDetails.makePath({ priceListId, priceId })}
            >
              <Button variant='primary'>Go back</Button>
            </Link>
          }
        />
      </PageLayout>
    )
  }

  const goBackUrl = appRoutes.priceDetails.makePath({ priceListId, priceId })

  if (!canUser('update', 'price_frequency_tiers')) {
    return (
      <PageLayout
        title={pageTitle}
        navigationButton={{
          onClick: () => {
            setLocation(goBackUrl)
          },
          label: 'Cancel',
          icon: 'x'
        }}
        scrollToTop
        overlay
      >
        <EmptyState
          title='Permission Denied'
          description='You are not authorized to access this page.'
          action={
            <Link href={goBackUrl}>
              <Button variant='primary'>Go back</Button>
            </Link>
          }
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title={pageTitle}
      navigationButton={{
        onClick: () => {
          setLocation(goBackUrl)
        },
        label: 'Cancel',
        icon: 'x'
      }}
      gap='only-top'
      scrollToTop
      overlay
    >
      <SkeletonTemplate isLoading={isLoadingPriceList || isLoadingTier}>
        <Spacer bottom='14'>
          <PriceTierForm
            defaultValues={adaptPriceFrequencyTierToFormValues(tier, priceList)}
            apiError={apiError}
            isSubmitting={isSaving}
            onSubmit={(formValues) => {
              setIsSaving(true)
              const tier = adaptFormValuesToPriceFrequencyTier(
                formValues,
                priceId
              )
              void sdkClient.price_frequency_tiers
                .update(tier)
                .then((updatedTier) => {
                  void mutateTier({ ...updatedTier })
                  setLocation(
                    appRoutes.priceDetails.makePath({
                      priceListId,
                      priceId
                    })
                  )
                })
                .catch((error) => {
                  setApiError(error)
                  setIsSaving(false)
                })
            }}
          />
        </Spacer>
      </SkeletonTemplate>
    </PageLayout>
  )
}

function adaptPriceFrequencyTierToFormValues(
  tier?: PriceFrequencyTier,
  priceList?: PriceList
): PriceTierFormValues {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const frequencyForForm = getFrequencyForForm(tier)
  return {
    id: tier?.id,
    name: tier?.name ?? '',
    up_to:
      frequencyForForm.type === 'frequency' ? frequencyForForm.up_to ?? '' : '',
    up_to_days:
      frequencyForForm.type === 'frequency'
        ? frequencyForForm.up_to_days ?? ''
        : '',
    currency_code: priceList?.currency_code ?? '',
    price: tier?.price_amount_cents ?? 0,
    type: 'frequency'
  }
}

function adaptFormValuesToPriceFrequencyTier(
  formValues: PriceTierFormValues,
  priceId: string
): PriceFrequencyTierUpdate {
  return {
    id: formValues.id ?? '',
    name: formValues.name,
    up_to: getUpToFromForm(formValues),
    price_amount_cents: formValues.price,
    price: {
      id: priceId,
      type: 'prices'
    }
  }
}
