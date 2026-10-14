import { useEffect, useRef, useState } from 'react'
import React, { useLanguage, translate } from './language'
import LanguageSwitch from './LanguageSwitch'
import RiskNarrative from './RiskNarrative'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { importedProjects, featuredCases } from './projectData'
import { usePortfolioMotion } from './usePortfolioMotion'
import { ReadingTools, MethodExplorer } from './ReadingTools'
import CoverSculpture from './CoverSculpture'

const featuredProjects = [
  {
    number: '01',
    title: 'Security Theatre',
    slug: 'security-theatre',
    cover: '/projects/security-theatre/page-1.webp',
    href: '#project/security-theatre',
    chinese: '安全剧场',
    category: '批判性设计研究 / 档案与策展',
    year: '2025',
    statement: '从十二件疫情物件出发，重新审视恐惧如何被设计、传播与日常化。',
    question: '公共危机中的“安全感”是如何被物件与空间塑造的？',
    process: '建立身体、家庭、城市三个尺度的物件档案，结合影像、蓝晒与拟纪录片语言，形成可供公众阅读的展览叙事。',
    result: '独立研究册、物件档案与 RCA 展出',
    status: '个人研究项目',
    disciplines: ['研究', '档案', '体验'],
  },
  {
    number: '02',
    title: 'Shanghai Future Memory Act',
    slug: 'shanghai-future-memory',
    cover: '/projects/shanghai-future-memory/page-2.webp',
    href: '#project/shanghai-future-memory',
    chinese: '上海未来记忆计划',
    category: '城市策略 / 气候体验',
    year: '2025',
    statement: '把海平面上升带来的抽象风险，转化为可以聆听和参与的城市记忆。',
    question: '面对气候变化，一座城市如何保存即将消失的日常经验？',
    process: '以声音、地方记忆和公众参与为线索，构想声音地图、社区故事平台与具有政策视角的工具包。',
    result: '声音地图与政策工具概念',
    status: '个人研究项目',
    disciplines: ['城市', '气候', '交互'],
  },
  {
    number: '03',
    title: 'Straw Rebirth',
    cover: '/projects/straw-rebirth/page-21.webp',
    href: '#project/straw-rebirth',
    chinese: '秸秆新生',
    category: '服务设计 / 社会创新',
    year: '2025',
    statement: '为减少秸秆焚烧寻找兼顾环境、农户收入与地方产业的替代路径。',
    question: '怎样让更环保的选择同时成为农户可行的选择？',
    process: '团队梳理污染成因、利益相关方与行为障碍，提出培训、共用工坊、销售渠道和政策激励相衔接的服务方案。',
    result: '行为干预与服务系统提案',
    status: '方案发起 / 协作深化',
    disciplines: ['系统', '行为', '服务'],
  },
  {
    number: '04',
    title: 'Metamorphosis of The Great World of Shanghai',
    chinese: '上海大世界更新',
    category: '场所策略 / 城市更新',
    year: '概念提案',
    cover: '/projects/great-world/cover.webp',
    href: '#project/great-world',
    statement: '重新连接历史娱乐场所、街区生活与当代公共活动。',
    question: '如何让曾经的城市娱乐地标再次成为有人停留的公共场所？',
    process: '从周边功能与不同年龄人群的活动出发，以剧场、餐饮和社交的复合使用为线索，通过中心舞台、交错动线和多层视线组织空间体验。',
    result: '场所更新与体验设计提案',
    status: '空间设计提案',
    disciplines: ['场所', '叙事', '公共性'],
  },
]

const additionalProjects = [
  {
    number: '05',
    title: 'Carbon Economies',
    chinese: '材料与碳的选择',
    category: '可持续 / 生命周期分析',
    summary: '比较材料与结构方案，让低碳选择有可读的依据。',
  },
  {
    number: '06',
    title: 'City of Dawn',
    chinese: '黎明之城',
    category: '体验叙事 / 场景设计',
    summary: '将电影中的情绪转折转译为四阶段空间体验。',
  },
]

const strengths = [
  {
    number: '01',
    title: '找到问题',
    en: 'Research',
    description: '梳理资料、场地、物件与利益相关方，让复杂议题有可讨论的结构。',
    example: 'Security Theatre / Straw Rebirth',
  },
  {
    number: '02',
    title: '建立方向',
    en: 'Strategy',
    description: '在环境、行为与现实约束之间寻找切入点，形成可推演的方案路径。',
    example: 'Future Memory Act / Straw Rebirth',
  },
  {
    number: '03',
    title: '讲清故事',
    en: 'Experience',
    description: '用空间、声音、影像和展陈语言，把研究转化为能被理解的体验。',
    example: 'Security Theatre / City of Dawn',
  },
  {
    number: '04',
    title: '做出原型',
    en: 'Making',
    description: '通过模型、材料试验和视觉原型快速验证想法，并与不同专业协作。',
    example: 'Material Process / 实习项目',
  },
]

function SectionMarker({ number, english, chinese, inverse = false }) {
  return (
    <div className={`section-marker ${inverse ? 'inverse' : ''}`}>
      <span>({number})</span>
      <span>{english}</span>
      <span>{chinese}</span>
    </div>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const close = () => setMenuOpen(false)
  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <a className="brand" href="#top" onClick={close} aria-label="申屠欣溦，返回首页">
        <strong>XW</strong>
        <small>XINWEI SHENTU<br />申屠欣溦</small>
      </a>
      <nav className={menuOpen ? 'open' : ''} aria-label="主导航">
        <a href="#about" onClick={close}>关于 <span>01</span></a>
        <a href="#works" onClick={close}>项目 <span>02</span></a>
        <a href="#approach" onClick={close}>方法 <span>03</span></a>
      </nav>
      <a className="header-contact contact-minimal" href="#contact"><span>联系我</span><svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
      <LanguageSwitch />
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? '关闭菜单' : '打开菜单'} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '关闭' : '菜单'}
      </button>
    </header>
  )
}

