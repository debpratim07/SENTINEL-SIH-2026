// A UI preference can reduce motion; it must never override the OS preference.
export function shouldReduceMotion(osPreference: boolean, userPreference: boolean) {
  return osPreference || userPreference
}

export function visibleFocusable<T extends { disabled: boolean; visible: boolean; tabIndex: number }>(elements: T[]) {
  return elements.filter(element => !element.disabled && element.visible && element.tabIndex >= 0)
}
