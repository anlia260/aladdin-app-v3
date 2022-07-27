import React, { lazy, Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import TipContent from 'components/TipContent'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'

const routes = [
  {
    path: '/vault',
    Component: lazy(() => import('pages/vault')),
    exact: true,
  },
  {
    path: '/dataPanel',
    Component: lazy(() => import('pages/test')),
    exact: true,
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('pages/auth/404')),
    exact: true,
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

const Router = ({ history, routerAnimation }) => {
  return (
    <ConnectedRouter history={history}>
      {/* <Layout> */}
      <Route
        render={state => {
          const { location } = state
          return (
            <SwitchTransition>
              <CSSTransition
                key={location.pathname}
                appear
                classNames={routerAnimation}
                timeout={routerAnimation === 'none' ? 0 : 300}
              >
                <Switch location={location}>
                  <Route exact path="/" render={() => <Redirect to="/vault" />} />
                  {routes.map(({ path, Component, exact }) => (
                    <Route
                      path={path}
                      key={path}
                      exact={exact}
                      render={() => {
                        return (
                          <div className={routerAnimation}>
                            <Suspense fallback={null}>
                              <Component />
                            </Suspense>
                          </div>
                        )
                      }}
                    />
                  ))}
                  <Redirect to="/auth/404" />
                </Switch>
              </CSSTransition>
            </SwitchTransition>
          )
        }}
      />
      {/* </Layout> */}
      <TipContent />
    </ConnectedRouter>
  )
}

export default connect(mapStateToProps)(Router)
