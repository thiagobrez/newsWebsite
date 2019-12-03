import React from 'react'
import { Route } from 'react-router'

import App from './components/app'
import Home from './views/home'
import NotFound from './views/not-found'
import Login from './views/login'
import Interests from './views/interests'

const routes = store => (
  <Route component={App}>
    <Route path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/interests" component={Interests} />
    <Route path="*" component={NotFound} />
  </Route>
)

export default routes
