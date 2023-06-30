/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NativeBaseProvider} from 'native-base'
import React from 'react'

import Root from './routes'
import {NewsProvider} from './contexts/news'
import {MyNewsProvider} from './contexts/mynews'

const App = () => {
  return (
    <NativeBaseProvider>
      <NewsProvider>
        <MyNewsProvider>
          <Root />
        </MyNewsProvider>
      </NewsProvider>
    </NativeBaseProvider>
  )
}

export default App
