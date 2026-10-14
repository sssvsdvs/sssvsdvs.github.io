import { useEffect, useRef, useState } from 'react'

const projects = [
  { title: '上海大世界更新', en: 'Place & narrative', image: '/projects/great-world/experience.webp', href: '#project/great-world' },
  { title: '安全剧场', en: 'Archive & exhibition', image: '/projects/security-theatre/research-poster.webp', href: '#project/security-theatre' },
  { title: '上海未来记忆计划', en: 'Sound & memory', image: '/projects/shanghai-future-memory/sonic-memory-poster.jpg', href: '#project/shanghai-future-memory' },
]

export default function HeroGallery() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(true)
  const [reduced, setReduced] = useState(false)
  const root = useRef(null)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(media.matches)
    sync(); media.addEventListener('change', sync)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 })
    observer.observe(root.current)
    return () => { observer.disconnect(); media.removeEventListener('change', sync) }
  }, [])
  useEffect(() => {
    if (paused || !visible || reduced) return
    const timer = setInterval(() => { if (!document.hidden) setActive(index => (index + 1) % projects.length) }, 5500)
    return () => clearInterval(timer)
  }, [paused, visible, reduced])
  return <div ref={root} className="hero-gallery" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}>
    <div className="hero-gallery-frame">{projects.map((project, index) => <a key={project.href} className={`hero-gallery-slide ${index === active ? 'is-active' : ''}`} href={project.href} aria-label={`查看${project.title}`} aria-hidden={index !== active} tabIndex={index === active ? 0 : -1}><img src={project.image} alt={project.title} /><span><small>{project.en}</small><strong>{project.title}</strong><b aria-hidden="true">↗</b></span></a>)}</div>
    <div className="hero-gallery-controls"><span>SELECTED WORK / 0{active + 1}</span><div>{projects.map((project, index) => <button type="button" key={project.href} aria-label={`预览${project.title}`} aria-pressed={active === index} onClick={() => { setActive(index); setPaused(true) }}>0{index + 1}</button>)}<button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? '播放作品轮播' : '暂停作品轮播'}>{paused ? '▷' : 'Ⅱ'}</button></div></div>
  </div>
}
