import {
  PriceTierForm,
  type PriceTierFormValues
} from '#components/PriceTierForm'
import { appRoutes } from '#data/routes'
import { usePriceDetails } from '#hooks/usePriceDetails'
import { usePriceListDetails } from '#hooks/usePriceListDetails'
import {
  Button,
  EmptyState,
  PageLayout,
  SkeletonTemplate,
  Spacer,
  useCoreSdkProvider,
  useTokenProvider
} from '@commercelayer/app-elements'
import { type PriceVolumeTierCreate } from '@commercelayer/sdk'
import { useState } from 'react'
import { Link, useLocation, useRoute } from 'wouter'

export function PriceVolumeTierNew(): JSX.Element {
  const {
    canUser,
    settings: { mode }
  } = useTokenProvider()
  const { sdkClient } = useCoreSdkProvider()
  const [, setLocation] = useLocation()

  const [apiError, setApiError] = useState<any>()
  const [isSaving, setIsSaving] = useState(false)

  const [, params] = useRoute<{ priceListId: string; priceId: string }>(
    appRoutes.priceVolumeTierNew.path
  )
  const priceListId = params?.priceListId ?? ''
  const priceId = params?.priceId ?? ''
  const { priceList, error } = usePriceListDetails(priceListId)
  const {
    price,
    isLoading,
    error: priceError,
    mutatePrice
  } = usePriceDetails(priceId)

  const pageTitle = 'New tier'

  if (
    error != null ||
    priceError != null ||
    (price.price_volume_tiers != null && price.price_volume_tiers.length >= 5)
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

  if (!canUser('create', 'price_volume_tiers')) {
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
      <SkeletonTemplate isLoading={isLoading}>
        <Spacer bottom='14'>
          <PriceTierForm
            defaultValues={{
              currency_code: priceList.currency_code,
              price: 0,
              type: 'volume'
            }}
            apiError={apiError}
            isSubmitting={isSaving}
            onSubmit={(formValues) => {
              setIsSaving(true)
              const tier = adaptFormValuesToPriceVolumeTier(formValues, priceId)
              void sdkClient.price_volume_tiers
                .create(tier)
                .then(() => {
                  void mutatePrice()
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
): PriceVolumeTierCreate {
  return {
    name: formValues.name,
    up_to: formValues.type === 'volume' ? parseInt(formValues.up_to) : 0,
    price_amount_cents: formValues.price,
    price: {
      id: priceId,
      type: 'prices'
    }
  }
}
