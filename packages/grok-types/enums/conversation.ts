/** Conversation mode controlling the type of interaction. */
export type ConversationMode = "chat" | "deep_search" | (string & {});

/** Conversation lifecycle state. */
export type ConversationState = "open" | "closed" | (string & {});

/** Response sender identifying who authored a message. */
export type ResponseSender = "human" | "assistant" | (string & {});
