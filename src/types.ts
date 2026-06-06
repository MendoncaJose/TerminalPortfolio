export type Phase = "intro" | "booting" | "dashboard";
export type Section = "home" | "profile" | "projects" | "contact";
export type Directory =
  | "~"
  | "~/dashboard"
  | "~/dashboard/profile_data"
  | "~/dashboard/project_index"
  | "~/dashboard/comm_link"
  | `~/dashboard/project_index/${string}`;
export type ProjectStatus = "LIVE" | "DEV" | "CASE_STUDY";

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  liveDemoUrl: string;
  custom?: boolean;
};

export type VimDraft = {
  id: string;
  title: string;
  description: string;
  tags: string;
  status: ProjectStatus;
  liveDemoUrl: string;
};