const coverDesigns = {
  'security-theatre': { number: '02', label: 'ARCHIVE & CURATORIAL RESEARCH', first: 'Security', last: 'Theatre.', note: 'V&A Pandemic Objects 合作背景 · RCA 展出', image: '/projects/security-theatre/research-poster.webp', crop: [2048, 0, 0, 2048, 2800] },
  'shanghai-future-memory': { number: '02', label: 'CITY & SONIC MEMORY', first: 'Future', last: 'Memory.', note: 'Listen to a city, remember its everyday life', page: 2, crop: [2000, 985, 55, 935, 1360] },
  'material-process': { number: '09', label: 'MATERIAL & LIGHT', first: 'Material', last: 'Processes.', note: 'Samples / Light / Assembly', page: 19, crop: [3000, 2038, 567, 213, 201] },
  'city-of-dawn': { number: '05', label: 'SPATIAL NARRATIVE', first: 'City of', last: 'Dawn.', note: 'A journey through four emotions', image: '/projects/city-of-dawn/cover-original.webp', crop: [2800, 0, 0, 2800, 1980] },
  'power-station': { number: '06', label: 'SPACE & POWER', first: 'Power', last: 'Station.', note: 'Who controls the way we move?', page: 4, crop: [2000, 1072, 297, 646, 356] },
  'detailing-risk': { number: '07', label: 'DETAILS & RESPONSIBILITY', first: 'Detailing', last: 'Risk.', note: 'Reading risk through the detail', page: 19, crop: [2000, 90, 290, 865, 865] },
  'straw-rebirth': { number: '04', label: 'RESEARCH INTO SERVICE', first: 'Straw', last: 'Rebirth.', note: '秸秆再利用 / 服务系统设计', page: 21, crop: [2000, 780, 1416, 456, 612] },
}

function FutureMemoryCover() {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => { setReduced(preference.matches); if (preference.matches) videoRef.current?.pause() }
    sync()
    preference.addEventListener('change', sync)
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) videoRef.current?.pause() })
    if (videoRef.current) observer.observe(videoRef.current)
    return () => { preference.removeEventListener('change', sync); observer.disconnect() }
  }, [])
  const start = () => { if (!reduced && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) videoRef.current?.play().catch(() => {}) }
  const stop = () => videoRef.current?.pause()
  return <a className={`editorial-cover future-memory-cover ${playing ? 'is-playing' : ''}`} href="#project/shanghai-future-memory" aria-label="查看上海未来记忆计划完整项目" onMouseEnter={start} onMouseLeave={stop} onFocus={start} onBlur={stop}>
    <span className="editorial-kicker"><span>03 / CITY & SONIC MEMORY</span><span>SHANGHAI — 2025</span></span>
    <span className="future-cover-heading"><span className="editorial-title future-full-title">Shanghai Future<br /><em>Memory Act</em></span></span>
    <span className="future-cover-scene"><img src="/projects/shanghai-future-memory/sonic-memory-poster.jpg" alt="上海滨江声景影像：城市天际线与船鸣记忆" loading="lazy" /><video ref={videoRef} muted loop playsInline preload="none" aria-hidden="true" onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setPlaying(false)}><source src="/projects/shanghai-future-memory/sonic-memory.mp4" type="video/mp4" /></video><span className="future-cover-wash" /><span className="future-cover-ripples" aria-hidden="true"><i /><i /><i /></span><span className="future-cover-location">31°14′ N / 121°29′ E<br />HUANGPU RIVER · SHANGHAI</span><span className="future-cover-signal" aria-hidden="true">{Array.from({ length: 15 }, (_, i) => <i key={i} style={{ '--beat': `${(i % 5) * .13}s`, '--bar': `${10 + (i * 7 % 24)}px` }} />)}</span></span>
    <span className="editorial-bottom"><span>城市记忆 / 声音档案<span className="future-cover-hint">{reduced ? '探索项目' : '悬停预览 · 静音声景'}</span></span><span className="editorial-arrow" aria-hidden="true">↗</span></span>
  </a>
}

function MaterialCover() {
  return <a className="material-lab-cover material-pavilion-cover" href="#project/material-process" aria-label="查看生物基复合材料展示亭完整项目">
    <span className="material-lab-kicker"><span>MATERIAL / STRUCTURE / SPACE</span><span>RCA —</span></span>
    <span className="material-lab-title">Shell<br /><em>Pavilion.</em></span>
    <span className="material-lab-subtitle">生物基复合材料展示亭</span>
    <span className="pavilion-cover-drawing"><img src="/projects/material-process/structure-study.webp" alt="展亭构造研究：框架爆炸图、整体轴测与支撑节点" width="588" height="580" loading="lazy" /></span>
    <span className="material-lab-bottom"><span>材料如何成为空间<span>Material Processes / Structure study</span></span><span className="material-lab-arrow" aria-hidden="true">↗</span></span>
  </a>
}

function EditorialCover({ slug }) {
  if (slug === 'material-process') return <MaterialCover />
  if (slug === 'shanghai-future-memory') return <FutureMemoryCover />
  if (slug === 'carbon-economies') return <a className="editorial-cover editorial-carbon" href="#project/carbon-economies" aria-label="查看材料与碳的选择完整项目"><span className="editorial-kicker"><span>08 / LIFE CYCLE ASSESSMENT</span><span>MATERIAL STUDY</span></span><span className="editorial-title">Carbon<br /><em>Economies.</em></span><span className="carbon-structure"><img src="/projects/carbon-economies/structure-cover.webp" alt="CLT 木结构体系爆炸图：楼板、墙体与楼梯的构成关系" loading="lazy" /></span><span className="carbon-structure-label">01 / CLT STRUCTURAL SYSTEM</span><div className="carbon-metrics"><div><small>原方案 → 木结构方案</small><strong>428 <span>→</span> 303</strong></div><span>kg CO₂e/m²<br />课程方案测算 · 约 −29%</span></div><span className="editorial-bottom"><span>材料选择 · 构造逻辑 · 生命周期</span><span className="editorial-arrow" aria-hidden="true">↗</span></span></a>
  const design = coverDesigns[slug]
  const [width, x, y, cropWidth, cropHeight] = design.crop
  return <a className={`editorial-cover editorial-${slug}`} href={`#project/${slug}`} aria-label={`查看 ${design.first} ${design.last} 完整项目`}>
    <span className="editorial-kicker"><span>{design.number} / {design.label}</span><span>XS — ARCHIVE</span></span>
    <span className="editorial-title">{design.first}<br /><em>{design.last}</em></span>
    <span className="editorial-art"><span className="editorial-crop" style={{ aspectRatio: `${cropWidth}/${cropHeight}` }}><img src={design.image || `/projects/${slug}/page-${design.page}.webp`} alt={slug === 'straw-rebirth' ? '研究报告引用的 Emma Bruschi 秸秆编织作品，非本项目制作成果' : slug === 'city-of-dawn' ? '黎明之城原始效果图：粉色螺旋阶梯与情绪叙事场景' : '项目原作图版，完整内容见详情页'} loading="lazy" style={{ width: `${width / cropWidth * 100}%`, left: `${-x / cropWidth * 100}%`, top: `${-y / cropHeight * 100}%` }} /></span></span>
    <span className="editorial-bottom"><span>{design.note}</span><span className="editorial-arrow" aria-hidden="true">↗</span></span>
  </a>
}

