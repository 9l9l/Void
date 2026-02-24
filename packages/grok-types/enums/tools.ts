/**
 * Tool name identifiers used by Grok's tool execution system.
 * These map to the keys in `SettingsStore.TOOL_NAMES`.
 */
export type ToolName =
    | "web_search"
    | "google_web_search"
    | "bing_web_search"
    | "web_search_with_snippets"
    | "browse_page_with_js"
    | "browse_page_no_js"
    | "code_execution_training_parity"
    | "get_x_user_handle"
    | "get_x_user_profile_pic_description"
    | "x_post_lookup"
    | "x_search"
    | "x_keyword_search"
    | "x_semantic_search"
    | "get_top_us_news_from_x_trends"
    | "get_x_user_timeline"
    | "get_x_bookmarks"
    | "get_x_liked_posts"
    | "render_x_posts"
    | "render_x_users"
    | "render_card";
