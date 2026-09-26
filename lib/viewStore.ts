'use client'

import { useSyncExternalStore } from 'react'
import { nextViewQuery, parseSeed, parseView, type View } from './view'

type ViewState = { view: View; seed: number }

const SERVER_STATE: ViewState = { view: 'random', seed: 1 }
const listeners = new Set<() => void>()
let cache: { search: string; state: ViewState } | null = null

function read(): ViewState {
  const search = window.location.search
  if (cache?.search !== search) {
    const params = new URLSearchParams(search)
    cache = { search, state: { view: parseView(params.get('view')), seed: parseSeed(params.get('seed')) } }
  }
  return cache.state
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('popstate', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('popstate', listener)
  }
}

/** View + seed from the URL. Updates are plain state changes, not route transitions. */
export function useViewState(): ViewState {
  return useSyncExternalStore(subscribe, read, () => SERVER_STATE)
}

export function chooseView(view: View): void {
  const query = nextViewQuery(new URLSearchParams(window.location.search), view)
  window.history.replaceState(window.history.state, '', `?${query}`)
  listeners.forEach((listener) => listener())
}
