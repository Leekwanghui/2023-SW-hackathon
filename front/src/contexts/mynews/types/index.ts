import {ReactNode} from 'react'
import {MYNEWS} from '../../../model/mynews'

export interface MyNewsState {
  mynews: MYNEWS[]
}

export interface MyNewsManager {
  addMyNews: (mynews: MYNEWS) => void
  setMyNews: (mynews: MYNEWS[]) => void
}

export interface Props {
  children: ReactNode
}
