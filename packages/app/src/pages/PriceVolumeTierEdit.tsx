import {
  PriceTierForm,
  type PriceTierFormValues
} from '#components/PriceTierForm'
import { appRoutes } from '#data/routes'
import { usePriceListDetails } from '#hooks/usePriceListDetails'
import { usePriceVolumeTierDetails } from '#hooks/usePriceVolumeTierDetails'
import { getUpToForForm } from '#utils/tierUpTo'
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
  type PriceList,
  type PriceVolumeTier,
  type PriceVolumeTierUpdate
} from '@commercelayer/sdk'
import { useState } from 'react'
import { Link, useLocation, useRoute } from 'wouter'

export function PriceVolumeTierEdit(): JSX.Element {
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
  }>(appRoutes.priceVolumeTierEdit.path)
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
  } = usePriceVolumeTierDetails(tierId)

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

  if (!canUser('update', 'price_volume_tiers')) {
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
            defaultValues={adaptPriceVolumeTierToFormValues(tier, priceList)}
            apiError={apiError}
            isSubmitting={isSaving}
            onSubmit={(formValues) => {
              setIsSaving(true)
              const tier = adaptFormValuesToPriceVolumeTier(formValues, priceId)
              void sdkClient.price_volume_tiers
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

function adaptPriceVolumeTierToFormValues(
  tier: PriceVolumeTier,
  priceList?: PriceList
): PriceTierFormValues {
  return {
    id: tier.id,
    name: tier.name ?? '',
    up_to: getUpToForForm(tier.up_to).toString(),
    currency_code: priceList?.currency_code ?? '',
    price: tier.price_amount_cents,
    type: 'volume'
  }
}

function adaptFormValuesToPriceVolumeTier(
  formValues: PriceTierFormValues,
  priceId: string
): PriceVolumeTierUpdate {
  return {
    id: formValues.id ?? '',
    name: formValues.name,
    up_to: formValues.type === 'volume' ? parseInt(formValues.up_to) : 0,
    price_amount_cents: formValues.price,
    price: {
      id: priceId,
      type: 'prices'
    }
  }
}
