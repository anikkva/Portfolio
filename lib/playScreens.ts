/** Names of the coded Pragmatica screens that playground items can reference. */
export const PLAY_SCREENS = ['weather-list', 'weather-dial', 'train-search', 'train-seat', 'train-ticket', 'wb-promo', 'wb-invite', 'dating-profile'] as const
export type PlayScreenName = (typeof PLAY_SCREENS)[number]