const projectChapters = [
  { id: 'place-narrative', number: 'I', english: 'SPATIAL PRACTICE / PLACE & NARRATIVE', title: '空间、场所与叙事', description: '从历史场所更新到情绪与行为的空间编排，展示场地研究、空间组织与体验表达的设计基础。', projects: ['04'] },
  { id: 'research-experience', number: 'II', english: 'SOCIAL INQUIRY & DESIGN STRATEGY', title: '社会议题研究与设计策略', description: '围绕环境行为、城市记忆与日常生活中的社会议题，通过物件档案、声音研究与系统分析建立问题框架，进一步提出策展叙事、设计政策与服务路径。', projects: ['01', '02', '03'] },
]

const projectContributions = {
  '01': { role: '独立研究：物件分类、档案建构、蓝晒、拟纪录片与参与式展陈。', evidence: '十二件物件档案、研究册与 RCA 展出；V&A Pandemic Objects 合作背景。', emphasis: '学术研究 / 档案方法 / 策展实践' },
  '02': { role: '个人提案：议题框架、声音记忆分类、地图与交互界面构想。', evidence: '声音地图构想、界面演示与设计政策提案。', emphasis: '城市研究 / 策略思考 / 数字体验' },
  '03': { role: '方案提出者：提出秸秆再利用的整体服务构想，建立复杂问题图谱，并参与团队研究与方案深化。', evidence: '复杂问题图谱、培训—制作—展示—销售服务路径与行为干预方案。', emphasis: '系统思考 / 服务设计 / 协作研究' },
  '04': { role: '个人空间提案：场地与活动分析、概念推演及空间组织。', evidence: '功能平面、剖面与公共活动场景；非已建成项目。', emphasis: '场所研究 / 体验组织 / 空间表达' },
}

const archiveGroups = [
  { title: '材料、系统与责任', english: 'RESEARCH STUDIES / MATERIALS & SYSTEMS', intro: '材料实验提出如何制作；碳评价检验环境代价；细部研究追问维护与治理责任。三组研究共同讨论材料选择、建造方式与公共生活之间的联系。', slugs: ['material-process', 'carbon-economies', 'detailing-risk'] },
  { title: '叙事空间与体验设计', english: 'SPATIAL STUDIES / NARRATIVE & BEHAVIOUR', intro: '从情绪叙事到路径与视线，探讨空间如何影响人的感受与行动，也为后续研究提供观察尺度。', slugs: ['city-of-dawn', 'power-station'] },
]

function ResearchThread() {
  return <aside className="research-thread" aria-labelledby="research-thread-title"><p className="eyebrow">RESEARCH SYNTHESIS / 研究线索</p><h3 id="research-thread-title">从材料到公共生活：<br />用研究找到设计的介入点。</h3><p className="research-thread-lead">这些项目从不同尺度讨论设计如何影响日常生活：材料研究关注制作与环境代价，服务设计关注参与条件，声音与物件档案关注人们如何理解和记住城市。我通过证据整理、关系分析与原型表达，将观察转化为具体的设计方向。</p><div className="research-thread-grid">{[
    { title: '材料与建造', text: '通过样本制作、碳评价和事故分析，比较材料性能、环境影响与维护条件。', links: [['material-process', '材料实验'], ['carbon-economies', '生命周期评价'], ['detailing-risk', '细部风险']] },
    { title: '系统与公共经验', text: '将环境问题放入行为、地方记忆与参与机制中，探索可理解、可参与的设计回应。', links: [['straw-rebirth', '秸秆新生'], ['shanghai-future-memory', '上海未来记忆计划']] },
    { title: '档案与批判表达', text: '以物件、影像与参与式展陈，研究危机如何被设计、记忆与重新解读。', links: [['security-theatre', '安全剧场 / 独立研究']] },
  ].map((item, i) => <section key={item.title}><small>0{i+1} / RESEARCH LENS</small><h4>{item.title}</h4><p>{item.text}</p>{item.links.map(([slug, title]) => <a href={`#project/${slug}`} key={slug}>{title} ↗</a>)}</section>)}</div><p className="research-thread-end">共同方法：建立证据 → 梳理关系 → 转译为体验 → 讨论设计责任。</p></aside>
}

function FurtherProjects({ group, id }) {
  return <div className="more-work" id={id}><div className="more-heading"><span>FURTHER PRACTICE</span><h3>延伸实践</h3><p>按主题展开相关作品。</p></div><div className="archive-list"><section className="archive-group"><header><span>{group.english}</span><h4>{group.title}</h4><p>{group.intro}</p></header>{group.slugs.map(slug => { const project = importedProjects.find(item => item.slug === slug); return <details className="archive-item" key={slug}><summary><span className="more-number" aria-hidden="true">↗</span><span><strong>{project.chinese}</strong><small>{project.title}</small></span><span className="archive-category">{project.category}</span><span className="archive-plus" aria-hidden="true">＋</span></summary><div className="archive-body"><EditorialCover slug={slug} /><div><p className="eyebrow">{project.type}</p><h4>{project.summary}</h4><p>{project.chapters[0].text}</p><a className="case-entry" href={`#project/${slug}`}>阅读完整项目 ↗</a></div></div></details> })}</section></div></div>
}

