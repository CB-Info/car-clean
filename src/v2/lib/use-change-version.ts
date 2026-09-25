import { useState } from 'react'

// Compteur qui s'incrémente quand la valeur change (0 au premier rendu : aucune animation au chargement).
export function useChangeVersion<T>(value: T) {
  const [state, setState] = useState({ value, version: 0 })
  if (!Object.is(state.value, value)) setState({ value, version: state.version + 1 })
  return state.version
}
