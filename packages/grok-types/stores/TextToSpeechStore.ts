import type { PlaybackStatus } from "../enums/tts";
import type { ZustandStore } from "../zustand";

/**
 * Zustand state for text-to-speech playback, managing audio streams
 * and player lifecycle. Supports streaming audio from response text
 * with playback rate control and skip.
 */
export interface TextToSpeechStoreState {
    /** Cancel function for the current audio stream, or null. */
    cancelStream: (() => void) | null;
    /** Whether the browser supports advanced playback controls. */
    supportsPlaybackControls: boolean;
    /** Audio player element, or null when unmounted. */
    player: HTMLAudioElement | null;
    /** Stream ID of the currently playing response, or null. */
    currentStreamId: string | null;
    /** Current playback speed multiplier (1 = normal). */
    playbackRate: number;
    /** Current playback status. */
    playbackStatus: PlaybackStatus;

    /** Set the playback speed multiplier. */
    setPlaybackRate: (rate: number) => void;
    /** Get the playback status for a specific stream ID. */
    getPlaybackStatus: (streamId: string) => PlaybackStatus;
    /** Skip forward or backward by an offset in seconds. */
    skipOffset: (offset: number) => void;
    /** Toggle between playing and paused states. */
    togglePlayback: () => void;
    /** Start TTS playback for a response. */
    playTextToSpeechForResponse: (responseId: string, text: string) => Promise<void>;
    /** Stop TTS playback. */
    stopTextToSpeech: (reason?: string) => void;
}

/** Module exports for the TextToSpeech store. */
export interface TextToSpeechStoreModule {
    /** Zustand store hook for TTS state. */
    useTextToSpeechStore: ZustandStore<TextToSpeechStoreState>;
}