function Project({ project, index }) {
  const contribution = projectContributions[project.number]
  const displayNumber = { '04': '01', '01': '02', '02': '03', '03': '04' }[project.number]
  return (
    <article className={`project project-${index + 1}`} id={`project-${project.number}`}>
      {project.cover && project.number !== '04' ? <EditorialCover slug={project.slug || 'straw-rebirth'} /> : project.cover ? <a className="project-visual project-visual-filled" href={project.href} aria-label={`查看${project.chinese}完整项目`}>
        <span className="cover-topline"><span>01 / SHANGHAI</span><span>PLACE & MEMORY</span></span>
        <span className="cover-title cover-title-metamorphosis"><small>Metamorphosis of</small>The Great World<br /><em>of Shanghai.</em></span>
        <span className="cover-art" aria-hidden="true"><img src="/projects/great-world/experience.webp" alt="" loading="lazy" width="1800" height="1273" /></span>
        <span className="cover-caption"><span>上海大世界更新<small>海派文化的当代演绎 · 历史场所的当代再诠释</small></span><span className="project-image-link">探索项目 <span aria-hidden="true">↗</span></span></span>
      </a> :
      <div className="project-visual" aria-label={`${project.title} 项目图片待添加`}>
        <span className="project-visual-top">CASE {project.number}</span>
        <div className="image-instruction">作品图片待添加</div>
        <span className="project-visual-bottom">{project.disciplines.join(' / ')}</span>
      </div>}
      <div className="project-content">
        <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
        <div className="project-title">
          <span className="project-number">{displayNumber}</span>
          <div><h3>{project.chinese}</h3><p>{project.title}</p></div>
        </div>
        <p className="project-statement">{project.statement}</p>
        <p className="project-competency">{contribution.emphasis}</p>
        <dl className="project-evidence"><div><dt>我的贡献</dt><dd>{contribution.role}</dd></div><div><dt>项目产出</dt><dd>{contribution.evidence}</dd></div></dl>
        {project.href && <a className="case-entry" href={project.href}>查看完整项目 ↗</a>}
        <details className="project-case">
          <summary>展开问题与方法 <span aria-hidden="true">＋</span></summary>
          <div className="project-details">
          <div><span>问题</span><p>{project.question}</p></div>
          <div><span>方法</span><p>{project.process}</p></div>
          <div><span>产出</span><p>{project.result}</p></div>
        </div>
        </details>
        <div className="project-footer"><span>{project.status}</span><span>{project.disciplines.join(' · ')}</span></div>
      </div>
    </article>
  )
}

const experienceItems = [
  { date: '2025.04', title: 'Detailing Risk', role: '工作坊助理 · 伦敦', groups: [
    { title: '工作内容', points: ['整理 Grenfell Tower 火灾调查相关的空间证据、媒体记录与事件时间线，协助构建案例分析框架。', '剪辑、归档现场访谈与讨论影像，支持课程记录与教学展示。', '协助协调 Arup、CROSS-UK、Camden Council 等行业专家参与专题研讨。'] },
    { title: '项目要点', points: ['围绕建筑风险、居民安全与社会正义，连接调查材料、跨学科讨论与公众表达。', '此处为 Grenfell 主题工作坊助理经历，与作品区的齐齐哈尔体育馆事故课程研究分别呈现。'] },
  ] },
  { date: '2024—2025', title: 'Royal College of Art', role: 'MArch Design Practice · 伦敦', groups: [
    { title: '研究与实践', points: ['以研究驱动的设计方法，探索气候正义、材料政治与社会转型。', '结合物件档案、系统图谱、空间叙事和实物原型，将研究转化为可理解的设计表达。'] },
    { title: '代表项目', points: ['Security Theatre：建立身体、家庭、城市三个尺度的十二件疫情物件档案，通过拼贴、蓝晒与展览叙事呈现研究。', 'Straw Rebirth：提出秸秆再利用的整体方案，绘制复杂问题图谱，并参与协作研究与服务设计。', 'Sonic Architectures（2025.03）：参与 Paul Purgas 主导的声音与空间实践，协作完成空间流线与声学调试，并在巴比肯艺术中心公开呈现。'] },
  ], link: '#project/straw-rebirth', linkLabel: '查看秸秆新生项目' },
  { date: '2023—2024', title: '上海亚纳柯建筑装饰', role: '设计实习 · 上海', groups: [
    { title: '工作内容', points: ['参与五个室内项目的图纸修改、施工图深化与节点大样设计，配合施工方沟通。', '建立并维护材料样板库，对石材、金属、涂料等饰面材料进行性能比较与选型。', '编制材料表，为设计决策、预算与后续采购提供支持。'] },
    { title: '项目要点', points: ['将设计意图转化为清晰的施工图纸与材料信息，关注方案到现场实施之间的衔接。', '实习时间：2023.06—2024.01。'] },
  ] },
  { date: '2022', title: '浙江建院建筑规划设计院', role: '景观设计实习 · 杭州', groups: [
    { title: '工作内容', points: ['参与住宅类政府投标项目的前期方案工作，协助开展场地调研、概念设计与模型搭建。', '与建筑师及景观设计师协作，支持建筑与景观方案的推演和表达。'] },
    { title: '项目要点', points: ['参与别墅项目方案设计及住宅社区景观改造设计。', '实习时间：2022.07—2022.10。'] },
  ] },
]

function ExperienceList() {
  return <div className="experience experience-expandable">
    <p className="experience-hint">经历与实践 <span>点击展开工作与项目要点</span></p>
    {experienceItems.map(item => <details className="experience-item" key={item.title}>
      <summary><time>{item.date}</time><div><strong>{item.title}</strong><small>{item.role}</small></div><b className="experience-toggle" aria-hidden="true">＋</b></summary>
      <div className="experience-detail">{item.groups.map(group => <section key={group.title}><h3>{group.title}</h3><ul>{group.points.map(point => <li key={point}>{point}</li>)}</ul></section>)}{item.link && <a className="case-entry" href={item.link}>{item.linkLabel} ↗</a>}</div>
    </details>)}
  </div>
}

