import { makePriceList } from '#mocks'
import {
  Icon,
  ListItem,
  Text,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { PriceList } from '@commercelayer/sdk'

interface Props {
  resource?: PriceList
  isLoading?: boolean
  delayMs?: number
}

export const ListItemPriceList = withSkeletonTemplate<Props>(
  ({ resource = makePriceList() }): JSX.Element | null => {
    return (
      <ListItem className='items-center' tag='div'>
        <div>
          <Text weight='bold'>{resource.name}</Text>
        </div>
        <Icon name='caretRight' />
      </ListItem>
    )
  }
)
