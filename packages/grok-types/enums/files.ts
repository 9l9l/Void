/**
 * File source types as used by `GrokApiV2UploadedFileSourceType`.
 * Determines how a file was uploaded or generated.
 */
export type FileSourceType =
	| "SELF_UPLOAD_FILE_SOURCE"
	| "GOOGLE_DRIVE_FILE_SOURCE"
	| "ONE_DRIVE_FILE_SOURCE"
	| "IMAGINE_SELF_UPLOAD_FILE_SOURCE"
	| "IMAGINE_GENERATED_FILE_SOURCE"
	| (string & {});

/**
 * Artifact inline display status.
 * Controls whether model-generated artifacts render inline or in the sidebar.
 */
export type ArtifactInlineStatus =
	| "DEFAULT_ARTIFACT_INLINE_STATUS"
	| "SHOW_INLINE_ARTIFACT_INLINE_STATUS"
	| "SHOW_SIDEBAR_ARTIFACT_INLINE_STATUS"
	| (string & {});

/** Ordering options for asset repository queries. */
export type AssetOrderBy =
	| "ORDER_BY_INVALID"
	| "ORDER_BY_RELEVANCY"
	| "ORDER_BY_CREATE_TIME"
	| "ORDER_BY_LAST_USE_TIME"
	| "ORDER_BY_NAME"
	| "ORDER_BY_MIME_TYPE"
	| "ORDER_BY_CONTENT_SIZE"
	| (string & {});

/** Asset search source filter. */
export type AssetSearchSource =
	| "SOURCE_ANY"
	| "SOURCE_UPLOADED"
	| "SOURCE_GENERATED"
	| (string & {});

/**
 * File type identifiers from Grok's `FILE_DESCRIPTIONS` registry.
 * Each ID maps to a {@link FileTypeDescriptor} with extensions, MIME types, and icons.
 */
export type FileTypeId =
	| "markdown"
	| "csv"
	| "tsv"
	| "excel"
	| "google-sheets"
	| "numbers"
	| "image"
	| "pdf"
	| "text"
	| "json"
	| "xml"
	| "yaml"
	| "toml"
	| "html"
	| "css"
	| "javascript"
	| "typescript"
	| "python"
	| "java"
	| "kotlin"
	| "swift"
	| "c"
	| "cpp"
	| "csharp"
	| "go"
	| "rust"
	| "ruby"
	| "php"
	| "scala"
	| "r"
	| "shell"
	| "sql"
	| "graphql"
	| "protobuf"
	| "dart"
	| "lua"
	| "perl"
	| "haskell"
	| "elixir"
	| "clojure"
	| "docker"
	| "terraform"
	| "word"
	| "google-docs"
	| "powerpoint"
	| "google-slides"
	| (string & {});

/**
 * High-level file category groupings.
 * Used by `getFileCategoryForAsset` to classify files into broad groups.
 */
export type FileCategory =
	| "markdown"
	| "csv"
	| "spreadsheet"
	| "image"
	| "code"
	| "unknown"
	| (string & {});
