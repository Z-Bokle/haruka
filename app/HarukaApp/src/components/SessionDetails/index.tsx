import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import { Session } from '../../components/SessionCard';
import { View } from 'react-native';

export interface SessionDetailsProps {
  session: Session;
}

const SessionDetails = (props: SessionDetailsProps) => {
  const { session: baseSession } = props;
  const [session, setSession] = useState(baseSession);
  const [isSaved, setIsSaved] = useState(true);

  return (
    <View>
      <Text>{session.sessionUUID}</Text>
    </View>
  );
};

export default SessionDetails;
