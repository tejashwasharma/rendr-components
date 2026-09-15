export const ADDON_ID = 'rendr-live-code';
export const PANEL_ID = `${ADDON_ID}/panel`;

export const EVENTS = {
  /** preview → manager: the code that currently renders a story. */
  INIT: `${ADDON_ID}/init`,
  /** manager → preview: user edited the code. */
  UPDATE: `${ADDON_ID}/update`,
  /** manager → preview: go back to the story's own code. */
  RESET: `${ADDON_ID}/reset`,
};

export interface CodePayload {
  storyId: string;
  code: string;
}
