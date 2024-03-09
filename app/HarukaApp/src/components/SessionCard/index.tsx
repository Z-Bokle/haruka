import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Menu, Text, TouchableRipple } from 'react-native-paper';
import { useDialog } from '../../utils/AppStores';

type SessionProps = {
  /** 上次更新时间 */
  lastModified: number;
  /** 会话UUID */
  sessionUUID: string;
  /** 文本 */
  text?: string;
  /** BaseVideo的缩略图 */
  baseVideoFrame?: string;
};

export type Session = SessionProps;

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
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const SessionCard = (props: SessionProps) => {
  const { lastModified, sessionUUID, text, baseVideoFrame } = props;

  const [showMenu, setShowMenu] = useState(false);

  const { show } = useDialog();

  return (
    <>
      <Menu
        visible={showMenu}
        onDismiss={() => setShowMenu(false)}
        anchor={
          <TouchableRipple background="rgba(0,0,0,0.32)">
            <Card style={style.card} onLongPress={() => setShowMenu(true)}>
              <Card.Cover
                source={
                  baseVideoFrame
                    ? { uri: baseVideoFrame }
                    : getRandomPicture(sessionUUID)
                }
              />
              <Card.Title
                title={sessionUUID}
                subtitle={`上次修改：${getTimeStr(lastModified)}`}
              />
              <Card.Content>
                <Text variant="bodyMedium">{text}</Text>
              </Card.Content>
            </Card>
          </TouchableRipple>
        }>
        <Menu.Item
          onPress={() => {
            setShowMenu(false);
            show({
              title: '删除会话',
              content: `确定删除会话${sessionUUID}？`,
              okCallback: () => {
                // TODO 删除会话
                console.log('删除会话');
              },
            });
          }}
          title="删除"
        />
      </Menu>
    </>
  );
};

const style = StyleSheet.create({
  card: {
    margin: 10,
  },
});

export default SessionCard;
