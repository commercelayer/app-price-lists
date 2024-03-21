import { appRoutes } from '#data/routes'
import { makePrice } from '#mocks'
import {
  ButtonCard,
  Section,
  Table,
  Text,
  Th,
  Tr
} from '@commercelayer/app-elements'
import type { Price } from '@commercelayer/sdk'
import type { FC } from 'react'
import type { KeyedMutator } from 'swr'
import { Link, useLocation, useRoute } from 'wouter'
import { TableItemPriceTier } from './TableItemPriceTier'

interface Props {
  price: Price
  mutatePrice: KeyedMutator<Price>
}

export const PriceVolumeTiers: FC<Props> = ({
  price = makePrice(),
  mutatePrice
}) => {
  const [, setLocation] = useLocation()
  const [, params] = useRoute<{ priceListId: string; priceId: string }>(
    appRoutes.priceDetails.path
  )
  const priceListId = params?.priceListId ?? ''

  return (
    <Section
      title='Volume pricing'
      border='none'
      actionButton={
        price.price_volume_tiers != null &&
        price.price_volume_tiers.length > 0 &&
        price.price_volume_tiers.length <= 5 && (
          <Link
            href={appRoutes.priceVolumeTierNew.makePath({
              priceListId,
              priceId: price.id
            })}
          >
            Add tier (up to 5)
          </Link>
        )
      }
    >
      {price.price_volume_tiers == null ||
      price.price_volume_tiers?.length === 0 ? (
        <ButtonCard
          icon='stack'
          padding='6'
          onClick={() => {
            setLocation(
              appRoutes.priceVolumeTierNew.makePath({
                priceListId,
                priceId: price.id
              })
            )
          }}
        >
          <Text align='left' variant='info'>
            <a>Add volume tiers</a> to enable flexible price adjustments based
            on the quantities purchased.
          </Text>
        </ButtonCard>
      ) : (
        <Table
          thead={
            <Tr>
              <Th>Name</Th>
              <Th>Up to</Th>
              <Th>Price</Th>
              <Th> </Th>
            </Tr>
          }
          tbody={
            <>
              {price.price_volume_tiers.map((tier) => (
                <TableItemPriceTier
                  key={tier.id}
                  resource={tier}
                  type='volume'
                  mutatePrice={mutatePrice}
                />
              ))}
            </>
          }
        />
      )}
    </Section>
  )
}
