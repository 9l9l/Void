/** Read/unread status of a notification from the API. */
export type NotificationStatus =
    | "NOTIFICATION_STATUS_UNREAD"
    | "NOTIFICATION_STATUS_READ"
    | (string & {});

/** Notification type/category identifiers. */
export type NotificationType =
    | "share_request"
    | (string & {});
