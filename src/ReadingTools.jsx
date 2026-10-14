import { useEffect, useRef, useState } from 'react'
import React, { useLanguage } from './language'

const projects = [
  ['空间与叙事', 'great-world', '上海大世界更新', '海派文化 · 社交剧场'],
  ['空间与叙事', 'city-of-dawn', '黎明之城', '电影转译 · 叙事空间'],
  ['空间与叙事', 'power-station', '权力的空间', '空间机制 · 行为体验'],
  ['社会议题研究与设计策略', 'security-theatre', '安全剧场', '物件档案 · 策展研究'],
  ['社会议题研究与设计策略', 'shanghai-future-memory', '上海未来记忆计划', '城市声音 · 文化记忆'],
  ['社会议题研究与设计策略', 'straw-rebirth', '秸秆新生', '环境行为 · 服务系统'],
  ['材料与建造', 'material-process', '生物基复合材料展示亭', '材料实验 · 空间原型'],
  ['材料与建造', 'carbon-economies', '碳经济和材料替换', '生命周期 · 材料策略'],
  ['材料与建造', 'detailing-risk', '建筑细节风险研究', '事故分析 · 方法干预'],
]

export function ReadingTools({ route }) {
  const language = useLanguage()
  const dialog = useRef(null)
  const opener = useRef(null)
  const [open, setOpen] = useState(false)
  const [chapters, setChapters] = useState([])
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const isCase = route.startsWith('#project/')
  const current = projects.find(p => route === `#project/${p[1]}`)

  useEffect(() => {
    const elements = isCase
      ? [...document.querySelectorAll('.pavilion-opening, .security-research, .future-experience, .case-chapter, .case-conclusion')]
      : [...document.querySelectorAll('#about, #place-narrative, #research-experience, #approach, #contact')]
    const titles = isCase ? elements.map(e => e.querySelector('h2')?.textContent || '项目概览') : ['关于我', '空间与叙事', '社会议题研究与设计策略', '设计方法', '联系我']
    setChapters(elements.map((element, i) => ({ element, title: titles[i] })))
    setActive(0)
    let frame = 0
    const update = () => {
      frame = 0
      setVisible(isCase || window.scrollY > 250)
      let index = 0
      elements.forEach((e, i) => { if (e.getBoundingClientRect().top < window.innerHeight * .45) index = i })
      setActive(index)
    }
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', scroll, { passive: true })
    return () => { window.removeEventListener('scroll', scroll); cancelAnimationFrame(frame) }
  }, [route, isCase, language])

  useEffect(() => {
    if (open) dialog.current?.showModal()
    else if (dialog.current?.open) dialog.current.close()
  }, [open])

  const close = () => { setOpen(false); opener.current?.focus() }
  const jump = index => {
    chapters[index]?.element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  }
  return <>
    <div className={`reading-dock ${visible ? 'is-visible' : ''}`} inert={!visible ? true : undefined} aria-label="阅读与项目导航">
      <span className="reading-dock-count">{String(active + 1).padStart(2, '0')}<small> / {String(chapters.length).padStart(2, '0')}</small></span>
      <select aria-label={isCase ? '跳转到项目章节' : '跳转到网站章节'} value={active} onChange={e => jump(Number(e.target.value))}>{chapters.map((c, i) => <option key={i} value={i}>{c.title}</option>)}</select>
      <button type="button" className="dock-next" onClick={() => jump((active + 1) % chapters.length)} aria-label="下一章节">↓</button>
      <button type="button" ref={opener} className="dock-directory" onClick={() => setOpen(true)}>项目目录 <span>＋</span></button>
    </div>
    <dialog ref={dialog} className="project-directory" aria-label="项目目录" onCancel={close} onClose={() => setOpen(false)} onClick={event => { if (event.target === dialog.current) close() }}>
      <div className="directory-sheet"><header><div><small>PORTFOLIO INDEX / 09 PROJECTS</small><h2>从一个项目，<br /><em>进入我的设计思路。</em></h2></div><button type="button" onClick={close} aria-label="关闭项目目录">×</button></header>
        <div className="directory-groups">{[...new Set(projects.map(p => p[0]))].map(group => <section key={group}><h3>{group}</h3>{projects.filter(p => p[0] === group).map(p => <a key={p[1]} href={`#project/${p[1]}`} aria-current={current?.[1] === p[1] ? 'page' : undefined} onClick={close}><span><strong>{p[2]}</strong><small>{p[3]}</small></span><span aria-hidden="true">↗</span></a>)}</section>)}</div>
        <footer><span>选择项目，进入详细介绍</span><a href="#works" onClick={close}>返回作品总览 ↑</a></footer>
      </div>
    </dialog>
  </>
}

const steps = [
  { title: '研究与洞察', en: 'Research', question: '什么问题值得回应？', text: '从场地、资料、物件与使用者经验中收集证据，辨认表面现象背后的需求与矛盾。', output: '形成：问题定义 / 证据图谱', project: 'Security Theatre · 物件档案', link: '#project/security-theatre' },
  { title: '策略与系统', en: 'Strategy', question: '从哪里介入才有意义？', text: '梳理利益相关方、行为动机与现实约束，把研究洞察转化为可推进的设计方向。', output: '形成：干预方向 / 服务路径', project: 'Straw Rebirth · 服务系统', link: '#project/straw-rebirth' },
  { title: '叙事与体验', en: 'Experience', question: '如何让人理解并参与？', text: '将抽象关系转译为空间、声音和展览叙事，组织观看、行走与参与的连续体验。', output: '形成：体验序列 / 交互构想', project: 'Future Memory Act · 声音记忆', link: '#project/shanghai-future-memory' },
  { title: '原型与迭代', en: 'Prototype', question: '如何通过制作检验想法？', text: '以材料试验、实体模型与数字原型检查设计判断，根据观察反馈调整方案与表达。', output: '形成：原型制作 / 优化记录', project: 'Material Processes · 材料与构造', link: '#project/material-process' },
]
export function MethodExplorer() {
  const [selected, setSelected] = useState(0)
  const refs = useRef([])
  const item = steps[selected]
  return <div className="method-explorer"><div className="method-tabs" role="tablist" aria-label="从研究到设计的四个步骤">{steps.map((step, i) => <button key={step.en} ref={el => { refs.current[i] = el }} id={`method-tab-${i}`} type="button" role="tab" aria-selected={selected === i} aria-controls={`method-panel-${i}`} tabIndex={selected === i ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={e => { let next; if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next=(i+1)%4; if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') next=(i+3)%4; if(e.key === 'Home') next=0; if(e.key === 'End') next=3; if(next !== undefined){e.preventDefault();setSelected(next);refs.current[next]?.focus()} }}><span>0{i+1}</span><div><em>{step.en}</em><strong>{step.title}</strong></div><b aria-hidden="true">↗</b></button>)}</div>
    <section key={selected} id={`method-panel-${selected}`} className="method-panel" role="tabpanel" aria-labelledby={`method-tab-${selected}`} tabIndex={0}><span className="method-panel-index" aria-hidden="true">0{selected+1}</span><small>DESIGN PROCESS / {item.en.toUpperCase()}</small><h3>{item.question}</h3><p>{item.text}</p><div>{item.output}</div><a href={item.link}>项目中的实践：{item.project} ↗</a></section>
  </div>
}
