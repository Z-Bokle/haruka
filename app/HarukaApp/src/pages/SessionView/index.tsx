import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { joinQueries, useNetwork } from '../../utils/Network';
import { session as sessionApi } from '../../api';
import { Session } from '../../components/SessionCard';
import { Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

const SessionView = () => {
  const { jsonPost, jsonGet } = useNetwork();

  const navigation: any = useNavigation();
  const route = useRoute();

  const { sessionUUID } = route.params;

  const [session, setSession] = useState<Session>();
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    (async () => {
      console.log(sessionUUID);

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
    <View>
      <Text>{session?.sessionUUID}</Text>
    </View>
  );
};

export default SessionView;
