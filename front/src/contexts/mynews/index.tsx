import {FC, createContext, useContext, useMemo, useState} from 'react'

import {MyNewsManager, MyNewsState, Props} from './types'

const defaultState: MyNewsState = {
  mynews: [],
}

const MyNewsContext = createContext<[MyNewsState, MyNewsManager]>([
  defaultState,
  {addMyNews: () => {}, setMyNews: () => {}},
])

export const MyNewsProvider: FC<Props> = (props) => {
  const {children} = props
  const [state, setState] = useState<MyNewsState>(defaultState)
  const manager = useMemo<MyNewsManager>(() => {
    return {
      setMyNews: (newNews) => {
        setState((v) => {
          return {...v, mynews: newNews}
        })
      },
      addMyNews: (newValue) => {
        setState((v) => {
          const {mynews: n} = v
          return {...v, mynews: [...n, newValue]}
        })
      },
    }
  }, [])
  const value = useMemo<[MyNewsState, MyNewsManager]>(() => {
    return [state, manager]
  }, [state, manager])

  return (
    <MyNewsContext.Provider value={value}>{children}</MyNewsContext.Provider>
  )
}

export const useMyNews: () => [MyNewsState, MyNewsManager] = () =>
  useContext(MyNewsContext)
