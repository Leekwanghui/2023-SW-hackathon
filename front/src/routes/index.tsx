import React, {FC} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import {CategoryNews, Main, MyNews, TheNews, UploadYourNews} from '../screens'
import {ParamList} from './types'

const {Navigator, Screen, Group} = createStackNavigator<ParamList>()

const Root: FC = () => {
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{
          headerTransparent: true,
          headerTitleAlign: 'center',
          title: '',
        }}>
        <Group>
          <Screen name="Main" component={Main} />
          <Screen
            name="MyNews"
            component={MyNews}
            options={{
              title: '오늘의 기자들.',
            }}
          />
          <Screen name="UploadYourNews" component={UploadYourNews} />
          <Screen name="TheNews" component={TheNews} />
          <Screen name="CategoryNews" component={CategoryNews} />
        </Group>
      </Navigator>
    </NavigationContainer>
  )
}

export default Root
