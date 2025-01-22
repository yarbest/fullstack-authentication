import { Suspense } from 'react'

import Loader from './Loader'

type LazyLoadProps<T> = T & { fallback?: React.ReactNode }

const LazyLoad = <T extends object>(Component: React.ComponentType<T>) => {
  const WrappedComponent = (props: LazyLoadProps<T>) => {
    const { fallback = <Loader />, ...restProps } = props
    return (
      <Suspense fallback={fallback}>
        <Component {...(restProps as T)} />
      </Suspense>
    )
  }

  WrappedComponent.displayName = `LazyLoad(${Component.displayName ?? Component.name ?? 'Component'})`

  return WrappedComponent
}

export default LazyLoad
