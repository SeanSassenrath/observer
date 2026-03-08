import analytics from '@react-native-firebase/analytics';
import {MeditationBaseId, MeditationName} from '../types';

export enum Source {
  'APP_INITIALIZATION' = 'app_initialization',
  'MEDITATION_ADD' = 'meditation_add',
  'MEDITATION_PLAYER' = 'meditation_player',
  'THINKBOX' = 'thinkbox',
  'NOTIFICATION_MODAL' = 'notif_modal',
  'PROFILE' = 'profile',
}

export enum Action {
  'CLICK' = 'click',
  'DENIED' = 'denied',
  'ENABLE' = 'enable',
  'FAIL' = 'fail',
  'SKIP' = 'skip',
  'SUBMIT' = 'submit',
  'VIEW' = 'view',
}

export enum Noun {
  'BUTTON' = 'button',
  'ON_MOUNT' = 'on_mount',
  'ON_PLAY' = 'on_play',
}

interface MeditationPlayerPayload {
  meditationName: MeditationName;
  meditationBaseId: MeditationBaseId;
}

interface ThinkBoxPayload {
  meditationName: MeditationName;
  meditationBaseId: MeditationBaseId;
}

interface MeditationAddPayload {
  [key: string]: string | number;
}

type Payload =
  | MeditationPlayerPayload
  | MeditationAddPayload
  | ProfileNotifEnabled;

interface Event {
  source: Source;
  action: Action;
  noun: Noun;
  payload?: Payload;
}

const sendEvent = async (event: Event) => {
  await analytics().logEvent(event.source, {
    action: event.action,
    noun: event.noun,
    ...event.payload,
  });
};

export const meditationPlayerSendEvent = (
  action: Action,
  noun: Noun,
  payload: MeditationPlayerPayload,
) => {
  sendEvent({
    source: Source.MEDITATION_PLAYER,
    action,
    noun,
    payload,
  });
};

export const thinkboxSendEvent = (
  action: Action,
  noun: Noun,
  payload: ThinkBoxPayload,
) => {
  sendEvent({
    source: Source.THINKBOX,
    action,
    noun,
    payload,
  });
};

export const meditationAddSendEvent = (
  action: Action,
  noun: Noun,
  payload?: MeditationAddPayload,
) => {
  sendEvent({
    source: Source.MEDITATION_ADD,
    action,
    noun,
    payload,
  });
};

export const appInitializationSendEvent = (action: Action, noun: Noun) => {
  sendEvent({
    source: Source.APP_INITIALIZATION,
    action,
    noun,
  });
};

export const notificationModalSendEvent = async (
  action: Action,
  noun: Noun,
) => {
  await sendEvent({
    source: Source.NOTIFICATION_MODAL,
    action,
    noun,
  });
};

interface ProfileNotifEnabled {
  isEnabled: boolean;
}

export const profileNotifEnabledSendEvent = async (
  action: Action,
  noun: Noun,
  payload: ProfileNotifEnabled,
) => {
  await sendEvent({
    source: Source.NOTIFICATION_MODAL,
    action,
    noun,
    payload,
  });
};
