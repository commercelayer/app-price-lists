import { ErrorNotFound } from '#pages/ErrorNotFound'
import { PriceListsList } from '#pages/PriceListsList'
import type { FC } from 'react'
import { Redirect, Route, Router, Switch } from 'wouter'
import { appRoutes } from './data/routes'

interface AppProps {
  routerBase?: string
}

export const App: FC<AppProps> = ({ routerBase }) => {
  return (
    <Router base={routerBase}>
      <Switch>
        <Route path={appRoutes.home.path}>
          <Redirect to={appRoutes.list.path} />
        </Route>
        <Route path={appRoutes.list.path} component={PriceListsList} />
        <Route>
          <ErrorNotFound />
        </Route>
      </Switch>
    </Router>
  )
}
