/** WebRTC voice connection lifecycle states. */
export type VoiceConnectionStatus = "disconnected" | "connecting" | "connected" | (string & {});

/** Voice mode activity states for the microphone/speaker indicator. */
export type VoiceActivityStatus = "idle" | "speaking" | "listening" | (string & {});
