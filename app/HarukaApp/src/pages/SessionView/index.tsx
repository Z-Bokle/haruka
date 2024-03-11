import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import { joinQueries, useNetwork } from '../../utils/Network';
import { media, session as sessionApi, text as textApi } from '../../api';
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
import AudioPlayer from '../../components/AudioPlayer';
import {
  useCachedMediaManager,
  useVideoManager,
} from '../../utils/MediaManager';
import VideoPlayer from '../../components/VideoPlayer';

const PROMPT_MAX_LENGTH = 100;

const SessionView = () => {
  const { jsonPost, jsonGet, formPost, baseUrl } = useNetwork();

  const navigation: any = useNavigation();
  const route = useRoute();

  const { sessionUUID } = route.params as any;

  const [session, setSession] = useState<Session>();
  const [prePromptId, setPrePromptId] = useState<number>();
  // const [isSaved, setIsSaved] = useState(true);
  const [isGeneratingText, setisGeneratingText] = useState(false);
  const [isGeneratingAudio, setisGeneratingAudio] = useState(false);

  const [buttonValue, setButtonValue] = useState('');

  const { models } = useModels();
  const { prePrompts } = usePreprompts();

  const { asset, getVideoByCamera, getVideoFromLocal } = useVideoManager();

  const { downloadMediaFile: downloadBaseMediaFile, fileUri: baseFileUri } =
    useCachedMediaManager();

  const { downloadMediaFile: downloadResultMediaFile, fileUri: resultFileUri } =
    useCachedMediaManager();

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

  const isTextEnabled = session?.step !== undefined && session?.step <= 1;
  const isAudioEnabled =
    session?.step !== undefined && session?.step <= 2 && session.step > 0;
  const isVideoEnabled =
    session?.step !== undefined && session?.step <= 3 && session.step > 1;

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
        step: 1,
      }));
    }
    setisGeneratingText(false);
  }, [isGeneratingText, jsonPost, session]);

  const handleGenerateAudio = useCallback(async () => {
    if (isGeneratingAudio) {
      return;
    }
    setisGeneratingAudio(true);
    const result = await jsonPost(media.generateAudio, {
      sessionUUID: session?.sessionUUID,
    });
    if (!result) {
      return;
    } else {
      ToastAndroid.show('音频生成成功', ToastAndroid.SHORT);
      setSession(prevSession => ({
        ...(prevSession as Session),
        audioUUID: result,
        step: 2,
      }));
    }
    setisGeneratingAudio(false);
  }, [isGeneratingAudio, jsonPost, session]);

  const handleUploadBaseVideo = useCallback(async () => {
    if (!asset || !asset.uri) {
      ToastAndroid.show('未选择资源', ToastAndroid.SHORT);
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: asset.uri,
      name: asset.fileName,
      type: asset.type,
    });
    formData.append('sessionUUID', session?.sessionUUID);

    const result = await formPost(media.uploadBaseVideo, formData);
    if (result) {
      ToastAndroid.show('视频上传成功', ToastAndroid.SHORT);
      setSession(prevSession => ({
        ...(prevSession as Session),
        baseVideoUUID: result,
      }));
    }
  }, [formPost, session, asset]);

  useEffect(() => {
    if (
      session &&
      session.sessionUUID &&
      session.baseVideoUUID &&
      // 如果有asset存在，此时播放器被本地预览视频占用，此时不需要再下载预览视频
      !asset?.uri
    ) {
      downloadBaseMediaFile(session?.sessionUUID, session?.baseVideoUUID).then(
        () => {
          ToastAndroid.show('预览视频下载成功', ToastAndroid.SHORT);
        },
      );
    }
  }, [
    asset?.uri,
    downloadBaseMediaFile,
    session,
    session?.baseVideoUUID,
    session?.sessionUUID,
  ]);

  useEffect(() => {
    if (session && session.sessionUUID && session.videoUUID) {
      downloadResultMediaFile(session?.sessionUUID, session?.videoUUID).then(
        () => {
          ToastAndroid.show('结果视频下载成功', ToastAndroid.SHORT);
        },
      );
    }
  }, [downloadResultMediaFile, session]);

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
              disabled: !isTextEnabled,
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
              disabled: !isAudioEnabled,
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
              disabled: !isVideoEnabled,
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
              disabled={!isTextEnabled}
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
                disabled={!isTextEnabled}
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
              disabled={!isTextEnabled}
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
                disabled={!isTextEnabled}
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
              disabled={!isTextEnabled}
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
              disabled={!isTextEnabled}
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
              disabled={!isTextEnabled}
              mode="contained"
              onPress={handleGenerateText}
              loading={isGeneratingText}>
              提交并生成文本
            </Button>
          </View>

          <FormItem label="新闻文本" mode="vertical">
            <TextInput
              disabled={!isTextEnabled}
              multiline
              value={session.text}
              readOnly
            />
          </FormItem>

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

          <View style={style.inlineSingleButtonView}>
            <Button
              disabled={!isAudioEnabled}
              mode="contained"
              loading={isGeneratingAudio}
              onPress={handleGenerateAudio}>
              生成音频
            </Button>
          </View>

          {session.audioUUID && (
            <FormItem label="音频预览" mode="vertical">
              <AudioPlayer
                uri={`${baseUrl}${media.stream}?${joinQueries({
                  sessionUUID: session.sessionUUID,
                  resourceUUID: session.audioUUID,
                })}`}
              />
            </FormItem>
          )}

          <Divider bold />
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
          <FormItem label="原视频" mode="vertical">
            {((asset && asset.uri) || baseFileUri) && (
              <View>
                <VideoPlayer
                  source={{
                    uri: asset?.uri ?? baseFileUri,
                  }}
                  width={asset?.width}
                  height={asset?.height}
                />
              </View>
            )}
            <View style={style.inlineButtonView}>
              <Button
                disabled={!isVideoEnabled}
                mode="contained"
                onPress={() => getVideoFromLocal()}>
                {asset || session.baseVideoUUID ? '重新' : '从文件'}选择
              </Button>
              <Button
                disabled={!isVideoEnabled}
                mode="contained"
                onPress={() => getVideoByCamera()}>
                {asset || session.baseVideoUUID ? '重新' : '用相机'}录制
              </Button>
            </View>

            <View style={style.inlineButtonView}>
              <Button
                disabled={!isVideoEnabled || !(asset && asset.uri)}
                mode="contained"
                onPress={handleUploadBaseVideo}>
                上传原视频
              </Button>
              <Button
                disabled={!isVideoEnabled || !session.baseVideoUUID}
                mode="contained">
                生成视频
              </Button>
            </View>
          </FormItem>
          {resultFileUri && (
            <FormItem label="合成的新闻播报">
              <VideoPlayer source={{ uri: resultFileUri }} />
            </FormItem>
          )}
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
  inlineButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  bottomBlock: {
    height: 200,
  },
});

export default SessionView;
