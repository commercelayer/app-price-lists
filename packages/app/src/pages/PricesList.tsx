import { ListEmptyStatePrice } from '#components/ListEmptyStatePrice'
import { ListItemPrice } from '#components/ListItemPrice'
import { pricesInstructions } from '#data/filters'
import { appRoutes } from '#data/routes'
import { usePriceListDetails } from '#hooks/usePriceListDetails'
import {
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  EmptyState,
  PageLayout,
  SkeletonTemplate,
  useCoreSdkProvider,
  useOverlay,
  useResourceFilters,
  useTokenProvider
} from '@commercelayer/app-elements'
import { useState } from 'react'
import { Link, useLocation, useRoute } from 'wouter'
import { navigate, useSearch } from 'wouter/use-browser-location'

export function PricesList(): JSX.Element {
  const {
    canUser,
    settings: { mode }
  } = useTokenProvider()

  const [, params] = useRoute<{ priceListId: string }>(
    appRoutes.pricesList.path
  )

  const priceListId = params?.priceListId ?? ''

  const { priceList, isLoading, error } = usePriceListDetails(priceListId)

  const queryString = useSearch()
  const [, setLocation] = useLocation()

  const { SearchWithNav, FilteredList } = useResourceFilters({
    instructions: pricesInstructions({ priceListId })
  })

  const { sdkClient } = useCoreSdkProvider()
  const { Overlay, open, close } = useOverlay()
  const [isDeleteting, setIsDeleting] = useState(false)

  if (error != null) {
    return (
      <PageLayout
        title='Price Lists'
        navigationButton={{
          onClick: () => {
            setLocation(appRoutes.home.makePath({}))
          },
          label: 'Price Lists',
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

  const contextMenuEdit = canUser('update', 'price_lists') && (
    <DropdownItem
      label='Edit'
      onClick={() => {
        setLocation(
          appRoutes.priceListEdit.makePath({ priceListId: priceList.id })
        )
      }}
    />
  )

  const contextMenuDivider = canUser('update', 'price_lists') &&
    canUser('destroy', 'price_lists') && <DropdownDivider />

  const contextMenuDelete = canUser('destroy', 'price_lists') && (
    <DropdownItem
      label='Delete'
      onClick={() => {
        open()
      }}
    />
  )

  const contextMenu = (
    <Dropdown
      dropdownItems={
        <>
          {contextMenuEdit}
          {contextMenuDivider}
          {contextMenuDelete}
        </>
      }
    />
  )

  const pageTitle = priceList.name

  if (!canUser('read', 'price_lists') || !canUser('read', 'prices')) {
    return (
      <PageLayout title='Price Lists' mode={mode}>
        <EmptyState title='You are not authorized' />
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title={
        <SkeletonTemplate isLoading={isLoading}>{pageTitle}</SkeletonTemplate>
      }
      mode={mode}
      gap='only-top'
      navigationButton={{
        onClick: () => {
          setLocation(appRoutes.home.makePath({}))
        },
        label: 'Price Lists',
        icon: 'arrowLeft'
      }}
      actionButton={contextMenu}
      scrollToTop
    >
      <SearchWithNav
        queryString={queryString}
        onUpdate={(qs: any) => {
          navigate(`?${qs}`, {
            replace: true
          })
        }}
        onFilterClick={() => {}}
        hideFiltersNav
      />

      <FilteredList
        type='prices'
        query={{
          include: ['sku', 'price_volume_tiers', 'price_frequency_tiers'],
          sort: {
            created_at: 'desc'
          }
        }}
        ItemTemplate={ListItemPrice}
        emptyState={<ListEmptyStatePrice />}
      />
      {canUser('destroy', 'price_lists') && (
        <Overlay backgroundColor='light'>
          <PageLayout
            title={`Confirm that you want to delete the Price List with name ${priceList.name}.`}
            description='This action cannot be undone, proceed with caution.'
            minHeight={false}
            navigationButton={{
              onClick: () => {
                close()
              },
              label: `Cancel`,
              icon: 'x'
            }}
          >
            <Button
              variant='danger'
              size='small'
              disabled={isDeleteting}
              onClick={(e) => {
                setIsDeleting(true)
                e.stopPropagation()
                void sdkClient.price_lists
                  .delete(priceList.id)
                  .then(() => {
                    setLocation(appRoutes.home.makePath({}))
                  })
                  .catch(() => {})
              }}
              fullWidth
            >
              Delete Price List
            </Button>
          </PageLayout>
        </Overlay>
      )}
    </PageLayout>
  )
}
