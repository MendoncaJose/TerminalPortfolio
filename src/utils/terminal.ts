import type { Directory, Section } from "../types";

export function formatProjectTitle(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

export function displayTitle(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function sectionFromDirectory(directory: Directory): Section {
  if (directory.endsWith("profile_data")) return "profile";
  if (directory.includes("project_index")) return "projects";
  if (directory.endsWith("comm_link")) return "contact";
  return "home";
}

export function directoryPrompt(directory: Directory) {
  return `guest@system:${directory}$`;
}
