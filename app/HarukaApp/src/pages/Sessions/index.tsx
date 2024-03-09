import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import SessionCard, { Session } from '../../components/SessionCard';
import { useNetwork } from '../../utils/Network';
import { session } from '../../api';
import { AnimatedFAB } from 'react-native-paper';

function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);

  const [refreshing, setRefreshing] = useState(false);
  const [extendFAB, setExtendFAB] = useState(false);

  const { jsonGet, jsonPost } = useNetwork();

  useEffect(() => {
    jsonGet(session.list).then(res => setSessions(res));
  }, [jsonGet]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    jsonGet(session.list).then(res => {
      setSessions(res);
      setRefreshing(false);
    });
  }, [jsonGet]);

  const handleCreateSession = useCallback(() => {
    // TODO 创建会话，在完成Session表单页后实现
  }, []);

  const handleDeleteSession = useCallback(
    (sessionUUID: string) => {
      jsonPost(session.remove, { sessionUUID }).then(res => {
        if (res) {
          ToastAndroid.show('删除成功', ToastAndroid.LONG);
          setSessions(
            sessions.filter(item => item.sessionUUID !== sessionUUID),
          );
        }
      });
    },
    [jsonPost, sessions],
  );

  return (
    <View style={style.container}>
      <StatusBar backgroundColor="#F5FCFF" />
      <SafeAreaView>
        <FlatList
          style={style.list}
          data={sessions}
          renderItem={({ item }) => (
            <SessionCard {...item} onDelete={handleDeleteSession} />
          )}
          keyExtractor={item => item.sessionUUID}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onScroll={({ nativeEvent }) => {
            const currentScrollPosition =
              Math.floor(nativeEvent.contentOffset.y) ?? 0;
            setExtendFAB(currentScrollPosition > 20);
          }}
        />
        <AnimatedFAB
          icon="plus"
          label="新建会话"
          onPress={handleCreateSession}
          extended={extendFAB}
          visible={!refreshing}
          animateFrom="right"
          style={style.fab}
        />
      </SafeAreaView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    width: '100%',
    height: '100%',
  },
  item: {
    width: '100%',
    height: 200,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Sessions;
