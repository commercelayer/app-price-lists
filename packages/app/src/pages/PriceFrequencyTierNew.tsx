import {
  PriceTierForm,
  type PriceTierFormValues
} from '#components/PriceTierForm'
import { appRoutes } from '#data/routes'
import { usePriceDetails } from '#hooks/usePriceDetails'
import { usePriceListDetails } from '#hooks/usePriceListDetails'
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
import { type PriceFrequencyTierCreate } from '@commercelayer/sdk'
import { useState } from 'react'
import { Link, useLocation, useRoute } from 'wouter'

export function PriceFrequencyTierNew(): JSX.Element {
  const {
    canUser,
    settings: { mode }
  } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()
  const [, setLocation] = useLocation()

  const [apiError, setApiError] = useState<any>()
  const [isSaving, setIsSaving] = useState(false)

  const [, params] = useRoute<{ priceListId: string; priceId: string }>(
    appRoutes.priceFrequencyTierNew.path
  )
  const priceListId = params?.priceListId ?? ''
  const priceId = params?.priceId ?? ''
  const { priceList, isLoading, error } = usePriceListDetails(priceListId)
  const {
    price,
    isLoading: isLoadingPrice,
    error: priceError
  } = usePriceDetails(priceId)

  const pageTitle = 'New tier'

  if (
    error != null ||
    priceError != null ||
    (price.price_frequency_tiers != null &&
      price.price_frequency_tiers.length >= 5)
  ) {
    return (
      <PageLayout
        title={pageTitle}
        navigationButton={{
          onClick: () => {
            setLocation(appRoutes.home.makePath({}))
          },
          label: pageTitle,
          icon: 'arrowLeft'
        }}
        mode={mode}
      >
        <EmptyState
          title='Not authorized'
          action={
            <Link href={appRoutes.home.makePath({})}>
              <Button variant='primary'>Go back</Button>
            </Link>
          }
        />
      </PageLayout>
    )
  }

  const goBackUrl = appRoutes.priceDetails.makePath({ priceListId, priceId })

  if (!canUser('create', 'price_frequency_tiers')) {
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
      <SkeletonTemplate isLoading={isLoading || isLoadingPrice}>
        <Spacer bottom='14'>
          <PriceTierForm
            defaultValues={{
              currency_code: priceList.currency_code,
              price: 0,
              type: 'frequency'
            }}
            apiError={apiError}
            isSubmitting={isSaving}
            onSubmit={(formValues) => {
              setIsSaving(true)
              const tier = adaptFormValuesToPriceVolumeTier(formValues, priceId)
              void sdkClient.price_frequency_tiers
                .create(tier)
                .then(() => {
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

function adaptFormValuesToPriceVolumeTier(
  formValues: PriceTierFormValues,
  priceId: string
): PriceFrequencyTierCreate {
  return {
    name: formValues.name,
    up_to: getUpToFromForm(formValues),
    price_amount_cents: formValues.price,
    price: {
      id: priceId,
      type: 'prices'
    }
  }
}
