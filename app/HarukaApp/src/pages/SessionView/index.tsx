import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { joinQueries, useNetwork } from '../../utils/Network';
import { session as sessionApi } from '../../api';
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

  const [buttonValue, setButtonValue] = useState('');

  const { models } = useModels();
  const { prePrompts } = usePreprompts();

  const modelSelectorRef = useRef<ModalSelector>(null);
  const prePromptSelectorRef = useRef<ModalSelector>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  // console.log(session);

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
            },
            {
              value: 'audio-button',
              label: '音频',
              icon: 'music',
            },
            { value: 'video-button', label: '视频', icon: 'video' },
          ]}
        />
      </View>
      {session && (
        <ScrollView style={style.scrollView} ref={scrollViewRef}>
          <View style={style.titleView}>
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
          <View style={style.contentView}>
            <Text>{session?.sessionUUID}</Text>
          </View>
          <Divider bold />
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
    backgroundColor: 'aqua',
  },
  segementButtons: {},
  scrollView: {
    flex: 1,
    // backgroundColor: 'lightgreen',
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  titleView: {
    paddingVertical: 8,
  },
  contentView: {},
});

export default SessionView;
