import { ListItemPriceList } from '#components/ListItemPriceList'
import { instructions } from '#data/filters'
import { appRoutes } from '#data/routes'
import {
  Button,
  EmptyState,
  HomePageLayout,
  useResourceFilters,
  useTokenProvider
} from '@commercelayer/app-elements'
import { Link } from 'wouter'
import { navigate, useSearch } from 'wouter/use-browser-location'

export function Home(): JSX.Element {
  const { canUser } = useTokenProvider()
  const queryString = useSearch()

  const { SearchWithNav, FilteredList, hasActiveFilter } = useResourceFilters({
    instructions
  })

  if (!canUser('read', 'price_lists')) {
    return (
      <HomePageLayout title='Price lists'>
        <EmptyState title='You are not authorized' />
      </HomePageLayout>
    )
  }

  return (
    <HomePageLayout title='Price lists'>
      <SearchWithNav
        queryString={queryString}
        onUpdate={(qs) => {
          navigate(`?${qs}`, {
            replace: true
          })
        }}
        onFilterClick={() => {}}
        hideFiltersNav
      />
      <FilteredList
        type='price_lists'
        query={{
          sort: {
            created_at: 'desc'
          }
        }}
        ItemTemplate={ListItemPriceList}
        emptyState={
          hasActiveFilter ? (
            <EmptyState
              title='No price lists found!'
              description={
                <div>
                  <p>We didn't find any price list matching the search.</p>
                </div>
              }
              action={
                canUser('create', 'price_lists') && (
                  <Link href={appRoutes.priceListNew.makePath({})}>
                    <Button variant='primary'>Add a price list</Button>
                  </Link>
                )
              }
            />
          ) : (
            <EmptyState
              title='No price lists yet!'
              action={
                canUser('create', 'price_lists') && (
                  <Link href={appRoutes.priceListNew.makePath({})}>
                    <Button variant='primary'>Add a price list</Button>
                  </Link>
                )
              }
            />
          )
        }
        actionButton={
          canUser('create', 'price_lists') ? (
            <Link href={appRoutes.priceListNew.makePath({})}>Add new</Link>
          ) : undefined
        }
      />
    </HomePageLayout>
  )
}
