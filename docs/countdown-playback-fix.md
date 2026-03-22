# Fix: Meditation countdown doesn't start playback when phone sleeps

## Context

When a user starts a meditation, an 8-second countdown begins (displayed as 5→1). At the 3-second mark, `TrackPlayer.play()` is called. The countdown uses `setInterval`, which iOS suspends when the app is backgrounded (phone locked/sleep). So if the phone sleeps during the countdown, `playTrackPlayer()` never fires until the user wakes the phone.

## Root Cause

`setCountDownTimer()` in `MeditationPlayer.tsx:162-175` relies solely on `setInterval` to trigger `TrackPlayer.play()`. iOS suspends JS timers when backgrounded, so the play call never happens.

## Solution: Silent countdown track

Instead of waiting for a JS timer to call `play()`, start playback immediately with a silent audio track prepended to the queue. This keeps the iOS audio session alive during the countdown, and TrackPlayer automatically advances to the meditation track when the silent track ends.

### Changes:

1. **Create a 5-second silent MP3 file** (`src/assets/silence.mp3`)
   - Generate using macOS `afconvert` or a minimal encoded MP3
   - Bundle it with the app via `require()`

2. **Modify `src/screens/MeditationPlayer.tsx`**
   - In `addTracks()` / `makeTrackList()`: prepend a silent track to the queue:
     ```typescript
     const silenceTrack: Track = {
       url: require('../assets/silence.mp3'),
       title: 'Preparing...',
     };
     _tracks.unshift(silenceTrack);
     ```
   - In the `useEffect` on mount: call `TrackPlayer.play()` immediately after `addTracks()` instead of waiting for the countdown timer
   - Keep the visual countdown timer (`setInterval`) as-is for the UI display -- it still works fine in the foreground. The key difference is that playback no longer depends on the timer firing
   - Update `getTrackState()` track index logic to account for the extra silent track at index 0 (the "real" first meditation is now at index 1)
   - Update `endOfTrack` / `isLastTrack` logic to account for the silent track
   - Update `currentTrackIndex` references that map to `meditationSession.instances` (offset by -1 to skip the silent track)

3. **Adjust track count references**
   - The "Meditation X of Y" display (`tracks.length`, `currentTrackIndex + 1`) needs to exclude the silent track
   - The `isFinishButtonDisabled` check (`time > 3`) stays the same

## Files to modify

- `src/screens/MeditationPlayer.tsx` -- main changes
- `src/assets/silence.mp3` -- new file (generated)

## Verification

1. Start a meditation, lock phone during countdown, wait >5 seconds, unlock -- audio should be playing
2. Start a meditation normally (no lock) -- countdown works, meditation plays as before
3. Playlist mode -- all tracks play in order, track indicator shows correct numbers
4. Breathwork + meditation -- breathwork plays first, then meditation (silent track before both)
5. "Finish" button during meditation -- correct time logged
