import { ErrorNotFound } from '#pages/ErrorNotFound'
import { Home } from '#pages/Home'
import { PriceListEdit } from '#pages/PriceListEdit'
import { PriceListNew } from '#pages/PriceListNew'
import { PricesList } from '#pages/PricesList'
import type { FC } from 'react'
import { Route, Router, Switch } from 'wouter'
import { appRoutes } from './data/routes'

interface AppProps {
  routerBase?: string
}

export const App: FC<AppProps> = ({ routerBase }) => {
  return (
    <Router base={routerBase}>
      <Switch>
        <Route path={appRoutes.home.path} component={Home} />
        <Route path={appRoutes.priceListNew.path} component={PriceListNew} />
        <Route path={appRoutes.priceListEdit.path} component={PriceListEdit} />
        <Route path={appRoutes.pricesList.path} component={PricesList} />
        <Route>
          <ErrorNotFound />
        </Route>
      </Switch>
    </Router>
  )
}
