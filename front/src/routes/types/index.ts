import {MYNEWS} from '../../model/mynews'

export type ParamList = {
  Main: undefined
  MyNews: undefined
  UploadYourNews: undefined
  TheNews: {
    n: MYNEWS
  }
  CategoryNews: {
    category: string
  }
}
