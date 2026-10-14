import { useEffect } from 'react'

// Animate presentation only: native links, scrolling and disclosures stay intact.
export function usePortfolioMotion(route) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const root = document.documentElement
    const reveals = [...document.querySelectorAll('.section-intro, .about-main > h2, .about-description, .work-chapter-heading, .project-content, .project > a, .more-heading, .archive-group > header, .strength-grid article, .research-thread > h3, .research-thread-grid > section, .contact-main, .case-hero, .case-chapter-intro, .case-figure, .security-context, .security-poster, .security-map, .security-video-section')]
    let observer
    let frame = 0
    let activeCover = null
    let hoverFrame = 0
    const sections = [...document.querySelectorAll('#about, #works, #approach, #contact')]
    const navLinks = [...document.querySelectorAll('.site-header nav a, .site-header .header-contact')]
    const covers = [...document.querySelectorAll('a.editorial-cover, a.project-visual-filled, a.material-lab-cover')]
    const cursor = document.querySelector('.project-cursor')
    const coverObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('cover-in-view', entry.isIntersecting))
    }, { threshold: .15 })
    covers.forEach(cover => coverObserver.observe(cover))
    const show = element => { element.classList.add('motion-visible'); element.classList.remove('motion-pending') }
    const setupReveals = () => {
      observer?.disconnect()
      if (reduced.matches) { reveals.forEach(show); return }
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { show(entry.target); observer.unobserve(entry.target) }
        })
      }, { threshold: .06, rootMargin: '0px 0px -24px 0px' })
      reveals.forEach((element, index) => {
        element.classList.add('motion-reveal')
        element.style.setProperty('--reveal-delay', `${element.closest('.strength-grid, .research-thread-grid') ? index % 3 * 55 : 0}ms`)
        const rect = element.getBoundingClientRect()
        if (element.classList.contains('motion-visible') || rect.top < window.innerHeight) show(element)
        else { element.classList.add('motion-pending'); observer.observe(element) }
      })
    }
    const updateScroll = () => {
      frame = 0
      const maximum = root.scrollHeight - window.innerHeight
      const hero = document.querySelector('.hero')
      if (hero && !reduced.matches) {
        const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(hero.offsetHeight, 1)))
        hero.style.setProperty('--hero-scroll-shift', `${progress * 100}px`)
        hero.style.setProperty('--hero-scroll-scale', `${1 - progress * .07}`)
      }
      root.style.setProperty('--reading-progress', `${maximum > 0 ? Math.min(1, Math.max(0, window.scrollY / maximum)) : 0}`)
      let current = ''
      sections.forEach(section => { if (section.getBoundingClientRect().top <= window.innerHeight * .4) current = section.id })
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${current}`) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateScroll) }
    const clearHover = () => {
      if (hoverFrame) cancelAnimationFrame(hoverFrame)
      hoverFrame = 0
      activeCover?.classList.remove('motion-cover-active')
      activeCover?.style.removeProperty('--cover-x')
      activeCover?.style.removeProperty('--cover-y')
      activeCover?.style.removeProperty('--tilt-x')
      activeCover?.style.removeProperty('--tilt-y')
      activeCover = null
      cursor?.classList.remove('is-visible')
    }
    const onPointer = event => {
      if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return
      const cover = event.target.closest('a.editorial-cover, a.project-visual-filled, a.material-lab-cover')
      if (!cover) { clearHover(); return }
      if (activeCover !== cover) { clearHover(); activeCover = cover; cover.classList.add('motion-cover-active') }
      if (hoverFrame) cancelAnimationFrame(hoverFrame)
      hoverFrame = requestAnimationFrame(() => {
        hoverFrame = 0
        const rect = cover.getBoundingClientRect()
        cover.style.setProperty('--cover-x', `${((event.clientX - rect.left) / rect.width - .5) * 22}px`)
        cover.style.setProperty('--cover-y', `${((event.clientY - rect.top) / rect.height - .5) * 18}px`)
        cover.style.setProperty('--tilt-x', `${-((event.clientY - rect.top) / rect.height - .5) * 6}deg`)
        cover.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - .5) * 7}deg`)
        cursor?.style.setProperty('--cursor-x', `${event.clientX}px`)
        cursor?.style.setProperty('--cursor-y', `${event.clientY}px`)
        cursor?.classList.add('is-visible')
      })
    }
    const onFocus = event => {
      const reveal = event.target.closest('.motion-pending')
      if (reveal) { show(reveal); observer?.unobserve(reveal) }
      clearHover()
    }
    const onToggle = () => { onScroll(); clearHover() }
    const onPreference = () => { clearHover(); setupReveals() }
    const layoutObserver = new ResizeObserver(onScroll)
    layoutObserver.observe(document.body)
    setupReveals()
    updateScroll()
    covers.forEach(cover => cover.classList.add('motion-cover'))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    document.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('pointerleave', clearHover)
    window.addEventListener('blur', clearHover)
    document.addEventListener('focusin', onFocus)
    document.addEventListener('toggle', onToggle, true)
    reduced.addEventListener('change', onPreference)
    finePointer.addEventListener('change', clearHover)
    return () => {
      observer?.disconnect()
      coverObserver.disconnect()
      layoutObserver.disconnect()
      cancelAnimationFrame(frame)
      clearHover()
      reveals.forEach(element => { element.classList.remove('motion-reveal', 'motion-pending', 'motion-visible'); element.style.removeProperty('--reveal-delay') })
      covers.forEach(cover => cover.classList.remove('motion-cover', 'cover-in-view'))
      navLinks.forEach(link => link.removeAttribute('aria-current'))
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('pointermove', onPointer)
      document.removeEventListener('pointerleave', clearHover)
      window.removeEventListener('blur', clearHover)
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('toggle', onToggle, true)
      reduced.removeEventListener('change', onPreference)
      finePointer.removeEventListener('change', clearHover)
    }
  }, [route])
}
