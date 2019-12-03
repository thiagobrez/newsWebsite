import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import promise from 'redux-promise-middleware'
import { routerMiddleware } from 'react-router-redux'
import createLogger from 'redux-logger'
import { errorMiddleware } from '@cheesecakelabs/boilerplate/middlewares'

import rootReducer from '_modules/reducers'

const logger = createLogger({
  level: 'info',
  collapsed: true,
})

const router = routerMiddleware(browserHistory)

/**
 * Creates a preconfigured store.
 */
const configureStore = preloadedState => {
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(thunk, errorMiddleware, promise(), router, logger)),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
  /* eslint-enable */

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../modules/reducers', () => {
      // eslint-disable-next-line global-require
      const nextRootReducer = require('../modules/reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore
