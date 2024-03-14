import type { FiltersInstructions } from '@commercelayer/app-elements'

export const instructions: FiltersInstructions = [
  {
    label: 'Search',
    type: 'textSearch',
    sdk: {
      predicate: ['currency_code', 'name'].join('_or_') + '_cont'
    },
    render: {
      component: 'searchBar'
    }
  }
]

interface PricesInstructionsConfig {
  priceListId: string
}

export const pricesInstructions = ({
  priceListId
}: PricesInstructionsConfig): FiltersInstructions => [
  {
    label: 'Price list',
    type: 'options',
    sdk: {
      predicate: 'price_list_id_in',
      defaultOptions: [priceListId]
    },
    render: {
      component: 'inputToggleButton',
      props: {
        mode: 'single',
        options: [{ value: priceListId, label: priceListId }]
      }
    }
  },
  {
    label: 'Search',
    type: 'textSearch',
    sdk: {
      predicate: ['sku_code', 'amount_cents'].join('_or_') + '_cont'
    },
    render: {
      component: 'searchBar'
    }
  }
]
