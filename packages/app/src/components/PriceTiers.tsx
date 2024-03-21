import { appRoutes } from '#data/routes'
import { makePrice } from '#mocks'
import type { PriceTierType } from '#types'
import { getPriceTierSdkResource } from '#utils/priceTiers'
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
  type: PriceTierType
}

export const PriceTiers: FC<Props> = ({
  price = makePrice(),
  mutatePrice,
  type
}) => {
  const [, setLocation] = useLocation()
  const [, params] = useRoute<{ priceListId: string; priceId: string }>(
    appRoutes.priceDetails.path
  )
  const priceListId = params?.priceListId ?? ''
  const sectionTitle = `${type.charAt(0).toUpperCase()}${type.slice(1)} pricing`
  const sdkResource = getPriceTierSdkResource(type)
  const priceTiers = price[sdkResource]
  const buttonCardCtaPathName =
    type === 'frequency' ? 'priceFrequencyTierNew' : 'priceVolumeTierNew'
  const buttonCardIcon = type === 'frequency' ? 'calendarBlank' : 'stack'
  const buttonCardText =
    type === 'frequency' ? (
      <>
        <a>Add frequency tiers</a> to establish variable pricing for specific
        intervals based on the frequency of purchase.
      </>
    ) : (
      <>
        <a>Add volume tiers</a> to enable flexible price adjustments based on
        the quantities purchased
      </>
    )

  return (
    <Section
      title={sectionTitle}
      border='none'
      actionButton={
        priceTiers != null &&
        priceTiers.length > 0 &&
        priceTiers.length <= 5 && (
          <Link
            href={appRoutes[buttonCardCtaPathName].makePath({
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
          icon={buttonCardIcon}
          padding='6'
          onClick={() => {
            setLocation(
              appRoutes[buttonCardCtaPathName].makePath({
                priceListId,
                priceId: price.id
              })
            )
          }}
        >
          <Text align='left' variant='info'>
            {buttonCardText}
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
              {priceTiers?.map((tier) => (
                <TableItemPriceTier
                  key={tier.id}
                  resource={tier}
                  type={type}
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
