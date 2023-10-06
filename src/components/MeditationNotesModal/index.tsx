import React from 'react';

import {MeditationNotesModalComponent} from './component';
import {MeditationBase, MeditationInstance} from '../../types';
import {ModalProps} from '@ui-kitten/components';
import {DateTime} from 'luxon';
import {useNavigation} from '@react-navigation/native';

const EMPTY_STRING = '';

interface Props extends ModalProps {
  meditation?: MeditationBase;
  meditationInstance?: MeditationInstance;
  showStartMeditation: boolean;
}

const MeditationNotesModal = (props: Props) => {
  const {meditationInstance, meditation, onBackdropPress} = props;

  const navigation = useNavigation();

  const getDisplayDate = (item: MeditationInstance) => {
    if (item.meditationStartTime) {
      const date = DateTime.fromSeconds(item.meditationStartTime);
      return date.toLocaleString(DateTime.DATE_SHORT);
    } else {
      return EMPTY_STRING;
    }
  };

  const meditationDate =
    meditationInstance && getDisplayDate(meditationInstance);

  const meditationBaseId = meditation?.meditationBaseId;

  const meditationLink = () => {
    if (meditationBaseId && onBackdropPress !== undefined) {
      onBackdropPress();
      navigation.navigate('Meditation', {
        id: meditationBaseId,
      });
    }
  };

  return (
    <MeditationNotesModalComponent
      {...props}
      meditationDate={meditationDate}
      meditationLink={meditationLink}
    />
  );
};

export default MeditationNotesModal;
