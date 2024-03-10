import { useEffect, useState } from 'react';
import { useNetwork } from '../utils/Network';
import { text } from '../api';

interface PrePrompts {
  id: number;
  name: string;
  description: string;
}

export const usePreprompts = () => {
  const [prePrompts, setPrePrompts] = useState<PrePrompts[]>([]);

  const { jsonGet } = useNetwork();

  useEffect(() => {
    jsonGet(text.listPrePrompts).then(data => setPrePrompts(data));
  }, [jsonGet]);

  return { prePrompts };
};
