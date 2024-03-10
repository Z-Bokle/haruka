import { useEffect, useState } from 'react';
import { useNetwork } from '../utils/Network';
import { text } from '../api';

interface Model {
  modelName: string;
  modelId: number;
}

export const useModels = () => {
  const [models, setModels] = useState<Model[]>([]);

  const { jsonGet } = useNetwork();

  useEffect(() => {
    jsonGet(text.listModel).then(data => setModels(data));
  }, [jsonGet]);

  return { models };
};
