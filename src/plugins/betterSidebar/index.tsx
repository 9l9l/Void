/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Flex } from "@components/Flex";
import { Text } from "@components/Text";
import type { SessionTierId, SubscriptionTier } from "@grok-types/enums";
import { SidebarComponents } from "@turbopack/common/components";
import { React } from "@turbopack/common/react";
import { SessionStore, SubscriptionsStore } from "@turbopack/common/stores";
import definePlugin from "@utils/types";

const TIER_DISPLAY: Record<SubscriptionTier, string> = {
    SUBSCRIPTION_TIER_INVALID: "Free",
    SUBSCRIPTION_TIER_X_BASIC: "Basic",
    SUBSCRIPTION_TIER_X_PREMIUM: "Premium",
    SUBSCRIPTION_TIER_X_PREMIUM_PLUS: "Premium+",
    SUBSCRIPTION_TIER_GROK_PRO: "SuperGrok",
    SUBSCRIPTION_TIER_SUPER_GROK_PRO: "SuperGrok Pro",
};

const SESSION_TIER_DISPLAY: Record<SessionTierId, string> = {
    "0": "Free",
    "1": "X Premium",
    "2": "X Premium+",
};

function getPlanName(bestSubscription?: SubscriptionTier, sessionTierId?: SessionTierId) {
    if (bestSubscription) return TIER_DISPLAY[bestSubscription] ?? bestSubscription;
    return SESSION_TIER_DISPLAY[sessionTierId ?? "0"] ?? "Free";
}

function UserInfo() {
    const { open } = SidebarComponents.useSidebar();
    const { user } = SessionStore.useSession();
    const bestSubscription = SubscriptionsStore.useSubscriptionsStore(s => s.bestSubscription);

    if (!open || !user) return null;

    return (
        <Flex flexDirection="column" justifyContent="center" gap="0" className="min-w-0 overflow-hidden">
            <Text as="span" size="sm" weight="medium" className="truncate">
                {user.givenName || user.email?.split("@")[0] || "User"}
            </Text>
            <Text as="span" size="xs" color="secondary" className="truncate">
                {getPlanName(bestSubscription, user.sessionTierId)}
            </Text>
        </Flex>
    );
}

export default definePlugin({
    name: "BetterSidebar",
    description: "Shows your name and plan in the sidebar footer.",
    authors: ["Prism"],

    renderUserInfo() {
        return <UserInfo />;
    },

    patches: [
        {
            find: "AvatarDropdownMenu,{}),",
            replacement: {
                match: /AvatarDropdownMenu,\{\}\)/,
                replace: "$&,$self.renderUserInfo()",
            },
        },
    ],
});
