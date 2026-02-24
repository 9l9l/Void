/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Grok subscription tier identifiers from the API.
 *
 * Used in subscription objects (`activeSubscriptions[].tier`) and the
 * `GrokApiV2SubscriptionTier` enum. Ordered by privilege level ascending.
 */
export type SubscriptionTier =
    | "SUBSCRIPTION_TIER_INVALID"
    | "SUBSCRIPTION_TIER_X_BASIC"
    | "SUBSCRIPTION_TIER_X_PREMIUM"
    | "SUBSCRIPTION_TIER_X_PREMIUM_PLUS"
    | "SUBSCRIPTION_TIER_GROK_PRO"
    | "SUBSCRIPTION_TIER_SUPER_GROK_PRO"
    | (string & {});

/**
 * Numeric privilege level for each subscription tier.
 * Higher number = more access. Used by `getSubscriptionLevel()` to rank tiers.
 *
 * | Tier                         | Level | Display Name  |
 * |------------------------------|-------|---------------|
 * | SUBSCRIPTION_TIER_INVALID    | 0     | Free          |
 * | SUBSCRIPTION_TIER_X_BASIC    | 1     | Basic         |
 * | SUBSCRIPTION_TIER_X_PREMIUM  | 2     | Premium       |
 * | SUBSCRIPTION_TIER_X_PREMIUM_PLUS | 3 | PremiumPlus   |
 * | SUBSCRIPTION_TIER_GROK_PRO   | 4     | SuperGrok     |
 * | SUBSCRIPTION_TIER_SUPER_GROK_PRO | 5 | SuperGrokPro  |
 */
export type SubscriptionTierLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Display name for each subscription tier.
 * Returned by `getSubscriptionLevel()` and used in UI strings.
 */
export type SubscriptionTierName =
    | "Free"
    | "Basic"
    | "Premium"
    | "PremiumPlus"
    | "SuperGrok"
    | "SuperGrokPro"
    | (string & {});

/** Subscription lifecycle status from the API. */
export type SubscriptionStatus =
    | "SUBSCRIPTION_STATUS_INVALID"
    | "SUBSCRIPTION_STATUS_ACTIVE"
    | "SUBSCRIPTION_STATUS_INACTIVE"
    | (string & {});
