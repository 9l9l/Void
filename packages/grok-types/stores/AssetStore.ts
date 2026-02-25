import type { AssetMetadata } from "../common/Asset";
import type { ZustandStore } from "../zustand";

/** Paginated asset list result. */
export interface AssetListResult {
    /** Assets in this page. */
    assets: AssetMetadata[];
    /** Token for fetching the next page, or empty string if done. */
    nextPageToken: string;
}

/**
 * Zustand state for the asset repository, managing user assets (files, artifacts).
 * Assets are keyed by UUID and lists are keyed by request parameters.
 */
export interface AssetStoreState {
    /** Cached assets keyed by asset ID. */
    byId: Record<string, AssetMetadata>;
    /** In-flight fetch promises keyed by asset ID. */
    promiseById: Record<string, Promise<any>>;
    /** Paginated asset list results keyed by request key. */
    listByReq: Record<string, AssetListResult>;
    /** In-flight list fetch promises keyed by request key. */
    promiseListByReq: Record<string, Promise<any>>;

    /** Insert or update an asset in the cache. */
    upsertAsset: (asset: AssetMetadata) => void;
    /** Append assets to the cache. */
    appendAssets: (assets: AssetMetadata[]) => void;
    /** Remove an asset from the cache by ID. */
    removeAsset: (id: string) => void;
    /** Insert or update a fetch promise for an asset ID. */
    idsertPromise: (id: string, promise: Promise<any>) => void;
    /** Remove a fetch promise by asset ID. */
    removePromise: (id: string) => void;
    /** Insert or update a list result by request key. */
    idsertList: (key: string, result: AssetListResult) => void;
    /** Insert or update a list promise by request key. */
    idsertPromiseList: (key: string, promise: Promise<any>) => void;
    /** Reset the store to initial state. */
    clear: () => void;

    /** Create a new asset via the API. */
    fetchCreateAsset: (params: any) => Promise<any>;
    /** Delete an asset by ID. */
    fetchDeleteAsset: (params: any) => Promise<any>;
    /** Delete asset metadata only. */
    fetchDeleteAssetMetadata: (params: any) => Promise<any>;
    /** Fetch a single asset by ID. */
    fetchGetAsset: (params: any) => Promise<any>;
    /** Fetch a paginated list of assets. */
    fetchListAssets: (params: any) => Promise<any>;
    /** Search assets by query. */
    fetchSearchAssets: (params: any) => Promise<any>;
    /** Fetch all versions of an asset. */
    fetchListAllAssetVersions: (params: any) => Promise<any>;
    /** Update an existing asset. */
    fetchUpdateAsset: (params: any) => Promise<any>;
    /** Reset an asset's conversation association. */
    fetchResetAssetConversation: (params: any) => Promise<any>;
    /** Share an asset with others. */
    fetchShareAsset: (params: any) => Promise<any>;
    /** Clone an asset. */
    fetchCloneAsset: (params: any) => Promise<any>;
}

/** Module exports for the Asset store. */
export interface AssetStoreModule {
    /** Zustand store hook for asset state. */
    useAssetStore: ZustandStore<AssetStoreState>;
}
