import React from './language'

const pairs = [
  { id: 'repair', number: '01', cause: '维修叠层增载', mechanism: '多次维修叠加屋面构造层，增加结构长期承担的恒载。', measure: '轻量化屋面与改造记录', action: '比较轻量化替代构造，并记录每次维修的构造层、荷载变化与责任人。', aim: '减少新增恒载，让后续改造有据可查。', evidence: [5, 6], solution: [14] },
  { id: 'storage', number: '02', cause: '珍珠岩堆放与吸水', mechanism: '屋面堆放增加局部荷载，降雨后的吸水进一步放大超载风险。', measure: '堆载管理与结构监测', action: '明确屋面使用和材料堆放限制，建立雨后检查与维护培训；通过荷载、应变和位移监测识别异常。', aim: '控制使用阶段的额外荷载，及时发现异常变化。', evidence: [7, 8, 9, 10], solution: [21, 22] },
  { id: 'drainage', number: '03', cause: '排水不足与积水', mechanism: '排水不畅使雨水停留在屋面，与材料吸水共同增加荷载。', measure: '分区找坡与连续排水路径', action: '从屋面分区找坡、角部排水口到集水斗、落水管与雨链，组织从屋面到地面的完整排水系统。', aim: '减少积水，并使排水路径便于检查与维护。', evidence: [11], solution: [15, 16, 17, 18, 19, 20] },
]

export default function RiskNarrative({ figure }) {
  const jump = id => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  return <>
    <section className="risk-overview shell case-chapter"><p className="eyebrow">CAUSE → MECHANISM → INTERVENTION</p><h2>三个风险点，三组对应措施。</h2><p className="risk-overview-lead">以齐齐哈尔体育馆事故为研究案例，先梳理荷载如何累积，再提出构造、使用管理和排水方面的干预。下面按同一编号讲述原因与措施。</p>
      <div className="risk-matrix"><div className="risk-matrix-head"><span>研究识别的风险</span><span>对应设计措施</span></div>{pairs.map(pair => <button type="button" key={pair.id} onClick={() => jump(`risk-${pair.id}`)}><span><small>{pair.number}</small>{pair.cause}</span><span><i aria-hidden="true">→</i>{pair.measure}<b aria-hidden="true">↓</b></span></button>)}</div>
      <details className="risk-evidence"><summary>先看事故背景与时间线 <span>＋</span></summary><div className="case-image-pair">{[3, 4].map(figure)}</div></details>
    </section>
    {pairs.map(pair => <section key={pair.id} id={`risk-${pair.id}`} className="risk-pair case-chapter shell"><header className="risk-pair-heading"><span>{pair.number}</span><div><p className="eyebrow">RISK & RESPONSE</p><h2>{pair.cause} → {pair.measure}</h2></div></header>
      <div className="risk-response-grid"><article><small>事故原因 / 风险机制</small><h3>{pair.cause}</h3><p>{pair.mechanism}</p><details className="risk-evidence"><summary>查看原因证据 <span>＋</span></summary><div className="risk-plates">{pair.evidence.map(figure)}</div></details></article><article><small>对应措施 / 设计干预</small><h3>{pair.measure}</h3><p>{pair.action}</p><div className="risk-aim"><span>措施目标</span><p>{pair.aim}</p></div><details className="risk-evidence"><summary>查看措施图版 <span>＋</span></summary><div className="risk-plates">{pair.solution.map(figure)}</div></details></article></div>
      <p className="risk-pair-takeaway"><span>讲述要点</span>{pair.cause} → {pair.measure} → {pair.aim}</p>
    </section>)}
    <section className="case-chapter shell risk-governance"><p className="eyebrow">CONNECTED RESPONSIBILITIES</p><h2>把三组措施连接成持续的维护机制。</h2><p>轻量化构造控制基础荷载，堆载管理与监测控制使用阶段的变化，连续排水降低降雨带来的附加荷载。数字档案、定期检查和维护培训贯穿三者，使每次改造、异常与处置都能被追溯。</p></section>
  </>
}
