import ReactBase, { useSyncExternalStore, useLayoutEffect, useRef } from 'react'
import { english } from './english'
import imageVariants from './imageVariants.json'

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
function renderText(child) {
  if (typeof child !== 'string') return child
  const text = translate(child)
  if (!/[↗↓]/.test(text)) return text
  return text.split(/([↗↓])/).map((part, index) => {
    if (part !== '↗' && part !== '↓') return part
    return ReactBase.createElement('svg', { key: `arrow-${index}`, 'aria-hidden': true, focusable: false, width: '1em', height: '1em', viewBox: '0 0 24 24', fill: 'none', style: { display: 'inline-block', verticalAlign: '-.12em', flexShrink: 0 } }, ReactBase.createElement('path', { d: part === '↗' ? 'M5 19 19 5M5 5h14v14' : 'M12 3v18M4 13l8 8 8-8', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }))
  })
}
function PortfolioImage(props) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const image = ref.current
    const bounds = image?.getBoundingClientRect()
    if (bounds && bounds.width > 0 && bounds.height > 0 && bounds.top < window.innerHeight && bounds.bottom > 0) {
      image.fetchPriority = 'high'
      image.loading = 'eager'
    }
  }, [props.src, props.srcSet])
  return ReactBase.createElement('img', { ...props, ref })
}
const React = { ...ReactBase, createElement(type, props, ...children) {
  let nextProps = props ? { ...props } : props
  if (type === 'img') {
    nextProps = { ...nextProps, decoding: nextProps?.decoding || 'async', loading: nextProps?.loading || 'lazy' }
    const image = imageVariants[nextProps.src]
    if (image && !nextProps.srcSet) {
      nextProps.srcSet = [...image.variants.map(item => `${item.src} ${item.width}w`), `${nextProps.src} ${image.width}w`].join(', ')
      // Cropped covers enlarge the full image: account for that scale so
      // architectural details aren't served as undersized thumbnails.
      const cropScale = typeof nextProps.style?.width === 'string' && nextProps.style.width.endsWith('%') ? Math.max(1, parseFloat(nextProps.style.width) / 100) : 1
      nextProps.sizes = `(max-width: 760px) ${Math.ceil(100 * cropScale)}vw, ${Math.ceil(900 * cropScale)}px`
    }
    type = PortfolioImage
  }
  if (nextProps) for (const key of ['alt', 'title', 'aria-label', 'placeholder']) if (typeof nextProps[key] === 'string') nextProps[key] = translate(nextProps[key])
  const localize = child => Array.isArray(child) ? child.map(localize) : renderText(child)
  return ReactBase.createElement(type, nextProps, ...children.map(localize))
} }
export default React
