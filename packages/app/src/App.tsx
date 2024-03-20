import { ErrorNotFound } from '#pages/ErrorNotFound'
import { Home } from '#pages/Home'
import { PriceDetails } from '#pages/PriceDetails'
import { PriceEdit } from '#pages/PriceEdit'
import { PriceFrequencyTierEdit } from '#pages/PriceFrequencyTierEdit'
import { PriceFrequencyTierNew } from '#pages/PriceFrequencyTierNew'
import { PriceListEdit } from '#pages/PriceListEdit'
import { PriceListNew } from '#pages/PriceListNew'
import { PriceNew } from '#pages/PriceNew'
import { PriceVolumeTierEdit } from '#pages/PriceVolumeTierEdit'
import { PriceVolumeTierNew } from '#pages/PriceVolumeTierNew'
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
        <Route path={appRoutes.priceNew.path} component={PriceNew} />
        <Route path={appRoutes.priceEdit.path} component={PriceEdit} />
        <Route path={appRoutes.priceDetails.path} component={PriceDetails} />
        <Route
          path={appRoutes.priceFrequencyTierEdit.path}
          component={PriceFrequencyTierEdit}
        />
        <Route
          path={appRoutes.priceFrequencyTierNew.path}
          component={PriceFrequencyTierNew}
        />
        <Route
          path={appRoutes.priceVolumeTierEdit.path}
          component={PriceVolumeTierEdit}
        />
        <Route
          path={appRoutes.priceVolumeTierNew.path}
          component={PriceVolumeTierNew}
        />
        <Route>
          <ErrorNotFound />
        </Route>
      </Switch>
    </Router>
  )
}