function App() {
  return (
    <main id="top">
      <Header />
      <section className="hero" aria-labelledby="hero-title" onPointerMove={event => { if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; const bounds = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--hero-pointer-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 24}px`); event.currentTarget.style.setProperty('--hero-pointer-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 16}px`) }} onPointerLeave={event => { event.currentTarget.style.setProperty('--hero-pointer-x', '0px'); event.currentTarget.style.setProperty('--hero-pointer-y', '0px') }}>
        <div className="hero-atmosphere" aria-hidden="true"><i /><i /><span className="hero-organic hero-organic-one" /><span className="hero-organic hero-organic-two" /><svg className="hero-constellation" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice"><g><path d="M650 90 805 170 730 330 920 400M805 170 930 100M730 330 600 470 750 610 930 680M600 470 450 570" />{[[650,90],[805,170],[730,330],[920,400],[930,100],[600,470],[750,610],[930,680],[450,570]].map(([x,y],index)=><circle key={index} cx={x} cy={y} r={index%3===0?3:2} />)}</g></svg><span className="hero-pointer-glow" /><span className="hero-grain" /><span className="hero-dust">{Array.from({ length: 12 }, (_, index) => <b key={index} style={{ '--dust-x': `${8 + (index * 29 % 86)}%`, '--dust-y': `${12 + (index * 17 % 76)}%`, '--dust-time': `${13 + index % 6 * 3}s`, '--dust-delay': `${-index * 2}s`, '--dust-size': `${2 + index % 3}px` }} />)}</span></div>
        <CoverSculpture />
        <div className="hero-inner shell">
          <p className="hero-topline"><span>SELECTED PORTFOLIO — 2026</span><span>SHANGHAI / LONDON</span></p>
          <div className="hero-body">
            <div className="hero-intro"><p className="hero-role">申屠欣溦<br /><span>设计研究 / 策略 / 体验</span></p><p className="hero-thesis">从空间出发，<br />让复杂议题<br />成为可感知的体验。</p></div>
            <h1 id="hero-title" aria-label="Xinwei Shentu"><span aria-hidden="true">{'Xinwei'.split('').map((letter, index) => <b className="name-letter" key={index} style={{ '--letter-index': index }}>{letter}</b>)}</span><em aria-hidden="true">{'Shentu'.split('').map((letter, index) => <b className="name-letter" key={index} style={{ '--letter-index': index + 6 }}>{letter}</b>)}<span className="hero-dot">.</span></em></h1>
            <div className="hero-bottomline">
              <p>皇家艺术学院 · MArch Design Practice<br />关注公共生活、气候转型与城市记忆。</p>
              <a href="#works">浏览精选项目 <span>01—04</span></a>
            </div>
          </div>
          <p className="hero-scroll"><span>RESEARCH INTO EXPERIENCE</span><span>向下探索 ↓</span></p>
          <div className="hero-discipline" aria-hidden="true"><div>{[0,1].map(copy => <span key={copy}>SPATIAL PRACTICE <i>·</i> SOCIAL INQUIRY <i>·</i> DESIGN STRATEGY <i>·</i> EXPERIENCE <i>·</i> </span>)}</div></div>
        </div>
      </section>

      <section className="about shell" id="about" aria-labelledby="about-title">
        <SectionMarker number="01" english="PROFILE" chinese="关于我" />
        <div className="about-layout about-layout-text-only">
          <div className="about-main">
            <p className="eyebrow">A RESEARCH-LED PRACTICE</p>
            <h2 id="about-title">以研究洞察社会，<br /><em>让设计回应真实生活。</em></h2>
            <p className="about-description">我毕业于皇家艺术学院 MArch Design Practice，本科为环境设计。空间设计训练让我关注场地、动线与人的体验，设计研究则让我进一步追问行为背后的社会与环境条件。我通过资料研究、物件档案和材料实验建立问题框架，再以空间、影像、声音和服务路径提出设计回应。</p>
            <div className="about-focus">
              <span>关注议题</span>
              <p>公共生活 <i>/</i> 气候转型 <i>/</i> 城市记忆 <i>/</i> 体验叙事</p>
            </div>
            <ExperienceList />
          </div>
        </div>
        <div className="profile-data">
          <div><strong>04</strong><span>重点案例<br /><small>FEATURED PROJECTS</small></span></div>
          <div><strong>03</strong><span>研究方向<br /><small>材料 · 社会系统 · 公共体验</small></span></div>
          <div><strong>05+</strong><span>实习参与项目<br /><small>LIVE PROJECTS</small></span></div>
          <div className="profile-contact"><span>直接联系</span><a href="mailto:shentuxinwei23@163.com">shentuxinwei23@163.com</a><a href="tel:+8617815714764">+86 178 1571 4764</a></div>
        </div>
      </section>

      <section className="works" id="works" aria-labelledby="works-title">
        <div className="shell">
          <SectionMarker number="02" english="SELECTED WORK" chinese="精选项目" />
          <div className="section-intro">
            <div><h2 className="display-heading" id="works-title">Selected<br /><em>work.</em><sup>(04)</sup></h2></div>
            <p>从空间组织，到日常社会议题的研究与公共表达。<br />以场所与叙事呈现设计基础，以档案、声音和服务系统展开研究实践。</p>
          </div>
          <nav className="work-index" aria-label="项目主题与讲述顺序">{projectChapters.map(chapter => <a href={`#${chapter.id}`} key={chapter.id}><span>{chapter.number} / {chapter.english}</span><strong>{chapter.title}</strong><small>{[...chapter.projects.map(number => featuredProjects.find(project => project.number === number).chinese), ...(chapter.id === 'place-narrative' ? ['黎明之城', '权力的空间'] : [])].join(' · ')}<b aria-hidden="true">↓</b></small></a>)}</nav>
          <div className="featured-list">{projectChapters.map(chapter => <section className="work-chapter" id={chapter.id} key={chapter.id}><header className="work-chapter-heading"><span>{chapter.number} / {chapter.english}</span><h3>{chapter.title}</h3><p>{chapter.description}</p></header>{chapter.projects.map(number => { const project = featuredProjects.find(item => item.number === number); return <Project key={number} project={project} index={Number(number) - 1} /> })}<FurtherProjects group={archiveGroups[chapter.id === 'place-narrative' ? 1 : 0]} id={chapter.id === 'place-narrative' ? 'application-more-work' : 'more-work'} />{chapter.id === 'research-experience' && <ResearchThread />}</section>)}</div>
        </div>
      </section>

      <section className="approach shell" id="approach" aria-labelledby="approach-title">
        <SectionMarker number="03" english="HOW I WORK" chinese="我的方法" />
        <div className="section-intro approach-intro">
            <div><h2 className="display-heading" id="approach-title">Ways of<br /><em>thinking.</em></h2></div>
            <p>先理解问题，再建立方向。<br />以叙事组织体验，用制作检验想法。</p>
        </div>
        <MethodExplorer />
        <div className="method-footnote"><span>TOOLS & MEDIA</span><p>资料与场地研究 · 系统图谱 · 空间原型 · 影像与声音 · Rhino · Blender · Adobe Suite · One Click LCA</p></div>
      </section>

      <footer className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact-inner shell">
          <SectionMarker number="04" english="CONTACT" chinese="联系方式" inverse />
          <div className="contact-main">
            <p>期待设计研究、创新策略与体验设计的工作机会</p>
            <h2 id="contact-title">Let's <em>talk.</em></h2>
            <div className="contact-invitation"><p>期待与你交流，<br />探索设计与合作的可能。</p><a href="mailto:shentuxinwei23@163.com">shentuxinwei23@163.com</a></div>
          </div>
          <div className="contact-bottom"><span>XINWEI SHENTU / 申屠欣溦</span><span>SHANGHAI · LONDON</span><a href="#top">回到顶部 ↑</a></div>
        </div>
      </footer>
    </main>
  )
}

