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
