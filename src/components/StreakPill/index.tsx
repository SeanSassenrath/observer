import React from 'react';

import {StreakPillComponent} from './component';
import {UserStreaks} from '../../contexts/userData';

interface Props {
  streaks: UserStreaks;
}

const StreakPill = (props: Props) => <StreakPillComponent {...props} />;

export default StreakPill;