function CaseFigure({ name, caption, page }) {
  return <figure className="case-figure">
    <a href={`/projects/great-world/page-${page}.jpg`} target="_blank" rel="noreferrer" aria-label={`${caption}，打开完整原图`}>
      <img src={`/projects/great-world/${name}.webp`} alt={caption} width="1800" height="1273" loading="lazy" />
    </a>
    <figcaption><span>{caption}</span><a href={`/projects/great-world/page-${page}.jpg`} target="_blank" rel="noreferrer">查看完整原图</a></figcaption>
  </figure>
}

function GreatWorldCase() {
  useEffect(() => {
    document.title = '上海大世界更新 — Xinwei Shentu'
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => { document.title = '申屠欣溦 Xinwei Shentu — Design Research & Experience' }
  }, [])
  return <main className="case-page">
    <header className="case-nav shell"><a href="#project-04">返回精选项目</a><span>XINWEI SHENTU / CASE 01</span><a href="mailto:shentuxinwei23@163.com">联系我</a></header>
    <section className="case-hero shell">
      <p className="eyebrow">PLACE STRATEGY / SPATIAL EXPERIENCE</p>
      <h1><span className="case-title-prefix">海派文化的当代演绎</span>上海大世界更新</h1>
      <p className="case-english">Metamorphosis of<br /><em>The Great World of Shanghai</em></p>
      <div className="case-lead"><p>让历史娱乐场所，<br />重新连接城市的日常生活。</p><p>以海派文化与代际活动为线索，通过剧场、餐饮、休闲与社交的复合使用，让上海大世界重新成为可以观看、游逛、停留与交流的城市公共空间。</p></div>
      <dl className="case-facts"><div><dt>场所</dt><dd>上海 · 大世界</dd></div><div><dt>项目性质</dt><dd>城市更新 / 空间改造 / 社交剧场</dd></div><div><dt>研究线索</dt><dd>海派文化 · 代际活动 · 公共性</dd></div><div><dt>设计产出</dt><dd>场地分析 / 概念拼贴 / 平剖面 / 场景设计</dd></div></dl>
      <CaseFigure name="cover" page="1" caption="项目主视觉：以剧场为核心的复合公共空间" />
    </section>
    <section className="case-chapter shell"><div className="case-chapter-intro"><p className="eyebrow">01 / CONTEXT & PEOPLE</p><h2>先理解周边生活，<br />再定义场所的角色。</h2><p>从周边用地、文化设施、居住区与活动路径切入，并梳理老年人、青年、儿童及志愿者的活动需求。项目要回应的不只是建筑形象，也包括不同人群如何在这里休闲、学习、观看与交流。</p></div><div className="case-image-pair"><CaseFigure name="context" page="1" caption="场地背景与周边功能关系" /><CaseFigure name="research" page="2" caption="场地、人群活动与历史线索分析" /></div></section>
    <section className="case-chapter shell"><div className="case-chapter-intro"><p className="eyebrow">02 / DESIGN STRATEGY</p><h2>延续文化记忆，<br />而不只是复刻装饰。</h2><p>方案以“剧场、戏剧与食物”为概念线索，把海派文化转译为当代的空间体验。折叠、交错、重复拱形与多层联系成为组织活动的方式，让不同的观看位置和日常路径产生交集。</p></div><CaseFigure name="concept" page="2" caption="从文化线索到空间语言：策略草图与概念拼贴" /></section>
    <section className="case-chapter shell"><div className="case-chapter-intro"><p className="eyebrow">03 / SPATIAL EXPERIENCE</p><h2>观看与被观看，<br />在同一个空间里发生。</h2><p>中心舞台连接观众与表演者，楼梯、坡道与连桥组织交错动线。平面与剖面进一步推演剧场、工作空间、休息区、餐饮及屋顶活动之间的关系，让穿行、停留和交流构成连续的体验。</p></div><div className="case-image-pair"><CaseFigure name="plans" page="3" caption="功能平面、交通组织与活动场景" /><CaseFigure name="experience" page="3" caption="中心舞台、多层视线与空间剖面" /></div></section>
    <section className="case-conclusion shell"><p className="eyebrow">PROJECT NOTE</p><h2>从空间设计，走向场所体验。</h2><p>项目从场地与人群分析、文化概念转译出发，以交错动线、多层视线和社交剧场重组公共生活。海派文化的当代演绎，在于让开放、多元与交融持续发生：使大世界既承载城市记忆，也成为不同世代共同创造新记忆的场所。</p><a className="case-entry" href="#project-04">返回精选项目</a></section>
    <CaseSequence current="great-world" />
  </main>
}

