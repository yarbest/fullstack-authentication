import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

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
    <BrowserRouter>
      <Provider store={store}>
        <ErrorBoundary fallbackRender={fallbackRender}>
          <Router />
        </ErrorBoundary>
      </Provider>
    </BrowserRouter>
  )
}

export default App
