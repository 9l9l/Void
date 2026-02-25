import type { ReportType } from "../enums/report";
import type { ModelId } from "../enums/models";
import type { ZustandStore } from "../zustand";

/**
 * Zustand state for the report/flag dialog,
 * used to report inappropriate responses or models.
 */
export interface ReportStoreState {
    /** Whether the report dialog is open. */
    reportDialogIsOpen: boolean;
    /** Response ID being reported, or undefined. */
    reportResponseId: string | undefined;
    /** Model ID associated with the reported response, or undefined. */
    reportModelId: ModelId | undefined;
    /** Forced report type override, or undefined for user selection. */
    forcedReportType: ReportType | undefined;

    /** Set the report dialog open state. */
    setReportDialogIsOpen: (open: boolean) => void;
    /** Set the response ID to report. */
    setReportResponseId: (id: string | undefined) => void;
    /** Set the model ID associated with the report. */
    setReportModelId: (id: ModelId | undefined) => void;
    /** Set a forced report type. */
    setForcedReportType: (type: ReportType | undefined) => void;
    /** Open the report dialog with the given options. */
    openReportDialog: (options: any) => void;
    /** Close the report dialog and clear state. */
    closeReportDialog: () => void;
}

/** Module exports for the Report store. */
export interface ReportStoreModule {
    /** Zustand store hook for report dialog state. */
    useReportStore: ZustandStore<ReportStoreState>;
}
