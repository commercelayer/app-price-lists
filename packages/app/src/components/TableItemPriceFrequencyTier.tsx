import { appRoutes } from '#data/routes'
import { isMock, makePriceFrequencyTier } from '#mocks'
import { getUpToForFrequencyLabel } from '#utils/tierUpTo'
import {
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Icon,
  PageLayout,
  Td,
  Tr,
  useCoreSdkProvider,
  useOverlay,
  useTokenProvider,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Price, PriceFrequencyTier } from '@commercelayer/sdk'

import { useState } from 'react'
import type { KeyedMutator } from 'swr'
import { useLocation, useRoute } from 'wouter'

interface Props {
  resource: PriceFrequencyTier
  mutatePrice: KeyedMutator<Price>
}

export const TableItemPriceFrequencyTier = withSkeletonTemplate<Props>(
  ({ resource = makePriceFrequencyTier(), mutatePrice }) => {
    const [, params] = useRoute<{ priceListId: string; priceId: string }>(
      appRoutes.priceDetails.path
    )
    const priceListId = params?.priceListId ?? ''
    const priceId = params?.priceId ?? ''

    const [, setLocation] = useLocation()
    const { canUser } = useTokenProvider()
    const { sdkClient } = useCoreSdkProvider()

    const { Overlay, open, close } = useOverlay()

    const [isDeleteting, setIsDeleting] = useState(false)

    const contextMenuEdit = canUser('update', 'price_frequency_tiers') &&
      !isMock(resource) && (
        <DropdownItem
          label='Edit'
          onClick={() => {
            setLocation(
              appRoutes.priceFrequencyTierEdit.makePath({
                priceListId,
                priceId,
                tierId: resource.id
              })
            )
          }}
        />
      )

    const contextMenuDivider = canUser('update', 'price_frequency_tiers') &&
      canUser('destroy', 'price_frequency_tiers') && <DropdownDivider />

    const contextMenuDelete = canUser('destroy', 'price_frequency_tiers') && (
      <DropdownItem
        label='Delete'
        onClick={() => {
          open()
        }}
      />
    )

    const contextMenu = (
      <Dropdown
        dropdownLabel={<Icon name='dotsThree' size={24} />}
        dropdownItems={
          <>
            {contextMenuEdit}
            {contextMenuDivider}
            {contextMenuDelete}
          </>
        }
      />
    )

    return (
      <>
        <Tr key={resource.id}>
          <Td>{resource.name}</Td>
          <Td>{getUpToForFrequencyLabel(resource?.up_to)}</Td>
          <Td>{resource.formatted_price_amount}</Td>
          <Td>{contextMenu}</Td>
        </Tr>
        {canUser('destroy', 'price_frequency_tiers') && (
          <Overlay>
            <PageLayout
              title={`Confirm that you want to delete the price frequency tier with name ${resource.name}.`}
              description='This action cannot be undone, proceed with caution.'
              minHeight={false}
              navigationButton={{
                label: 'Cancel',
                icon: 'x',
                onClick: () => {
                  close()
                }
              }}
            >
              <Button
                variant='danger'
                size='small'
                disabled={isDeleteting}
                onClick={(e) => {
                  setIsDeleting(true)
                  e.stopPropagation()
                  void sdkClient.price_frequency_tiers
                    .delete(resource.id)
                    .then(() => {
                      void mutatePrice()
                      close()
                    })
                    .catch(() => {})
                }}
              >
                Delete price frequency tier
              </Button>
            </PageLayout>
          </Overlay>
        )}
      </>
    )
  }
)
