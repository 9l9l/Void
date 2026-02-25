import type { TaskTabMode } from "../enums/tasks";
import type { ZustandStore } from "../zustand";

/** Task usage/quota information. */
export interface TaskUsage {
    /** Total tasks used. */
    usage: number;
    /** Maximum task limit. */
    limit: number;
    /** Frequent tasks used. */
    frequentUsage: number;
    /** Frequent task limit. */
    frequentLimit: number;
    /** Occasional tasks used. */
    occasionalUsage: number;
    /** Occasional task limit. */
    occasionalLimit: number;
}

/**
 * Zustand state for the tasks/automations system, managing
 * task results, usage quotas, and the create/edit task dialog.
 */
export interface TasksStoreState {
    /** Task ID selected for the side panel detail view, or undefined. */
    selectedTaskIdForSidePanel: string | undefined;
    /** Whether the create task dialog is open. */
    createDialogIsOpen: boolean;
    /** Whether the tool docs dialog is open. */
    toolDocsDialogIsOpen: boolean;
    /** Task definition being edited, or undefined for new. */
    taskToEdit: any;
    /** Active tab on the tasks page. */
    taskPageTabMode: TaskTabMode;
    /** List of active (enabled) task definitions. */
    userActiveTasks: any[];
    /** List of inactive (disabled/completed) task definitions. */
    userInactiveTasks: any[];
    /** Task usage quota information. */
    taskUsage: TaskUsage;
    /** Unread task result objects. */
    unreadResults: any[];
    /** Unread result counts per task. */
    unreadCounts: any[];
    /** In-flight promise for active tasks fetch. */
    activeTasksPromise: Promise<any> | undefined;
    /** In-flight promise for inactive tasks fetch. */
    inactiveTasksPromise: Promise<any> | undefined;
    /** Whether the store has been initialized. */
    initialized: boolean;

    /** Set the task ID for the side panel. */
    setSelectedTaskIdForSidePanel: (id: string | undefined) => void;
    /** Set the create dialog open state. */
    setCreateDialogIsOpen: (open: boolean) => void;
    /** Set the task being edited. */
    setTaskToEdit: (task: any) => void;
    /** Set the tasks page tab mode. */
    setTaskPageTabMode: (mode: TaskTabMode) => void;
    /** Set the tool docs dialog open state. */
    setToolDocsDialogIsOpen: (open: boolean) => void;
    /** Set the active tasks list. */
    setUserActiveTasks: (tasks: any[]) => void;
    /** Set the inactive tasks list. */
    setUserInactiveTasks: (tasks: any[]) => void;
    /** Set the task usage data. */
    setTaskUsage: (usage: TaskUsage) => void;
    /** Set the unread results. */
    setUnreadResults: (results: any[]) => void;
    /** Set the unread counts. */
    setUnreadCounts: (counts: any[]) => void;
    /** Set the active tasks promise. */
    setActiveTasksPromise: (promise: Promise<any> | undefined) => void;
    /** Set the inactive tasks promise. */
    setInactiveTasksPromise: (promise: Promise<any> | undefined) => void;
    /** Mark the store as initialized. */
    setInitialized: () => void;
    /** Fetch all user tasks from the API. */
    fetchUserTasks: () => Promise<void>;
}

/** Module exports for the Tasks store. */
export interface TasksStoreModule {
    /** Zustand store hook for tasks state. */
    useTasksStore: ZustandStore<TasksStoreState>;
}
