/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Authenticated Grok user profile returned by the session API.
 *
 * Populated on login and refreshed via `SessionStore.refreshSession()`.
 * Fields prefixed with `x` relate to the linked X (Twitter) account.
 */
export interface GrokUser {
    /** Unique session identifier, rotated on each login. */
    sessionId: string;
    /** Persistent user UUID across sessions. */
    userId: string;
    /** Primary email address associated with the account. */
    email: string;
    /** User's family (last) name. May be empty if not set. */
    familyName: string;
    /** User's given (first) name. */
    givenName: string;
    /** Linked X (Twitter) user ID. Empty string if not linked. */
    xUserId: string;
    /** Linked X (Twitter) username (handle). Empty string if not linked. */
    xUsername: string;
    /** Whether the email address has been verified. */
    emailConfirmed: boolean;
    /** X subscription tier (e.g. "Premium", "Premium+"). Empty if no X subscription. */
    xSubscriptionType: string;
    /** Grok subscription tier ID. "2" = SuperGrok, "1" = free, etc. */
    sessionTierId: string;
    /** User's date of birth as Unix epoch seconds, or null if not provided. */
    birthDate: { seconds: number } | null;
    /** Enterprise organization ID, or null for individual users. */
    organizationId: string | null;
    /** Organization type enum. 0 = none/individual. */
    organizationType: number;
    /** Account creation timestamp as Unix epoch seconds. */
    createTime: number;
    /** URL to the user's profile avatar image. */
    profileImageUrl: string;
}
