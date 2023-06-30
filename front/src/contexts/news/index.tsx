import {FC, createContext, useContext, useMemo, useState} from 'react'

import {NewsManager, NewsState, Props} from './types'

const defaultState: NewsState = {
  news: [],
}

const NewsContext = createContext<[NewsState, NewsManager]>([
  defaultState,
  {
    setNews: () => {},
    updateNews: () => {},
  },
])

export const NewsProvider: FC<Props> = (props) => {
  const {children} = props
  const [state, setState] = useState<NewsState>(defaultState)
  const manager = useMemo<NewsManager>(() => {
    return {
      setNews: (newNews) => {
        setState((v) => {
          return {...v, news: newNews}
        })
      },
      updateNews: (updateNews) => {
        setState((v) => {
          const {news: n} = v

          const updated = n.map((value) => {
            if (value.id === updateNews.id) return updateNews
            return value
          })
          return {...v, news: updated}
        })
      },
    }
  }, [])
  const value = useMemo<[NewsState, NewsManager]>(() => {
    return [state, manager]
  }, [state, manager])

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>
}

export const useNews: () => [NewsState, NewsManager] = () =>
  useContext(NewsContext)
