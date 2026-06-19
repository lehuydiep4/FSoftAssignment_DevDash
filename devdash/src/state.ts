import type { AppState } from './types';

let state: AppState = { status: 'idle' };
const listeners: (() => void)[] = [];

export function getState(): AppState {
  return state;
}

export function setState(newState: AppState): void {
  state = newState;
  listeners.forEach(listener => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}
