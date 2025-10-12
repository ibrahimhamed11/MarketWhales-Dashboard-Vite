# MuxPlayer Component

A single, clean MUX video player component with new screen functionality.

## Features

- ✅ Single file, no customization complexity
- ✅ Automatic Mux stream loading
- ✅ Built-in loading and error states
- ✅ New screen/modal playback option
- ✅ Clean, minimal interface
- ✅ Progress tracking support

## Usage

```jsx
import MuxPlayer from './components/MuxPlayer';

// Basic usage
<MuxPlayer videoId="your-video-id" />

// With callbacks and options
<MuxPlayer 
  videoId="your-video-id"
  autoPlay={false}
  showNewScreenButton={true}
  onProgress={(progress) => console.log(progress)}
  onError={(error) => console.error(error)}
  onEnded={() => console.log('Video ended')}
  style={{ maxWidth: '800px' }}
/>
```

## Props

- `videoId` (string, required): The MUX video ID
- `autoPlay` (boolean, default: false): Auto-play the video
- `showNewScreenButton` (boolean, default: true): Show the new screen button
- `onProgress` (function): Progress callback with currentTime, duration, played
- `onError` (function): Error callback
- `onEnded` (function): Video ended callback
- `style` (object): Custom styles for the player container

## New Screen Feature

Click the "Open in new screen" button (top-right) to play the video in a full-screen modal.
The modal can be closed with the X button or by pressing Escape.

## Notes

- Automatically tries admin stream first, falls back to user stream
- Handles authentication with localStorage tokens
- No complex customization - keep it simple!
