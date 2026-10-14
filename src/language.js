import ReactBase, { useSyncExternalStore } from 'react'
import { english } from './english'

let language = 'zh'
const listeners = new Set()
const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener) }
export const useLanguage = () => useSyncExternalStore(subscribe, () => language, () => 'zh')
export function setLanguage(next) {
  language = next
  document.documentElement.lang = next === 'en' ? 'en' : 'zh-CN'
  document.documentElement.dataset.language = next
  listeners.forEach(listener => listener())
}
const fragments = Object.keys(english).sort((a, b) => b.length - a.length)
export function translate(value) {
  if (language !== 'en' || typeof value !== 'string') return value
  const trimmed = value.trim()
  if (english[trimmed]) return value.replace(trimmed, english[trimmed])
  if (!/[\u4e00-\u9fff]/.test(value)) return value
  let output = value
  for (const source of fragments) if (output.includes(source)) output = output.split(source).join(english[source])
  return output
}
// Translate text at React element creation; keep DOM nodes and event handlers intact.
const React = { ...ReactBase, createElement(type, props, ...children) {
  const nextProps = props ? { ...props } : props
  if (nextProps) for (const key of ['alt', 'title', 'aria-label', 'placeholder']) if (typeof nextProps[key] === 'string') nextProps[key] = translate(nextProps[key])
  const localize = child => Array.isArray(child) ? child.map(localize) : translate(child)
  return ReactBase.createElement(type, nextProps, ...children.map(localize))
} }
export default React
