/*
 * Void, a modification for grok.com
 * Copyright (c) 2026 Void contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Flex } from "@components/Flex";
import { Text } from "@components/Text";
import { SidebarComponents } from "@turbopack/common/components";
import { React } from "@turbopack/common/react";
import { SessionStore, SubscriptionUtils } from "@turbopack/common/stores";
import definePlugin from "@utils/types";

function UserInfo() {
    const { open } = SidebarComponents.useSidebar();
    const { user } = SessionStore.useSession();
    const sub = SubscriptionUtils.useSubscriptions().bestSubscription;

    if (!open || !user) return null;

    return (
        <Flex flexDirection="column" justifyContent="center" gap="0" className="min-w-0 overflow-hidden">
            <Text as="span" size="sm" weight="medium" className="truncate">
                {user.givenName || user.email?.split("@")[0] || "User"}
            </Text>
            <Text as="span" size="xs" color="secondary" className="truncate">
                {sub?.tier ? SubscriptionUtils.getSubscriptionTierName(sub.tier) : "Free"}
            </Text>
        </Flex>
    );
}

export default definePlugin({
    name: "Sidebar",
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
