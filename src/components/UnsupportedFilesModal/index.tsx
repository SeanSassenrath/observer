import {useContext} from 'react';

import {UnsupportedFilesModalComponent} from './component';
import UnsupportedFilesContext from '../../contexts/unknownFiles';

const UnsupportedFilesModal = () => {
  const {unsupportedFiles, setUnsupportedFiles} = useContext(
    UnsupportedFilesContext,
  );

  const isVisible = unsupportedFiles.length > 0;

  return (
    <UnsupportedFilesModalComponent
      unsupportedFiles={unsupportedFiles}
      setUnsupportedFiles={setUnsupportedFiles}
      isVisible={isVisible}
    />
  );
};

export default UnsupportedFilesModal;
