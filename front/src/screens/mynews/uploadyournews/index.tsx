import React, {FC, useState, useCallback} from 'react'
import base64 from 'react-native-base64'
import RNFS from 'react-native-fs'

import {
  Button,
  Center,
  Image,
  Text,
  Heading,
  VStack,
  TextArea,
  Pressable,
  HStack,
} from 'native-base'
import {SafeAreaView} from 'react-native'
import {launchImageLibrary, launchCamera} from 'react-native-image-picker'

import {UploadYourNewsProps} from '../types'
import axios from 'axios'

const UploadYourNewsScreen: FC<UploadYourNewsProps> = (props) => {
  const {navigation} = props

  const [photo, setPhoto] = useState<string>('')
  const [newsText, setNewsText] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [newsTitle, setNewsTitle] = useState<string>('')

  const onChooseYourImage = useCallback<() => void>(async () => {
    // const result = await launchCamera({
    //   mediaType: 'photo',
    //   saveToPhotos: true,
    //   cameraType: 'back',
    // })
    const result = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: true,
    })
    if (result.didCancel) {
      return null
    }
    const localUri = result.assets[0].uri
    const uriPath = localUri?.split('//').pop()
    console.log(uriPath)
    setPhoto(`file://${uriPath}`)
  }, [])

  const onUploadYourNew = useCallback<() => void>(async () => {
    const data = await RNFS.readFile(photo, 'base64').then((res) => {
      console.log(res)
      return res
    })
    // const data = base64.encode(photo)

    axios
      .post(
        'http://ec2-3-144-218-112.us-east-2.compute.amazonaws.com:8080/mynews/new',
        {
          title: newsTitle,
          author: name,
          body: newsText,
          image: data,
        },
      )
      .then(() => navigation.goBack())
  }, [photo, newsTitle, name, newsText, navigation])

  return (
    <SafeAreaView>
      <Center height="full">
        {photo ? (
          <>
            <Pressable onPress={onChooseYourImage} width="full" height="250">
              <Image
                alt="test"
                source={{uri: photo}}
                width="full"
                height="250"
              />
            </Pressable>
            <Text fontSize="10" color="gray.500">
              위 사진을 클릭하면 다시 갤러리를 엽니다.
            </Text>
          </>
        ) : (
          <Button
            variant="ghost"
            colorScheme="gray"
            borderWidth={1}
            borderRadius={5}
            borderColor="gray.300"
            backgroundColor="Gray.100"
            width="80%"
            height="40%"
            alignSelf="center"
            onPress={onChooseYourImage}>
            Choose Your image
          </Button>
        )}
        <VStack space={3} marginTop="8">
          <Heading fontSize={19}>기사 제목과 본인 이름 입력해주세요.</Heading>
          <HStack space={4} w="full">
            <TextArea
              h={8}
              placeholder="기사 제목"
              w="50%"
              maxW="300"
              onChangeText={setNewsTitle}
            />
            <TextArea
              h={8}
              placeholder="본인 이름"
              w="25%"
              maxW="300"
              onChangeText={setName}
            />
          </HStack>
          <Heading fontSize={19}>무슨 일이 있었나요?</Heading>
          <TextArea
            h={20}
            placeholder="이런저런 일이 있었어요"
            w="75%"
            maxW="300"
            onChangeText={setNewsText}
          />
          <Button onPress={onUploadYourNew}>업로드</Button>
        </VStack>
      </Center>
    </SafeAreaView>
  )
}

export default UploadYourNewsScreen
