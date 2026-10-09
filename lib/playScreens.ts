/** Names of the coded Pragmatica screens that playground items can reference. */
export const PLAY_SCREENS = ['weather-list', 'weather-dial'] as const
export type PlayScreenName = (typeof PLAY_SCREENS)[number]
