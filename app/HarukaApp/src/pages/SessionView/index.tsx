import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import { joinQueries, useNetwork } from '../../utils/Network';
import { session as sessionApi, text as textApi } from '../../api';
import { Session } from '../../components/SessionCard';
import {
  Button,
  Divider,
  SegmentedButtons,
  Text,
  TextInput,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import FormItem from '../../components/FormItem';
import { useModels } from '../../hooks/useModels';
import ModalSelector from 'react-native-modal-selector';
import Selector from '../../components/Selector';
import { usePreprompts } from '../../hooks/usePrePrompts';

const PROMPT_MAX_LENGTH = 100;

const SessionView = () => {
  const { jsonPost, jsonGet } = useNetwork();

  const navigation: any = useNavigation();
  const route = useRoute();

  const { sessionUUID } = route.params as any;

  const [session, setSession] = useState<Session>();
  const [prePromptId, setPrePromptId] = useState<number>();
  const [isSaved, setIsSaved] = useState(true);
  const [isGeneratingText, setisGeneratingText] = useState(false);

  const [buttonValue, setButtonValue] = useState('');

  const { models } = useModels();
  const { prePrompts } = usePreprompts();

  const modelSelectorRef = useRef<ModalSelector>(null);
  const prePromptSelectorRef = useRef<ModalSelector>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  const anchorRefs = [
    useRef<View>(null),
    useRef<View>(null),
    useRef<View>(null),
  ];
  const [anchorTops, setAnchorTops] = useState([0, 0, 0]);

  /** 实际标题的相对位置 */
  const actualAnchorTops = anchorTops.map((top, _, arr) => top - arr[0]);

  useEffect(() => {
    (async () => {
      if (!sessionUUID) {
        return;
      }

      const data = await jsonGet(
        `${sessionApi.info}?${joinQueries({
          sessionUUID,
        })}`,
      );
      setSession(data);
    })();
  }, [jsonGet, navigation, sessionUUID]);

  useEffect(() => {
    setIsSaved(false);
  }, [session]);

  const handleGenerateText = useCallback(async () => {
    if (isGeneratingText) {
      return;
    }
    setisGeneratingText(true);
    const result = await jsonPost(textApi.updateItems, {
      sessionUUID: session?.sessionUUID,
      modelId: session?.modelId,
      prompt: session?.prompt,
      apiKey: session?.apiKey,
    });
    if (!result) {
      return;
    }
    const text = await jsonPost(textApi.generate, {
      sessionUUID: session?.sessionUUID,
    });
    if (text) {
      ToastAndroid.show('文本生成成功', ToastAndroid.SHORT);
      setSession(prevSession => ({
        ...(prevSession as Session),
        text,
      }));
    }
    setisGeneratingText(false);
  }, [isGeneratingText, jsonPost, session]);

  return (
    <View style={style.constainer}>
      <View style={style.segementView}>
        <SegmentedButtons
          style={style.segementButtons}
          value={buttonValue}
          onValueChange={value => setButtonValue(value)}
          buttons={[
            {
              value: 'text-button',
              label: '文本',
              icon: 'text',
              onPress: () =>
                scrollViewRef.current?.scrollTo({
                  y: actualAnchorTops[0],
                  animated: true,
                }),
            },
            {
              value: 'audio-button',
              label: '音频',
              icon: 'music',
              disabled: (session?.step ?? 0) <= 0,
              onPress: () =>
                scrollViewRef.current?.scrollTo({
                  y: actualAnchorTops[1],
                  animated: true,
                }),
            },
            {
              value: 'video-button',
              label: '视频',
              icon: 'video',
              disabled: (session?.step ?? 0) <= 1,
              onPress: () =>
                scrollViewRef.current?.scrollTo({
                  y: actualAnchorTops[2],
                  animated: true,
                }),
            },
          ]}
        />
      </View>
      {session && (
        <ScrollView
          style={style.scrollView}
          ref={scrollViewRef}
          onScroll={e => {
            const offsetY = e.nativeEvent.contentOffset.y;
            if (offsetY <= actualAnchorTops[1]) {
              setButtonValue('text-button');
            } else if (offsetY <= actualAnchorTops[2]) {
              setButtonValue('audio-button');
            } else {
              setButtonValue('video-button');
            }
          }}>
          <View
            style={style.titleView}
            ref={anchorRefs[0]}
            onLayout={() => {
              anchorRefs[0].current?.measure((...params) => {
                const index = 0;
                setAnchorTops(prevAnchorTops => [
                  ...prevAnchorTops.slice(0, index),
                  params[5],
                  ...prevAnchorTops.slice(index + 1),
                ]);
              });
            }}>
            <Text variant="displaySmall">文本</Text>
          </View>
          <FormItem label="模型">
            <Selector
              options={models.map(model => ({
                key: model.modelId,
                label: model.modelName,
              }))}
              onChange={({ key }) =>
                setSession(prevSession => ({
                  ...(prevSession as Session),
                  modelId: key,
                }))
              }>
              <Button
                onPress={() => modelSelectorRef.current?.open()}
                mode="contained-tonal">
                <Text variant="bodyMedium">
                  {models.find(model => model.modelId === session.modelId)
                    ?.modelName ?? '请选择文本模型'}
                </Text>
              </Button>
            </Selector>
          </FormItem>
          <FormItem label="提示词预设">
            <Selector
              options={prePrompts.map(prePrompt => ({
                key: prePrompt.id,
                label: prePrompt.name,
              }))}
              onChange={({ key }) => {
                setPrePromptId(key);
                const prompt = prePrompts.find(
                  prePrompt => prePrompt.id === key,
                )?.description;
                setSession(prevSession => ({
                  ...(prevSession as Session),
                  prompt,
                }));
              }}>
              <Button
                onPress={() => prePromptSelectorRef.current?.open()}
                mode="contained-tonal">
                <Text variant="bodyMedium">
                  {prePrompts.find(prePrompt => prePrompt.id === prePromptId)
                    ?.name ?? '请选择提示词预设'}
                </Text>
              </Button>
            </Selector>
          </FormItem>
          <FormItem
            label={`提示词 (${
              session.prompt?.length ?? 0
            }/${PROMPT_MAX_LENGTH})`}
            mode="vertical">
            <TextInput
              multiline
              maxLength={PROMPT_MAX_LENGTH}
              value={session.prompt}
              onChangeText={text =>
                setSession(prevSession => ({
                  ...(prevSession as Session),
                  prompt: text,
                }))
              }
            />
          </FormItem>

          <FormItem label="API KEY" mode="vertical">
            <TextInput
              value={session.apiKey}
              onChangeText={apiKey =>
                setSession(prevSession => ({
                  ...(prevSession as Session),
                  apiKey,
                }))
              }
            />
          </FormItem>

          <View style={style.inlineSingleButtonView}>
            <Button
              mode="elevated"
              onPress={handleGenerateText}
              loading={isGeneratingText}>
              提交并生成文本
            </Button>
          </View>

          <FormItem label="新闻文本" mode="vertical">
            <TextInput value={session.text} readOnly />
          </FormItem>

          <FormItem></FormItem>

          <Divider bold />
          <View
            style={style.titleView}
            ref={anchorRefs[1]}
            onLayout={() => {
              anchorRefs[1].current?.measure((...params) => {
                const index = 1;
                setAnchorTops(prevAnchorTops => [
                  ...prevAnchorTops.slice(0, index),
                  params[5],
                  ...prevAnchorTops.slice(index + 1),
                ]);
              });
            }}>
            <Text variant="displaySmall">音频</Text>
          </View>
          {/* <View style={{ height: 1000 }} /> */}
          <View
            style={style.titleView}
            ref={anchorRefs[2]}
            onLayout={() => {
              anchorRefs[2].current?.measure((...params) => {
                const index = 2;
                setAnchorTops(prevAnchorTops => [
                  ...prevAnchorTops.slice(0, index),
                  params[5],
                  ...prevAnchorTops.slice(index + 1),
                ]);
              });
            }}>
            <Text variant="displaySmall">视频</Text>
          </View>
          {/* <View style={{ height: 1000 }} /> */}
        </ScrollView>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  constainer: {
    flex: 1,
    alignContent: 'center',
  },
  segementView: {
    flex: 1,
    flexBasis: 60,
    flexGrow: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  segementButtons: {},
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  titleView: {
    paddingVertical: 8,
  },
  inlineSingleButtonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
});

export default SessionView;
