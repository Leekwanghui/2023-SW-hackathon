import React, {FC, useState, useCallback, useEffect} from 'react'
import {SafeAreaView} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import {
  Heading,
  TextArea,
  Center,
  Pressable,
  HStack,
  Text,
  Input,
  Box,
  AspectRatio,
  Image,
  Divider,
  Button,
  useDisclose,
  Actionsheet,
} from 'native-base'
import axios from 'axios'

import {TheNewsProps} from './types'
import {DateConvert} from '../../util/DateConvert'

const TheNewsScreen: FC<TheNewsProps> = (props) => {
  const {
    navigation,
    route: {
      params: {
        n: {author, body, created_at, id, like_cnt, title, image_url},
      },
    },
  } = props

  // const [emojiCnt, setEmojiCnt] = useState<number[]>([0, 0, 0])

  // const onClickEmoji = useCallback<(num: number) => () => void>(
  //   (num) => () => {
  //     setEmojiCnt((value) => {
  //       const updatedCnt = [...value]
  //       if (updatedCnt[num] === 0) updatedCnt[num] = 1
  //       else updatedCnt[num] = (updatedCnt[num] || 0) + 1
  //       return updatedCnt
  //     })
  //   },
  //   [],
  // )
  console.log('id', id)
  const [text, setText] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [comments, setComments] = useState<string[]>([])
  const {isOpen, onOpen, onClose} = useDisclose()

  const onClick = useCallback<() => void>(async () => {
    await axios
      .post(
        'http://ec2-3-144-218-112.us-east-2.compute.amazonaws.com:8080/comment/new',
        {
          post_num: String(id),
          author: name,
          body: text,
        },
      )
      .then((res) => {
        navigation.goBack()
      })
      .catch((e) => {
        console.error(e)
      })
  }, [id, name, text, navigation])

  useEffect(() => {
    axios
      .get(
        `http://ec2-3-144-218-112.us-east-2.compute.amazonaws.com:8080/comment/${id}`,
      )
      .then((v) => {
        console.log(v.data)
        setComments(v.data)
      })
  }, [id])

  return (
    <SafeAreaView>
      <Center>
        <ScrollView
          style={{backgroundColor: 'white', width: '90%', marginTop: '13%'}}>
          <Text
            alignSelf="center"
            fontSize="23"
            fontFamily="ChosunNm"
            marginBottom={1}>
            {title}
          </Text>
          <Text
            marginBottom={2}
            alignSelf="center"
            fontFamily="ChosunNm"
            fontSize="16">
            {DateConvert(created_at)} {author}
          </Text>
          <Box
            overflow="hidden"
            borderColor="coolGray.200"
            backgroundColor="white"
            w="80%"
            alignSelf="center">
            <AspectRatio ratio={2 / 3}>
              <Image source={{uri: image_url}} alt={title} />
            </AspectRatio>
          </Box>
          <HStack space={200} alignSelf="center">
            <Text fontSize={16} fontFamily="ChosunNm">
              조회 {like_cnt}
            </Text>
            <Text fontSize={16} fontFamily="ChosunNm">
              댓글 {comments.length}
            </Text>
          </HStack>
          <Divider color="gray.400" w="85%" m="3" alignSelf="center" />
          <Text
            alignSelf="center"
            fontSize="19"
            fontFamily="ChosunNm"
            marginBottom={1}>
            내용
          </Text>
          <Text fontFamily="ChosunNm" fontSize="13" m="4" mt="2">
            {body}
          </Text>
          <Input
            w="80%"
            alignSelf="center"
            onChangeText={setName}
            placeholder="본인 이름"
          />
          <TextArea
            w="80%"
            mt="5"
            alignSelf="center"
            onChangeText={setText}
            placeholder="행복한 말로 시작해요."
          />
          <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
              <Box w="100%" h="auto" px="4" justifyContent="center">
                <ScrollView style={{maxHeight: 150}}>
                  {comments.map((value) => (
                    <Text fontSize="11" marginBottom="3">
                      {value.author}: {value.body}
                    </Text>

                    // <Actionsheet.Item isDisabled fontSize={10}>
                    //   {value.author}: {value.body}
                    // </Actionsheet.Item>
                  ))}
                </ScrollView>
              </Box>
            </Actionsheet.Content>
          </Actionsheet>
          <HStack space={5} alignSelf="center">
            <Button
              mt="4"
              mb="5"
              borderRadius={5}
              w="25%"
              alignSelf="center"
              colorScheme="darkBlue"
              onPress={onOpen}>
              댓글 보기
            </Button>
            <Button
              mt="4"
              mb="5"
              borderRadius={5}
              w="25%"
              alignSelf="center"
              colorScheme="warmGray"
              onPress={onClick}>
              보내기
            </Button>
          </HStack>
          {/* <Center>
            <Heading>이름</Heading>
            <Input onChangeText={setName} />
            <Heading>댓글</Heading>
            <TextArea
              onChangeText={setText}
              InputRightElement={
                <Pressable onPress={onClick}>
                  <ManComIcon name="comment-plus" size={20} color="black" />
                </Pressable>
              }
              w="100%"
              height={100}
              maxH={300}
            />
          </Center> */}
        </ScrollView>
      </Center>
    </SafeAreaView>
  )
}
export default TheNewsScreen