function FutureMemoryExperience() {
  const media = '/projects/shanghai-future-memory/'
  return <section className="future-experience shell" id="future-film">
    <div className="future-film-intro"><p className="eyebrow">LISTEN / REMEMBER / PARTICIPATE</p><h2>城市不只有天际线。<br /><em>也有那些被听见的日常。</em></h2><p>将声音视为地方记忆的入口：从上海滨江的视觉场景，进入船鸣、街头与日常活动的听觉片段。下面是原有声景影像的精选段落，不是已上线应用的实时演示。</p></div>
    <figure className="future-film"><video controls playsInline preload="none" poster={`${media}sonic-memory-poster.jpg`} aria-label="上海声景与城市记忆短片，29秒"><source src={`${media}sonic-memory.mp4`} type="video/mp4" /><a href={`${media}sonic-memory.mp4`}>打开声景短片</a></video><figcaption><span>01 / SONIC MEMORY · 29 秒</span><span>点击播放 · 建议戴耳机 · 原片 00:03–00:32</span></figcaption></figure>
    <div className="future-policy"><p className="eyebrow">WHY JUST TRANSITION?</p><h2>从保存声音，<br />到讨论谁的记忆被保留。</h2><div><p>项目从气候公正与城市文化记忆的角度出发，关注城市的非物质经验：转型不只涉及基础设施，也涉及人们的声音、地方归属与被记住的权利。</p><p>Future Memory Act 将文化记忆纳入城市适应的设计政策构想。声音地图是参与入口；社区故事是内容载体；政策框架则讨论这些经验如何进入城市适应与文化记忆的公共讨论。</p></div></div>
    <div className="future-policy-cards"><article><span>01 / PARTICIPATION</span><h3>谁能留下记忆？</h3><p>关注居民、迁入者与不同声音经验，让个人故事成为可分享的城市线索。</p></article><article><span>02 / CULTURAL MEMORY</span><h3>什么值得被保存？</h3><p>不仅记录地标，也记录叫卖、通勤与社区生活中的非物质经验。</p></article><article><span>03 / DESIGN POLICY</span><h3>如何进入公共讨论？</h3><p>通过声音地图与故事平台，让地方归属、文化记忆与居民参与进入气候适应的公共讨论。</p></article></div>
    <div className="future-demo"><div><p className="eyebrow">02 / INTERFACE STUDY</p><h2>用一个物件，<br />打开一段声音。</h2><p>以物件作为声音入口，将地点、影像与个人记忆连接起来。18 秒界面演示呈现从选择物件到进入城市声景的交互路径。</p></div><figure className="future-film"><video controls playsInline preload="none" poster={`${media}sound-interface-poster.jpg`} aria-label="声音交互界面演示，18秒"><source src={`${media}sound-interface.mp4`} type="video/mp4" /></video><figcaption><span>INTERACTION EXCERPT · 18 秒</span><span>原录屏 00:09–00:27</span></figcaption></figure></div>
    <details className="future-reference"><summary>项目调研证据 / 上海气候情景 <span>＋</span></summary><p>项目调研证据：通过 Second Sea 的上海海平面情景，考察沿江空间变化与地方记忆之间的关联，为声音档案的选址与文化保存议题提供背景。录屏采用 RCP 8.5 排放情景。</p><figure className="future-film"><video controls muted playsInline preload="none" poster={`${media}climate-reference-poster.jpg`} aria-label="Second Sea 外部气候研究参考，14秒"><source src={`${media}climate-reference.mp4`} type="video/mp4" /></video><figcaption>03 / EXTERNAL RESEARCH REFERENCE · 14 秒 · Second Sea</figcaption></figure></details>
  </section>
}

function CaseSequence({ current }) {
  const sequence = projectChapters.flatMap(chapter => chapter.projects.map(number => featuredProjects.find(item => item.number === number)))
  const index = sequence.findIndex(project => project.href === `#project/${current}`)
  if (index < 0) return null
  const previous = sequence[index - 1]
  const next = sequence[index + 1]
  return <nav className="case-sequence shell" aria-label="精选项目讲述顺序"><a href={previous?.href || '#works'}><small>{previous ? 'PREVIOUS CASE / 上一个项目' : 'PROJECT INDEX / 项目目录'}</small>{previous?.chinese || '回到精选项目'} ←</a><a href={next?.href || '#more-work'}><small>{next ? 'NEXT CASE / 下一个项目' : 'FURTHER PRACTICE / 延伸实践'}</small>{next?.chinese || '按主题探索更多作品'} →</a></nav>
}

function SecurityResearch() {
  return <section className="security-research shell"><div className="security-context"><p className="eyebrow">COLLABORATION CONTEXT / EXHIBITION</p><h2>以博物馆的物件视角，<br />构建日常生活的档案。</h2><dl><div><dt>合作背景</dt><dd>V&A Museum, London<br /><em>Pandemic Objects</em></dd></div><div><dt>展出与公众阅读</dt><dd>Royal College of Art<br />London · 2025</dd></div></dl><p>V&A 的 Pandemic Objects 是关于疫情中物件用途与意义变化的编辑研究项目。本项目在这一合作背景下，以当代考古与档案方法开展独立研究，并通过 RCA 展出将研究转化为公众可接触的体验。</p><div className="security-sources"><a href="https://www.vam.ac.uk/blog/pandemic-objects" target="_blank" rel="noreferrer">V&A / 项目研究语境 ↗</a><a href="https://2025.rca.ac.uk/school-of-architecture/design-practice-march/profile/xinwei-shentu/" target="_blank" rel="noreferrer">RCA / 毕业研究页面 ↗</a></div><small className="source-note">合作与展出信息据个人项目图版；V&A 官方页面用于解释研究语境。展出地点为 RCA，而非 V&A 馆内。</small></div><figure className="security-poster"><a href="/projects/security-theatre/research-poster.webp" target="_blank" rel="noreferrer"><img src="/projects/security-theatre/research-poster.webp" alt="安全剧场蓝色研究海报，呈现物件、恐惧与安全秩序的批判性论述" /></a><figcaption>独立研究海报 / 原始图像高清版本</figcaption></figure><figure className="security-map"><a href="/projects/security-theatre/archive-map.webp" target="_blank" rel="noreferrer"><img src="/projects/security-theatre/archive-map.webp" alt="疫情早期武汉市场相关图像与地图组成的研究拼贴" loading="lazy" /></a><figcaption>空间档案 / 图像与地图的叠置阅读 · 非疫情起源科学判断</figcaption></figure><div className="security-video-section"><div><p className="eyebrow">MOVING IMAGE / ARCHIVE IN USE</p><h2>从档案建构，<br />到公众阅读。</h2><p>从开篇的疫情日常影像，到围绕物件展开的拟纪录片叙事，观察影像如何将分散的社会经验组织成可被讨论的档案。</p></div><div className="security-video-grid"><figure><video controls playsInline preload="none" poster="/projects/security-theatre/film-poster.jpg"><source src="/projects/security-theatre/film-excerpt.mp4" type="video/mp4" /></video><figcaption>拟纪录片节选 · 30 秒 / 表演与研究叙事</figcaption></figure><figure><video controls playsInline preload="none" poster="/projects/security-theatre/documentary-opening-poster.jpg"><source src="/projects/security-theatre/documentary-opening.mp4" type="video/mp4" /></video><figcaption>开篇影像节选 · 30 秒 / 疫情日常与档案叙事</figcaption></figure></div><a className="case-entry" href="https://drive.google.com/file/d/1z5evlxUH5KM8-yI9Y_2KMH-z5snK3VcA/view" target="_blank" rel="noreferrer">原提交视频链接 ↗</a></div></section>
}

