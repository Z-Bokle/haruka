import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Menu, Text, TouchableRipple } from 'react-native-paper';
import { useDialog } from '../../utils/AppStores';
import { useNavigation } from '@react-navigation/native';

export interface Session {
  /** 上次更新时间 */
  lastModified: number;
  /** 会话UUID */
  sessionUUID: string;
  /** 文本 */
  text?: string;
  /** BaseVideo的UUID */
  baseVideoUUID?: string;
  /** 用户ID */
  userId?: number;
  /** 会话步骤 */
  step: 0 | 1 | 2 | 3;
  /** 模型ID */
  modelId?: number;
  /** 提示词 */
  prompt?: string;
  /** api key */
  apiKey?: string;
  /** 音频UUID */
  audioUUID?: string;
  /** 视频UUID */
  videoUUID?: string;
}

export interface SessionProps extends Session {
  onDelete?: (sessionUUID: string) => void;
}

const pictures = [
  require('../../assets/pics/card/card1.jpg'),
  require('../../assets/pics/card/card2.jpg'),
  require('../../assets/pics/card/card3.jpg'),
];

const getRandomPicture = (key: string) => {
  const index =
    key
      .split('')
      .map(char => char.charCodeAt(0))
      .reduce((a, b) => a + b) % pictures.length;
  return pictures[index];
};

const getTimeStr = (lastModified: number) => {
  const date = new Date(lastModified);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
};

const SessionCard = (props: SessionProps) => {
  const { lastModified, sessionUUID, text, onDelete } = props;

  const [showMenu, setShowMenu] = useState(false);

  const navigation: any = useNavigation();

  const { show } = useDialog();

  return (
    <>
      <TouchableRipple background="rgba(0,0,0,0.32)">
        <Card
          style={style.card}
          onLongPress={() => setShowMenu(true)}
          onPress={() => navigation.push('SessionView', { sessionUUID })}>
          <Card.Cover source={getRandomPicture(sessionUUID)} />
          <Menu
            visible={showMenu}
            onDismiss={() => setShowMenu(false)}
            anchorPosition="top"
            anchor={
              <Card.Title
                title={sessionUUID}
                subtitle={`上次修改：${getTimeStr(lastModified)}`}
              />
            }>
            <Menu.Item
              onPress={() => {
                setShowMenu(false);
                show({
                  title: '删除会话',
                  content: `确定删除会话${sessionUUID}？`,
                  okCallback: () => {
                    onDelete?.(sessionUUID);
                  },
                });
              }}
              title="删除"
            />
          </Menu>
          <Card.Content>
            <Text variant="bodyMedium">{text}</Text>
          </Card.Content>
        </Card>
      </TouchableRipple>
    </>
  );
};

const style = StyleSheet.create({
  card: {
    margin: 10,
  },
});

export default SessionCard;
