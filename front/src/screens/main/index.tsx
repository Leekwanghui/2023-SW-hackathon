/* eslint-disable react/no-unstable-nested-components */
import React, {FC, useState, useCallback, useEffect} from 'react'
import Carousel from 'react-native-reanimated-carousel'
import {SafeAreaView, Linking, Dimensions} from 'react-native'
import ManIcon from 'react-native-vector-icons/MaterialIcons'
import ManComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  Text,
  ScrollView,
  AspectRatio,
  HStack,
  View,
  Input,
  Pressable,
  Center,
  Button,
  Image,
  Box,
  Stack,
  Heading,
  PresenceTransition,
} from 'native-base'
import axios from 'axios'

import {MainProps} from './types'
import {useNews} from '../../contexts/news'
import {DateConvert} from '../../util/DateConvert'
import {NEWS} from '../../model/news'

const Main: FC<MainProps> = (props) => {
  const {navigation} = props

  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [{news}, {setNews, updateNews}] = useNews()
  const [isShow, setShow] = useState<boolean>(true)
  const [isShowShow, setShowShow] = useState<boolean>(true)

  useEffect(() => {
    try {
      const get = async () => {
        const {data} = await axios.get(
          // 'http://ec2-18-117-243-60.us-east-2.compute.amazonaws.com:8080/news',
          'http://ec2-3-144-218-112.us-east-2.compute.amazonaws.com:8080/news',
        )
        setNews(data)
      }
      get()
    } catch (err) {
      console.log('err', err)
    }

    setTimeout(() => {
      setShow(false)
      setTimeout(() => {
        setShowShow(false)
      }, 2000)
    }, 2000)

    if (!isShow)
      navigation.setOptions({
        headerLeft: () => (
          <Pressable marginLeft={5}>
            <Text>
              <ManIcon name="menu" size={24} color="black" />
            </Text>
          </Pressable>
        ),
        headerRight: () => (
          <Pressable marginRight={5}>
            <Text>
              <ManIcon name="settings" size={24} color="black" />
            </Text>
          </Pressable>
        ),
      })
  }, [setNews, navigation, isShow])

  const gotoMyNewsScreen = useCallback<() => void>(() => {
    navigation.push('MyNews')
  }, [navigation])

  const gotoUploadYourNewsScreen = useCallback<() => void>(() => {
    navigation.push('UploadYourNews')
  }, [navigation])

  const gotoCategory = useCallback<(category: string) => () => void>(
    (category) => () => {
      navigation.push('CategoryNews', {category})
    },
    [navigation],
  )

  const gotoTheSite = useCallback(
    (url) => async () => {
      await Linking.openURL(url) // https://naver.com
    },
    [],
  )

  // 너비 높이
  const CWidth = Dimensions.get('screen').width
  const CHeight = Dimensions.get('screen').height

  const HeaderLength = useCallback<(str: string) => string>((str) => {
    return str.length > 31 ? `${str.substring(0, 30)}...` : str
  }, [])
  const BodyLength = useCallback<(str: string) => string>((str) => {
    if (str === null) return ''
    return str.length > 56 ? `${str.substring(0, 53)}...` : str
  }, [])

  console.log(news)

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
      {isShowShow ? (
        <PresenceTransition
          visible={isShow}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 250,
            },
          }}>
          <Center bg="#E2DCDC" w="full" h="full">
            <Text color="#707070" fontSize="32" fontFamily="ChosunNm">
              리틀빗
            </Text>
            <Text color="#707070" fontSize="23" fontFamily="ChosunNm">
              세상의 따뜻한 이야기
            </Text>
            <Text color="#707070" fontSize="23" fontFamily="ChosunNm">
              세상의 작은 이야기
            </Text>
          </Center>
        </PresenceTransition>
      ) : (
        <></>
      )}
      <ScrollView marginTop="13%">
        <Pressable
          onPress={gotoCategory('예술/문화')}
          marginLeft={5}
          marginTop="3%"
          height="1.5%"
          width="20%">
          <Box bgColor="blueGray.400" borderRadius={6}>
            <Center height="full">
              <Text color="white" fontSize="10" fontFamily="NanumSquareRoundB">
                문화/연예
              </Text>
            </Center>
          </Box>
        </Pressable>
        <Carousel
          loop
          width={CWidth}
          height={CHeight * 0.42}
          autoPlay
          data={news.filter((v) => v.category === '문화/연예')}
          scrollAnimationDuration={3000}
          renderItem={({item}) => (
            <Pressable
              maxW="93%"
              width="93%"
              alignSelf="center"
              onPress={gotoTheSite(item.link)}
              bgColor="white"
              borderRadius={25}
              marginTop={3}>
              <Box alignItems="center" maxH="100%">
                <Stack p="4" space={4} maxW="80%" width="full">
                  <Stack space={2}>
                    <Pressable onPress={onClickBookmark(item)}>
                      {item.bookmark ? (
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
                      {HeaderLength(`${item.title}`)}
                    </Heading>
                    <HStack space={30}>
                      <Text
                        color="gray.400"
                        italic
                        textAlign="right"
                        w="30%"
                        fontFamily="NanumSquareRoundL"
                        fontSize={9}>
                        {DateConvert(item.published_at)}
                      </Text>
                      <Text
                        color="gray.400"
                        italic
                        textAlign="right"
                        w="30%"
                        fontFamily="NanumSquareRoundL"
                        fontSize={9}>
                        {item.author ? `${item.author} 기자` : '- 기자'}
                      </Text>
                    </HStack>
                  </Stack>
                  <Text fontSize={10} color="coolGray.300" fontWeight={300}>
                    {BodyLength(item.summary)}
                  </Text>
                </Stack>
                <Box
                  maxW="60%"
                  overflow="hidden"
                  borderColor="coolGray.200"
                  borderWidth={1}>
                  <AspectRatio w="100%" ratio={16 / 9}>
                    <Image
                      alt={item.title}
                      source={{
                        uri: item.image_url,
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
          )}
        />
        <Pressable
          onPress={gotoCategory('경제')}
          marginLeft={5}
          marginTop="3%"
          height="1.5%"
          width="20%">
          <Box bgColor="blue.400" borderRadius={6}>
            <Center height="full">
              <Text color="white" fontSize={10} fontFamily="NanumSquareRoundB">
                경제
              </Text>
            </Center>
          </Box>
        </Pressable>
        <Carousel
          loop
          width={CWidth}
          height={CHeight * 0.42}
          autoPlay
          data={news.filter((v) => v.category === '경제')}
          scrollAnimationDuration={3000}
          renderItem={({item}) => (
            <Pressable
              maxW="93%"
              width="93%"
              alignSelf="center"
              onPress={gotoTheSite(item.link)}
              bgColor="white"
              borderRadius={25}
              marginTop={3}>
              <Box alignItems="center" maxH="100%">
                <Stack p="4" space={4} maxW="80%" width="full">
                  <Stack space={2}>
                    <Pressable onPress={onClickBookmark(item)}>
                      {item.bookmark ? (
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
                      {HeaderLength(`${item.title}`)}
                    </Heading>
                    <HStack space={30}>
                      <Text
                        color="gray.400"
                        italic
                        textAlign="right"
                        w="30%"
                        fontFamily="NanumSquareRoundL"
                        fontSize={9}>
                        {DateConvert(item.published_at)}
                      </Text>
                      <Text
                        color="gray.400"
                        italic
                        textAlign="right"
                        w="30%"
                        fontFamily="NanumSquareRoundL"
                        fontSize={9}>
                        {item.author ? `${item.author} 기자` : '- 기자'}
                      </Text>
                    </HStack>
                  </Stack>
                  <Text fontSize={10} color="coolGray.300" fontWeight={300}>
                    {BodyLength(item.summary)}
                  </Text>
                </Stack>
                <Box
                  maxW="60%"
                  overflow="hidden"
                  borderColor="coolGray.200"
                  borderWidth={1}>
                  <AspectRatio w="100%" ratio={16 / 9}>
                    <Image
                      alt={item.title}
                      source={{
                        uri: item.image_url
                          ? item.image_url
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
          )}
        />
        <Pressable
          onPress={gotoCategory('산업/과학')}
          marginLeft={5}
          marginTop="3%"
          height="1.5%"
          width="20%">
          <Box bgColor="blueGray.400" borderRadius={6}>
            <Center height="full">
              <Text color="white" fontSize="10" fontFamily="NanumSquareRoundB">
                산업/과학
              </Text>
            </Center>
          </Box>
        </Pressable>
        <Carousel
          loop
          width={CWidth}
          height={CHeight * 0.42}
          autoPlay
          data={news.filter((v) => v.category === '산업/과학')}
          scrollAnimationDuration={3000}
          renderItem={({item}) => (
            <Pressable
              maxW="93%"
              width="93%"
              alignSelf="center"
              onPress={gotoTheSite(item.link)}
              bgColor="white"
              borderRadius={25}
              marginTop={3}>
              <Box alignItems="center" maxH="100%">
                <Stack p="4" space={4} maxW="80%" width="full">
                  <Stack space={2}>
                    <Pressable onPress={onClickBookmark(item)}>
                      {item.bookmark ? (
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
                      {HeaderLength(`${item.title}`)}
                    </Heading>
                    <HStack space={30}>
                      <Text
                        color="gray.400"
                        italic
                        textAlign="right"
                        w="30%"
                        fontFamily="NanumSquareRoundL"
                        fontSize={9}>
                        {DateConvert(item.published_at)}
                      </Text>
                      <Text
                        color="gray.400"
                        italic
                        textAlign="right"
                        w="30%"
                        fontFamily="NanumSquareRoundL"
                        fontSize={9}>
                        {item.author ? `${item.author} 기자` : '- 기자'}
                      </Text>
                    </HStack>
                  </Stack>
                  <Text fontSize={10} color="coolGray.300" fontWeight={300}>
                    {BodyLength(item.summary)}
                  </Text>
                </Stack>
                <Box
                  maxW="60%"
                  overflow="hidden"
                  borderColor="coolGray.200"
                  borderWidth={1}>
                  <AspectRatio w="100%" ratio={16 / 9}>
                    <Image
                      alt={item.title}
                      source={{
                        uri: item.image_url
                          ? item.image_url
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
          )}
        />
        <Pressable
          onPress={gotoCategory('스포츠')}
          marginLeft={5}
          marginTop="3%"
          height="1.5%"
          width="20%">
          <Box bgColor="blueGray.400" borderRadius={6}>
            <Center height="full">
              <Text color="white" fontSize="10" fontFamily="NanumSquareRoundB">
                스포츠
              </Text>
            </Center>
          </Box>
        </Pressable>
        <Carousel
          loop
          width={CWidth}
          height={CHeight * 0.42}
          autoPlay
          data={news.filter((v) => v.category === '스포츠')}
          scrollAnimationDuration={3000}
          renderItem={({item}) => (
            <Pressable
              maxW="93%"
              width="93%"
              alignSelf="center"
              onPress={gotoTheSite(item.link)}
              bgColor="white"
              borderRadius={25}
              marginTop={3}>
              <Box alignItems="center" maxH="100%">
                <Stack p="4" space={4} maxW="80%" width="full">
                  <Stack space={2}>
                    <Pressable onPress={onClickBookmark(item)}>
                      {item.bookmark ? (
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
                      {HeaderLength(`${item.title}`)}
                    </Heading>
                    <HStack space={30}>
                      <Text
                        color="gray.400"
                        italic
                        textAlign="right"
                        w="30%"
                        fontFamily="NanumSquareRoundL"
                        fontSize={9}>
                        {DateConvert(item.published_at)}
                      </Text>
                      <Text
                        color="gray.400"
                        italic
                        textAlign="right"
                        w="30%"
                        fontFamily="NanumSquareRoundL"
                        fontSize={9}>
                        {item.author ? `${item.author} 기자` : '- 기자'}
                      </Text>
                    </HStack>
                  </Stack>
                  <Text fontSize={10} color="coolGray.300" fontWeight={300}>
                    {BodyLength(item.summary)}
                  </Text>
                </Stack>
                <Box
                  maxW="60%"
                  overflow="hidden"
                  borderColor="coolGray.200"
                  borderWidth={1}>
                  <AspectRatio w="100%" ratio={16 / 9}>
                    <Image
                      alt={item.title}
                      source={{
                        uri: item.image_url
                          ? item.image_url
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
          )}
        />
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

export default Main