function ImportedCase({ project }) {
  useEffect(() => {
    document.title = `${project.chinese} — Xinwei Shentu`
    window.scrollTo({ top: 0, behavior: 'instant' })
    return () => { document.title = '申屠欣溦 Xinwei Shentu — Design Research & Experience' }
  }, [project.slug])
  const back = project.back || (project.slug === 'straw-rebirth' ? '#project-03' : ['city-of-dawn', 'power-station'].includes(project.slug) ? '#application-more-work' : '#more-work')
  const figure = (page) => project.slug === 'material-process' && page === 19 ? <div className="pavilion-single-pages" key={page}>{['left', 'right'].map((side, index) => <figure className="case-figure imported-figure pavilion-single-page" key={side}><a href={`/projects/material-process/pavilion-${side}.webp`} target="_blank" rel="noreferrer" aria-label={`打开展示亭图版第 ${index + 1} 页`}><img src={`/projects/material-process/pavilion-${side}.webp`} alt={`生物基复合材料展示亭：${index === 0 ? '空间框架与材料性能' : '材料实验与分层构造'}`} loading="lazy" /></a><figcaption><span>展示亭研究 / {String(index + 1).padStart(2, '0')}</span><a href={`/projects/material-process/pavilion-${side}.webp`} target="_blank" rel="noreferrer">放大阅读 ↗</a></figcaption></figure>)}</div> : <figure className={`case-figure imported-figure ${project.pages > 4 ? 'report-figure' : ''}`} key={page}>
    <a href={`/projects/${project.slug}/page-${page}.webp`} target="_blank" rel="noreferrer" aria-label={`打开第 ${page} 页完整图版`}><img src={`/projects/${project.slug}/page-${page}.webp`} alt={`${project.chinese}原稿第 ${page} 页`} loading="lazy" /></a>
    <figcaption><span>{project.figureLabels?.[page - 1] || (project.slug === 'carbon-economies' && page === 26 ? 'Otherwork / Carbon Economies 项目图版' : project.slug === 'material-process' && page === 19 ? 'Otherwork / 生物基复合材料展示亭' : `原稿图版 / ${String(page).padStart(2, '0')}`)}</span><a href={`/projects/${project.slug}/page-${page}.webp`} target="_blank" rel="noreferrer">放大阅读 ↗</a></figcaption>
  </figure>
  return <main className={`case-page ${project.slug === 'detailing-risk' ? 'risk-case-page' : ''}`}><header className="case-nav shell"><a href={back}>← 返回项目列表</a><span>XINWEI SHENTU / PROJECT</span><a href="mailto:shentuxinwei23@163.com">联系我</a></header>
    <section className="case-hero shell"><p className="eyebrow">{project.category}</p><h1>{project.slug === 'detailing-risk' ? <>建筑细节风险研究<span className="risk-title-sub">事故分析与方法干预</span></> : project.chinese}</h1><p className="case-english"><em>{project.title}</em></p><div className="case-lead"><p>{project.summary}</p><p>{project.chapters[0].text}</p></div><dl className="case-facts"><div><dt>项目性质</dt><dd>{project.type}</dd></div><div><dt>方法</dt><dd>{project.category}</dd></div><div className="project-credit"><dt>作者与贡献</dt><dd>{project.credit}</dd></div></dl></section>
    {project.slug === 'shanghai-future-memory' && <FutureMemoryExperience />}
    {project.slug === 'security-theatre' && <SecurityResearch />}
    {project.slug === 'material-process' && <section className="pavilion-opening shell" aria-label="展亭与构造概览"><figure><img src="/projects/material-process/pavilion-photo.webp" alt="工作室中的木构展亭框架与圆形开口" width="645" height="787" /><figcaption>01 / 空间框架 · 制作现场</figcaption></figure><div><p className="eyebrow">FROM MATERIAL TO SPACE</p><h2>让生物材料研究，<br />形成可进入的空间。</h2><p>以展亭作为材料实验的空间载体，将框架、圆形开口与分层表皮放在同一个构造系统中考虑。</p><img src="/projects/material-process/structure-study.webp" alt="展亭结构爆炸图与支撑节点" width="588" height="580" /><a className="case-entry" href="/projects/material-process/page-19.webp" onClick={event => { event.preventDefault(); document.getElementById('material-pavilion-board')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }) }}>查看展亭完整图版 ↓</a></div></section>}
    {project.slug === 'detailing-risk' ? <RiskNarrative figure={figure} /> : project.chapters.map((chapter, i) => <section className="case-chapter shell" id={project.slug === 'material-process' && i === 0 ? 'material-pavilion-board' : undefined} key={chapter.title}><div className="case-chapter-intro"><p className="eyebrow">0{i + 1} / {project.slug === 'material-process' && i === 0 ? 'PAVILION OVERVIEW' : 'PROCESS'}</p><h2>{chapter.title}</h2><p>{chapter.text}</p></div><div className={project.pages > 4 && chapter.pages.length > 1 ? 'case-image-pair' : 'wide-plates'}>{chapter.pages.map(figure)}</div></section>)}
    <section className="case-conclusion shell"><p className="eyebrow">PROJECT NOTE</p><h2>{project.conclusionTitle || '设计思考与研究延伸'}</h2><p>{project.note}</p><details className="full-report"><summary>{project.archiveLabel || `浏览完整原稿 · ${project.pages} 页`} <span>＋</span></summary><div className="report-grid">{Array.from({ length: project.pages }, (_, i) => figure(i + 1))}</div></details><a className="case-entry" href={back}>返回项目列表 ↑</a></section>
    <CaseSequence current={project.slug} />
  </main>
}

function Portfolio() {
  const language = useLanguage()
  const [hash, setHash] = useState(window.location.hash)
  const previousHash = useRef(hash)
  usePortfolioMotion(hash.startsWith('#project/') ? hash : 'home')
  useEffect(() => {
    const update = () => setHash(window.location.hash)
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  useEffect(() => {
    if (!hash.startsWith('#project/')) {
      const samePage = previousHash.current !== hash && !previousHash.current.startsWith('#project/')
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: samePage && !reduced ? 'smooth' : 'instant', block: 'start' })
    }
    previousHash.current = hash
  }, [hash])
  const project = [...importedProjects, ...featuredCases].find(item => hash === `#project/${item.slug}`)
  useEffect(() => { document.title = translate(project ? `${project.chinese} — Xinwei Shentu` : hash === '#project/great-world' ? '上海大世界更新 — Xinwei Shentu' : '申屠欣溦 Xinwei Shentu — Design Research & Experience') }, [language, hash])
  return <><div className="reading-progress" aria-hidden="true" /><div className="project-cursor" aria-hidden="true">查看项目 <span>↗</span></div>{hash === '#project/great-world' ? <GreatWorldCase /> : project ? <ImportedCase project={project} /> : <App />}{hash.startsWith('#project/') && <LanguageSwitch floating />}<ReadingTools route={hash.startsWith('#project/') ? hash : 'home'} /></>
}

createRoot(document.getElementById('root')).render(<Portfolio />)
