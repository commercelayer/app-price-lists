import { makePrice } from '#mocks'
import {
  Avatar,
  Badge,
  ListItem,
  Text,
  navigateTo,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Price } from '@commercelayer/sdk'
import { useLocation } from 'wouter'

interface Props {
  resource?: Price
  isLoading?: boolean
  delayMs?: number
}

export const ListItemPrice = withSkeletonTemplate<Props>(
  ({ resource = makePrice() }): JSX.Element | null => {
    const [, setLocation] = useLocation()

    return (
      <ListItem
        tag='a'
        icon={
          <Avatar
            alt={resource.sku?.name ?? ''}
            src={resource.sku?.image_url as `https://${string}`}
          />
        }
        alignItems='center'
        {...navigateTo({
          setLocation,
          destination: {
            app: 'price_lists',
            resourceId: resource.id
          }
        })}
      >
        <div>
          <Text tag='div' weight='medium' size='small' variant='info'>
            {resource.sku?.code}
          </Text>
          <Text tag='div' weight='semibold'>
            {resource.sku?.name}
          </Text>
          {resource.price_frequency_tiers != null ||
            (resource.price_volume_tiers != null && (
              <div className='flex items-center mt-1'>
                {resource.price_frequency_tiers != null && (
                  <Badge variant='teal' icon='calendarBlank'>
                    Frequency pricing
                  </Badge>
                )}
                {resource.price_volume_tiers != null && (
                  <Badge variant='teal' icon='stack'>
                    Volume pricing
                  </Badge>
                )}
              </div>
            ))}
        </div>
        <div>
          <Text tag='div' weight='medium' size='small' variant='info'>
            {resource.formatted_compare_at_amount !==
            resource.formatted_amount ? (
              <s>{resource.formatted_compare_at_amount}</s>
            ) : (
              <>&nbsp;</>
            )}
          </Text>
          <Text tag='div' weight='semibold'>
            {resource.formatted_amount}
          </Text>
        </div>
      </ListItem>
    )
  }
)