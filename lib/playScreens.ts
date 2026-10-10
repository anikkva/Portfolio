/** Names of the coded Pragmatica screens that playground items can reference. */
export const PLAY_SCREENS = ['weather-list', 'weather-dial', 'train-search', 'train-seat', 'train-ticket', 'wb-promo', 'wb-invite', 'dating-profile', 'kroy-welcome', 'kroy-work', 'kroy-wear', 'kroy-brands'] as const
export type PlayScreenName = (typeof PLAY_SCREENS)[number]
