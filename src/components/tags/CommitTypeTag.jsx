import React, { useMemo } from 'react';
import PillTag from './PillTag';
import TIPO_COMMIT_CORES from '../../utils/Colors';

const getTypeColor = (tipo) => {
  const key = (tipo || 'DEFAULT').toUpperCase();
  return TIPO_COMMIT_CORES[key] || TIPO_COMMIT_CORES.DEFAULT;
};

function CommitTypeTag({ tipo }) {
  const label = tipo || 'Sem tipo';
  const color = useMemo(() => getTypeColor(tipo), [tipo]);
  return <PillTag label={label} color={color} title={`Tipo de commit: ${label}`} />;
}

export default React.memo(CommitTypeTag);
