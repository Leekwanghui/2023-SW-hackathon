import React, {FC, useState, useCallback, useEffect} from 'react'
import axios from 'axios'
import {ScrollView} from 'react-native-gesture-handler'
import ManIcon from 'react-native-vector-icons/MaterialIcons'
import {SafeAreaView} from 'react-native'
import {
  Text,
  Pressable,
  Center,
  Divider,
  Box,
  Stack,
  Heading,
  Fab,
  HStack,
  AspectRatio,
  Image,
  VStack,
} from 'native-base'
import ManComIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import {MyNewsProps} from '../types'
import {useMyNews} from '../../../contexts/mynews'
import {MYNEWS} from '../../../model/mynews'

const MyNewsScreen: FC<MyNewsProps> = (props) => {
  const {navigation} = props
  const [{mynews}, {addMyNews, setMyNews}] = useMyNews()

  const gotoMyNewsScreen = useCallback<() => void>(() => {
    navigation.push('MyNews')
  }, [navigation])

  const gotoUploadYourNewsScreen = useCallback<() => void>(() => {
    navigation.push('UploadYourNews')
  }, [navigation])

  /*
const BodyLength = useCallback<(str: string) => string>((str) => {
    if (str === null) return ''
    return str.length > 56 ? `${str.substring(0, 53)}...` : str
  }, [])
*/

  const bodyLength = useCallback<(str: string) => string>((str) => {
    if (str === null) return ''
    return str.length > 120 ? `${str.substring(0, 117)}...` : str
  }, [])

  useEffect(() => {
    try {
      const get = async () => {
        const {data} = await axios.get(
          'http://ec2-3-144-218-112.us-east-2.compute.amazonaws.com:8080/mynews',
        )

        setMyNews(data)
      }
      get()
    } catch (err) {
      console.log('err', err)
    }

    navigation.setOptions({
      headerTitle: () => (
        <Text fontFamily="ChosunCentennial_ttf" fontSize="23">
          오늘의 기자들.
        </Text>
      ),
    })
  }, [setMyNews, navigation])

  console.log(mynews)

  // const [searchKeyword, setSearchKeyword] = useState<string>('')

  const gotoTheNewsScreen = useCallback<(n: MYNEWS) => () => void>(
    (n) => () => {
      navigation.push('TheNews', {
        n,
      })
    },
    [navigation],
  )

  return (
    <SafeAreaView>
      <ScrollView marginTop="13%" style={{height: '100%'}}>
        <Center>
          {mynews.map((value) => (
            <Pressable
              key={value.id}
              maxW="93%"
              width="93%"
              height="200"
              marginTop={3}
              marginBottom={4}
              backgroundColor="white"
              onPress={gotoTheNewsScreen(value)}>
              <Box alignItems="center">
                {/* <HStack space={4} marginTop={4}>
                  <Box w="65%">
                    <Heading
                      color="#6A99A6"
                      fontSize={17}
                      fontFamily="NanumSquareRoundEB">
                      {value.title}
                    </Heading>
                  </Box>
                </HStack> */}
                <HStack space={5}>
                  <VStack width="55%" height="100%" padding="4">
                    <Box
                      overflow="hidden"
                      borderColor="coolGray.200"
                      backgroundColor="white">
                      <AspectRatio w="100%" ratio={3 / 2}>
                        <Image
                          source={{uri: value.image_url}}
                          alt={value.title}
                        />
                      </AspectRatio>
                    </Box>
                    <Text fontFamily="NanumSquareRoundB" textAlign="right">
                      {value.author}
                    </Text>
                    <Divider
                      marginTop={1}
                      backgroundColor="gray"
                      w="85%"
                      borderWidth={0.19}
                      alignSelf="center"
                    />
                    <HStack space={5} alignSelf="center" marginTop={3}>
                      <Text fontFamily="NanumSquareRoundEB">
                        댓글 {value.like_cnt}
                      </Text>
                      <Text fontFamily="NanumSquareRoundEB">
                        조회 {value.id}
                      </Text>
                    </HStack>
                  </VStack>
                  <VStack
                    width="41%"
                    height="90%"
                    marginRight="2%"
                    paddingRight="3%"
                    paddingTop="6%">
                    <Heading fontSize={13} fontFamily="ChosunCentennial_ttf">
                      {value.title}
                    </Heading>
                    <Text fontSize={10}>{bodyLength(value.body)}</Text>
                  </VStack>
                </HStack>
              </Box>
            </Pressable>
          ))}
        </Center>
      </ScrollView>
      <Box
        marginTop={2}
        width="full"
        height={16}
        backgroundColor="blueGray.500">
        <Center paddingTop={4}>
          <HStack space={70}>
            <ManIcon name="search" size={35} color="white" />
            <Pressable onPress={gotoUploadYourNewsScreen}>
              <ManComIcon name="plus-circle" size={35} color="white" />
            </Pressable>
            <ManComIcon name="earth" size={35} color="white" />
            <Pressable onPress={gotoMyNewsScreen}>
              <ManIcon name="person" size={35} color="white" />
            </Pressable>
          </HStack>
        </Center>
      </Box>
    </SafeAreaView>
  )
}

export default MyNewsScreen
