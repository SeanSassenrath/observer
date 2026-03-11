import {Share} from 'react-native';
import {Playlist} from '../types';
import {playlistGradients} from '../constants/colors';

const SHARE_BASE_URL = 'https://unlimited-meditations.github.io/share/';

// Pure-JS base64 helpers — btoa/atob are not available in RN 0.72 / Hermes
const B64_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function b64Encode(str: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c < 0x80) {
      bytes.push(c);
    } else if (c < 0x800) {
      bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else if (c < 0xd800 || c >= 0xe000) {
      bytes.push(
        0xe0 | (c >> 12),
        0x80 | ((c >> 6) & 0x3f),
        0x80 | (c & 0x3f),
      );
    } else {
      // surrogate pair
      i++;
      const c2 =
        0x10000 + (((c & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      bytes.push(
        0xf0 | (c2 >> 18),
        0x80 | ((c2 >> 12) & 0x3f),
        0x80 | ((c2 >> 6) & 0x3f),
        0x80 | (c2 & 0x3f),
      );
    }
  }
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = bytes[i + 1] ?? 0;
    const b2 = bytes[i + 2] ?? 0;
    result += B64_CHARS[b0 >> 2];
    result += B64_CHARS[((b0 & 3) << 4) | (b1 >> 4)];
    result +=
      i + 1 < bytes.length ? B64_CHARS[((b1 & 15) << 2) | (b2 >> 6)] : '=';
    result += i + 2 < bytes.length ? B64_CHARS[b2 & 63] : '=';
  }
  return result;
}

function b64Decode(str: string): string {
  const lookup: Record<string, number> = {};
  for (let i = 0; i < B64_CHARS.length; i++) {
    lookup[B64_CHARS[i]] = i;
  }
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i += 4) {
    const b0 = lookup[str[i]] ?? 0;
    const b1 = lookup[str[i + 1]] ?? 0;
    const b2 = lookup[str[i + 2]] ?? 0;
    const b3 = lookup[str[i + 3]] ?? 0;
    bytes.push((b0 << 2) | (b1 >> 4));
    if (str[i + 2] !== '=') {
      bytes.push(((b1 & 15) << 4) | (b2 >> 2));
    }
    if (str[i + 3] !== '=') {
      bytes.push(((b2 & 3) << 6) | b3);
    }
  }
  let result = '';
  for (let i = 0; i < bytes.length; ) {
    const b = bytes[i];
    if (b < 0x80) {
      result += String.fromCharCode(b);
      i += 1;
    } else if ((b & 0xe0) === 0xc0) {
      result += String.fromCharCode(((b & 0x1f) << 6) | (bytes[i + 1] & 0x3f));
      i += 2;
    } else if ((b & 0xf0) === 0xe0) {
      result += String.fromCharCode(
        ((b & 0x0f) << 12) |
          ((bytes[i + 1] & 0x3f) << 6) |
          (bytes[i + 2] & 0x3f),
      );
      i += 3;
    } else {
      const c =
        ((b & 0x07) << 18) |
        ((bytes[i + 1] & 0x3f) << 12) |
        ((bytes[i + 2] & 0x3f) << 6) |
        (bytes[i + 3] & 0x3f);
      result += String.fromCodePoint(c);
      i += 4;
    }
  }
  return result;
}

export interface ShareablePlaylist {
  v: 1;
  name: string;
  description?: string;
  meditationIds: string[];
  gradientIndex?: number;
}

export const encodePlaylist = (playlist: Playlist): string => {
  const payload: ShareablePlaylist = {
    v: 1,
    name: playlist.name,
    meditationIds: playlist.meditationIds,
  };
  if (playlist.description) {
    payload.description = playlist.description;
  }
  if (playlist.gradientIndex !== undefined) {
    payload.gradientIndex = playlist.gradientIndex;
  }
  const json = JSON.stringify(payload);
  const encoded = b64Encode(json)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `${SHARE_BASE_URL}?data=${encoded}`;
};

export const decodePlaylist = (url: string): ShareablePlaylist | null => {
  try {
    const match = url.match(/[?&]data=([^&]+)/);
    if (!match) {
      return null;
    }
    const encoded = match[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = b64Decode(encoded);
    const payload = JSON.parse(json) as ShareablePlaylist;

    if (
      !payload ||
      typeof payload.name !== 'string' ||
      !Array.isArray(payload.meditationIds)
    ) {
      return null;
    }

    // Apply safety caps
    payload.name = payload.name.slice(0, 200);
    if (payload.description) {
      payload.description = payload.description.slice(0, 1000);
    }
    payload.meditationIds = payload.meditationIds.slice(0, 200);
    if (payload.gradientIndex !== undefined) {
      payload.gradientIndex = Math.max(
        0,
        Math.min(playlistGradients.length - 1, Math.floor(payload.gradientIndex)),
      );
    }

    return payload;
  } catch {
    return null;
  }
};

export const sharePlaylist = async (playlist: Playlist): Promise<void> => {
  const url = encodePlaylist(playlist);
  await Share.share({message: url, title: playlist.name});
};
