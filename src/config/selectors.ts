export const PLAYER_VIEW_CY = 'player-view';
export const BUILDER_VIEW_CY = 'builder-view';
export const ANALYTICS_VIEW_CY = 'analytics-view';

export const START_INTERACTION_BUTTON_CY = 'start-interaction-button';

export const buildDataCy = (selector: string): string =>
  `[data-cy=${selector}]`;
