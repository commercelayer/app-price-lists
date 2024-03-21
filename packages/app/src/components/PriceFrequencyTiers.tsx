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

export const PriceFrequencyTiers: FC<Props> = ({
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
      title='Frequency pricing'
      border='none'
      actionButton={
        price.price_frequency_tiers != null &&
        price.price_frequency_tiers.length > 0 &&
        price.price_frequency_tiers.length <= 5 && (
          <Link
            href={appRoutes.priceFrequencyTierNew.makePath({
              priceListId,
              priceId: price.id
            })}
          >
            Add tier (up to 5)
          </Link>
        )
      }
    >
      {price.price_frequency_tiers == null ||
      price.price_frequency_tiers?.length === 0 ? (
        <ButtonCard
          icon='calendarBlank'
          padding='6'
          onClick={() => {
            setLocation(
              appRoutes.priceFrequencyTierNew.makePath({
                priceListId,
                priceId: price.id
              })
            )
          }}
        >
          <Text align='left' variant='info'>
            <a>Add frequency tiers</a> to establish variable pricing for
            specific intervals based on the frequency of purchase.
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
              {price.price_frequency_tiers.map((tier) => (
                <TableItemPriceTier
                  key={tier.id}
                  resource={tier}
                  type='frequency'
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
