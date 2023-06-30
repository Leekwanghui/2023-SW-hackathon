import {ReactNode} from 'react'
import {NEWS} from '../../../model/news'

export interface NewsState {
  news: NEWS[]
}

export interface NewsManager {
  setNews: (news: NEWS[]) => void
  updateNews: (news: NEWS) => void
}

export interface Props {
  children: ReactNode
}
