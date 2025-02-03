import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import Router from './routes/Router'
import { store } from './store'
import './App.css'

function fallbackRender({ error }: FallbackProps) {
  console.log(error)
  return (
    <div role="alert">
      <p>Error</p>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <ErrorBoundary fallbackRender={fallbackRender}>
          <Router />
        </ErrorBoundary>
      </Provider>
    </HashRouter>
  )
}

export default App
