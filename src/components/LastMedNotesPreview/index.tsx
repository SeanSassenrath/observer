import React, {useContext} from 'react';
import {LastMedNotesPreviewComponent} from './component';
import MeditationHistoryContext from '../../contexts/meditationHistory';
import {meditationBaseMap} from '../../constants/meditation-data';
import {MeditationInstance} from '../../types';
import {DateTime} from 'luxon';

const EMPTY_STRING = '';

interface Props {
  onPress(): void;
}

const LastMedNotesPreview = (props: Props) => {
  const {meditationHistory} = useContext(MeditationHistoryContext);
  const meditationInstance =
    meditationHistory &&
    meditationHistory.meditationInstances &&
    meditationHistory.meditationInstances[0];
  const meditation =
    meditationInstance &&
    meditationBaseMap[meditationInstance.meditationBaseId];

  const getDisplayDate = (item: MeditationInstance) => {
    if (item.meditationStartTime) {
      const date = DateTime.fromSeconds(item.meditationStartTime);
      return date.toLocaleString(DateTime.DATETIME_SHORT);
    } else {
      return EMPTY_STRING;
    }
  };

  const meditationDate =
    meditationInstance && getDisplayDate(meditationInstance);

  return (
    <LastMedNotesPreviewComponent
      meditation={meditation}
      meditationDate={meditationDate}
      {...props}
    />
  );
};

export default LastMedNotesPreview;
