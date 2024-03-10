import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import { Session } from '../../components/SessionCard';

export interface SessionDetailsProps {
  session: Session;
}

const SessionDetails = (props: SessionDetailsProps) => {
  const { session: baseSession } = props;
  const [session, setSession] = useState(baseSession);

  return <Text>SessionDetail</Text>;
};

export default SessionDetails;
