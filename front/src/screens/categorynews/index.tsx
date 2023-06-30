import React, {FC, useCallback, useEffect} from 'react'
import axios from 'axios'
import {Dimensions, Linking} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {
  Button,
  AspectRatio,
  Box,
  HStack,
  Heading,
  Image,
  Pressable,
  ScrollView,
  Stack,
  Text,
  Center,
} from 'native-base'
import ManComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ManIcon from 'react-native-vector-icons/MaterialIcons'

import {CategoryNewsProps} from './types'
import {useNews} from '../../contexts/news'
import {DateConvert} from '../../util/DateConvert'
import {NEWS} from '../../model/news'

const CategoryNewsScreen: FC<CategoryNewsProps> = (props) => {
  const {
    navigation,
    route: {
      params: {category},
    },
  } = props

  useEffect(() => {
    navigation.setOptions({
      title: category,
    })
  }, [navigation])

  const [{news}, {updateNews}] = useNews()

  const CWidth = Dimensions.get('screen').width
  const CHeight = Dimensions.get('screen').height

  const gotoTheSite = useCallback(
    (url) => async () => {
      await Linking.openURL(url) // https://naver.com
    },
    [],
  )

  const gotoMyNewsScreen = useCallback<() => void>(() => {
    navigation.push('MyNews')
  }, [navigation])

  const gotoUploadYourNewsScreen = useCallback<() => void>(() => {
    navigation.push('UploadYourNews')
  }, [navigation])

  const HeaderLength = useCallback<(str: string) => string>((str) => {
    return str.length > 31 ? `${str.substring(0, 30)}...` : str
  }, [])
  const BodyLength = useCallback<(str: string) => string>((str) => {
    if (str === null) return ''
    return str.length > 56 ? `${str.substring(0, 53)}...` : str
  }, [])

  const onClickBookmark = useCallback<(n: NEWS) => () => void>(
    (n) => () => {
      const data = {
        id: n.id,
        bookmark: n.bookmark === 1 ? 0 : 1,
      }
      axios
        .post(
          'http://ec2-3-144-218-112.us-east-2.compute.amazonaws.com:8080/swagger/apis/#/default/put_news_bookmark',
          {
            id: data.id,
            status: n.bookmark,
          },
        )
        .then(() =>
          updateNews({
            bookmark: data.bookmark,
            id: data.id,
            category: n.category,
            link: n.link,
            published_at: n.published_at,
            summary: n.summary,
            title: n.title,
          }),
        )
    },
    [updateNews],
  )

  return (
    <SafeAreaView style={{height: '100%'}}>
      <ScrollView marginTop="13%">
        {news.map((value) => (
          <Pressable
            maxW="93%"
            width="93%"
            alignSelf="center"
            onPress={gotoTheSite(value.link)}
            bgColor="white"
            borderRadius={25}
            marginTop={3}>
            <Box alignItems="center" maxH="100%">
              <Stack p="4" space={4} maxW="80%" width="full">
                <Stack space={2}>
                  <Pressable onPress={onClickBookmark(value)}>
                    {value.bookmark ? (
                      <ManComIcon
                        name="bookmark"
                        size={56}
                        color="#F4C97B"
                        style={{
                          position: 'absolute',
                          top: -25,
                          right: -43,
                        }}
                      />
                    ) : (
                      <ManComIcon
                        name="bookmark-outline"
                        size={56}
                        color="#F4C97B"
                        style={{
                          position: 'absolute',
                          top: -25,
                          right: -43,
                        }}
                      />
                    )}
                  </Pressable>

                  <Heading
                    color="gray.600"
                    margin-left="-1"
                    fontSize={13}
                    fontFamily="NanumSquareRoundEB"
                    w="80%"
                    maxW="80%">
                    {HeaderLength(`${value.title}`)}
                  </Heading>
                  <HStack space={30}>
                    <Text
                      color="gray.400"
                      italic
                      textAlign="right"
                      w="30%"
                      fontFamily="NanumSquareRoundL"
                      fontSize={9}>
                      {DateConvert(value.published_at)}
                    </Text>
                    <Text
                      color="gray.400"
                      italic
                      textAlign="right"
                      w="30%"
                      fontFamily="NanumSquareRoundL"
                      fontSize={9}>
                      {value.author ? `${value.author} 기자` : '- 기자'}
                    </Text>
                  </HStack>
                </Stack>
                <Text fontSize={10} color="coolGray.300" fontWeight={300}>
                  {BodyLength(value.summary)}
                </Text>
              </Stack>
              <Box
                maxW="60%"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth={1}>
                <AspectRatio w="100%" ratio={16 / 9}>
                  <Image
                    alt={value.title}
                    source={{
                      uri: value.image_url
                        ? value.image_url
                        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaDe8C1cX8_PoXCLF0ewaIUH-B8xtHUDk-qhp0s3Vh&s',
                    }}
                  />
                </AspectRatio>
              </Box>
              <HStack space={90}>
                <Button
                  fontFamily="NanumSquareRoundEB"
                  fontWeight="bold"
                  variant="ghost"
                  size="sm"
                  color="#6A99A6">
                  SHARE
                </Button>
                <Button
                  fontFamily="NanumSquareRoundEB"
                  fontWeight="bold"
                  variant="ghost"
                  size="sm"
                  color="#6A99A6">
                  SCRIPT
                </Button>
              </HStack>
            </Box>
          </Pressable>
        ))}
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

export default CategoryNewsScreen
