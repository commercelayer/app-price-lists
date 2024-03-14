import {
  A,
  Button,
  EmptyState,
  useTokenProvider
} from '@commercelayer/app-elements'
import type { FC } from 'react'

export const ListEmptyStatePrice: FC = () => {
  const { canUser } = useTokenProvider()

  if (canUser('create', 'prices')) {
    return (
      <EmptyState
        title='No Prices yet!'
        description='Create your first Price'
        action={<Button variant='primary'>New Price</Button>}
      />
    )
  }

  return (
    <EmptyState
      title='No Prices yet!'
      description={
        <div>
          <p>Add a price with the API, or use the CLI.</p>
          <A
            target='_blank'
            href='https://docs.commercelayer.io/core/v/api-reference/prices'
            rel='noreferrer'
          >
            View API reference.
          </A>
        </div>
      }
    />
  )
}
