import type { FileMetadata } from "../common/Asset";
import type { FileSourceType } from "../enums/files";
import type { ZustandStore } from "../zustand";

/**
 * A pending file upload entry in the FileStore.
 * Tracks both the File object and the upload promise with optional resolved metadata.
 */
export interface PendingFileUpload {
	/** The browser File object being uploaded. */
	file: File;
	/** Promise resolving to the upload response (or rejecting on failure). */
	metadataPromise: Promise<any>;
	/** Resolved metadata from the upload API, set after successful upload. */
	metadata?: FileMetadata | Error;
}

/**
 * Zustand state for file upload and metadata management.
 *
 * Module ID: **688578**. Manages file uploads, metadata caching, third-party
 * file attachments, and per-conversation file lists. Used by the chat input
 * bar for file attachments and by workspace file management.
 */
export interface FileStoreState {
	/** Pending file uploads keyed by conversation ID. */
	listByConversationId: Record<string, PendingFileUpload[]>;
	/** In-flight metadata fetch promises keyed by file metadata ID. */
	fileMetaPromiseById: Record<string, Promise<FileMetadata>>;
	/** Cached file metadata keyed by file metadata ID. */
	fileMetaById: Record<string, FileMetadata>;
	/** Third-party file attachments keyed by conversation ID. */
	attachListByConversationId: Record<string, any[]>;
	/** Whether the file input dialog has been requested to open. */
	requestFileInput: boolean;
	/** Number of files currently being uploaded. */
	uploadingFilesCount: number;

	/** Add a pending file upload to a conversation's list. */
	lisertByConversationId: (item: PendingFileUpload, conversationId: string) => void;
	/** Remove a file from a conversation's pending upload list. */
	removeByConversationId: (conversationId: string) => void;
	/** Remove a specific file entry from a conversation's list by file reference. */
	delistByConversationId: (conversationId: string, file: File) => boolean;
	/** Insert or update cached file metadata by ID. */
	upsertFileMetadata: (metadata: FileMetadata) => void;
	/** Insert an in-flight metadata fetch promise by ID. */
	idsertFileMetadataPromise: (promise: Promise<FileMetadata>, id: string) => void;
	/** Add a third-party attachment to a conversation's attach list. */
	lisertAttachByConversationId: (item: any, conversationId: string) => void;
	/** Remove a third-party attachment list for a conversation. */
	removeAttachByConversationId: (conversationId: string) => void;
	/** Remove a specific third-party attachment by asset ID. */
	delistAttachByConversationId: (conversationId: string, assetId: string) => boolean;

	/** Reset all file store state to defaults. */
	clear: () => void;
	/** Request the file input dialog to open. */
	setRequestFileInput: () => void;
	/** Clear the file input request flag. */
	clearRequestFileInput: () => void;

	/**
	 * Upload a file and track it in the conversation's pending list.
	 * @param file - The browser File to upload.
	 * @param conversationId - Target conversation ID.
	 * @param fileSource - How the file was sourced.
	 * @param addToList - Whether to add to the conversation list (default: true).
	 */
	fetchUploadFile: (
		file: File,
		conversationId: string,
		fileSource: FileSourceType,
		addToList?: boolean,
	) => PendingFileUpload;

	/**
	 * Fetch file metadata by ID with caching.
	 * Returns cached metadata if available, otherwise fetches from the API.
	 */
	fetchFileMetadata: (fileMetadataId: string) => Promise<FileMetadata>;

	/**
	 * Upload a third-party file (Google Drive, OneDrive) and attach it.
	 * @param fileName - Display name of the file.
	 * @param fileMimeType - MIME type of the file.
	 * @param fileSource - Third-party source type.
	 * @param thirdPartyFileId - External file identifier.
	 * @param conversationId - Target conversation ID.
	 */
	fetchAttachThirdPartyFile: (
		fileName: string,
		fileMimeType: string,
		fileSource: FileSourceType,
		thirdPartyFileId: string,
		conversationId: string,
	) => PendingFileUpload;
}

/** Module exports for the File store (module **688578**). */
export interface FileStoreModule {
	/** Zustand store hook for file state. */
	useFileStore: ZustandStore<FileStoreState>;
}
