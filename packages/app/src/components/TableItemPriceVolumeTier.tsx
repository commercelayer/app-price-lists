import { appRoutes } from '#data/routes'
import { isMock, makePriceVolumeTier } from '#mocks'
import { getUpToForForm } from '#utils/tierUpTo'
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
import type { Price, PriceVolumeTier } from '@commercelayer/sdk'

import { useState } from 'react'
import type { KeyedMutator } from 'swr'
import { useLocation, useRoute } from 'wouter'

interface Props {
  resource: PriceVolumeTier
  mutatePrice: KeyedMutator<Price>
}

export const TableItemPriceVolumeTier = withSkeletonTemplate<Props>(
  ({ resource = makePriceVolumeTier(), mutatePrice }) => {
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

    const contextMenuEdit = canUser('update', 'price_volume_tiers') &&
      !isMock(resource) && (
        <DropdownItem
          label='Edit'
          onClick={() => {
            setLocation(
              appRoutes.priceVolumeTierEdit.makePath({
                priceListId,
                priceId,
                tierId: resource.id
              })
            )
          }}
        />
      )

    const contextMenuDivider = canUser('update', 'price_volume_tiers') &&
      canUser('destroy', 'price_volume_tiers') && <DropdownDivider />

    const contextMenuDelete = canUser('destroy', 'price_volume_tiers') && (
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
          <Td>{getUpToForForm(resource?.up_to)}</Td>
          <Td>{resource.formatted_price_amount}</Td>
          <Td align='right'>{contextMenu}</Td>
        </Tr>
        {canUser('destroy', 'price_volume_tiers') && (
          <Overlay>
            <PageLayout
              title={`Confirm that you want to delete the price volume tier with name ${resource.name}.`}
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
                  void sdkClient.price_volume_tiers
                    .delete(resource.id)
                    .then(() => {
                      void mutatePrice()
                      close()
                    })
                    .catch(() => {})
                }}
              >
                Delete price volume tier
              </Button>
            </PageLayout>
          </Overlay>
        )}
      </>
    )
  }
)
