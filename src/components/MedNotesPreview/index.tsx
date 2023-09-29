import React from 'react';
import {MedNotesPreviewComponent} from './component';
import {MeditationBase, MeditationInstance} from '../../types';
import {DateTime} from 'luxon';

const EMPTY_STRING = '';

interface Props {
  meditation?: MeditationBase;
  meditationInstance?: MeditationInstance;
  onPress(): void;
}

const MedNotesPreview = (props: Props) => {
  const {meditation, meditationInstance} = props;

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

  return (
    <MedNotesPreviewComponent
      meditation={meditation}
      meditationDate={meditationDate}
      {...props}
    />
  );
};

export default MedNotesPreview;
