'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Category = 'TV & FILM' | 'COMMERCIAL' | 'EDITORIAL';
type Filter = 'ALL' | Category;
type Panel = 'about' | 'contact' | null;

type SeriesClip = {
  title: string;
  video: string;
  poster: string;
};

type Project = {
  slug: string;
  number: string;
  brand: string;
  type: string;
  title: string;
  titleEn: string;
  category: Category;
  video: string;
  poster: string;
  year: string;
  role: string;
  description: string;
  series?: SeriesClip[];
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const mediaBaseUrl = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? basePath).replace(/\/$/, '');
const siteAsset = (path: string) => `${mediaBaseUrl}${path}`;

const projects: Project[] = [
  {
    slug: 'dian-shi-making-of-gan-wei-ren-xian', number: '01', brand: '点石数码', type: '制作幕后', title: '敢为人先', titleEn: 'Making Of · Dare to Lead', category: 'COMMERCIAL', video: siteAsset('/portfolio-media/dian-shi-making-of.mp4'), poster: siteAsset('/portfolio-media/dian-shi-making-of.jpg'), year: '2024 年', role: '剪辑师 / 编导', description: '此片是 2024 年深圳市形象宣传片《敢为人先》的幕后制作花絮。\n\n整体制作花费 3 个月时间，修改了 22 个版本，目的是整体展示正片制作的完整流程。此片也是最能体现剪辑节奏、结构判断与叙事能力的代表剪辑作品',
  },
  {
    slug: 'dr-roy-short-video-series', number: '02', brand: 'Dr.Roy', type: '短视频', title: '健康科普系列', titleEn: 'Health Explainer Series', category: 'COMMERCIAL', video: siteAsset('/portfolio-media/drroy-fructose.mp4'), poster: siteAsset('/portfolio-media/drroy-fructose.jpg'), year: '2025年', role: '剪辑师 / 编导', description: '以清晰结构和视觉节奏承载复杂健康知识的短视频系列。',
    series: [
      { title: '果糖的谎言', video: siteAsset('/portfolio-media/drroy-fructose.mp4'), poster: siteAsset('/portfolio-media/drroy-fructose.jpg') },
      { title: '内脏脂肪', video: siteAsset('/portfolio-media/drroy-visceral-fat.mp4'), poster: siteAsset('/portfolio-media/drroy-visceral-fat.jpg') },
      { title: '陈传多抗衰', video: siteAsset('/portfolio-media/drroy-chenchuanduo.mp4'), poster: siteAsset('/portfolio-media/drroy-chenchuanduo.jpg') },
      { title: '卡路里骗局', video: siteAsset('/portfolio-media/drroy-calorie.mp4'), poster: siteAsset('/portfolio-media/drroy-calorie.jpg') },
      { title: '生命的意义', video: siteAsset('/portfolio-media/drroy-meaning.mp4'), poster: siteAsset('/portfolio-media/drroy-meaning.jpg') },
      { title: '睡眠红皮书', video: siteAsset('/portfolio-media/drroy-sleep.mp4'), poster: siteAsset('/portfolio-media/drroy-sleep.jpg') },
    ],
  },
  {
    slug: 'haifeisi-traceability', number: '03', brand: '海飞丝 × 屈臣氏', type: '短视频', title: 'HWB“十万公里”溯源之旅', titleEn: 'HWB 100,000 KM Traceability Journey', category: 'COMMERCIAL', video: siteAsset('/portfolio-media/haifeisi-traceability.mp4'), poster: siteAsset('/portfolio-media/haifeisi-traceability.jpg'), year: '2023年', role: '剪辑师、摄影师', description: '此片是由屈臣氏与宝洁合作的一支溯源短视频，是在新加坡拍摄的。\n\n视频目的是展示海飞丝总部的溯源，并进行一些产品展示。整体流程以主持人完成一个任务为线索，主要需要以板块化、结构化的方式去展示各个环节，突出每个环节的重点',
  },
  {
    slug: 'nanyue-museum', number: '04', brand: '南越王博物院', type: '宣传片', title: '文物展示', titleEn: 'Artifact Exhibition Film', category: 'COMMERCIAL', video: siteAsset('/portfolio-media/nanyue-museum.mp4'), poster: siteAsset('/portfolio-media/nanyue-museum.jpg'), year: '2023年', role: '剪辑师', description: '此片是南越王博物院的一个文物展示样片。\n\n我们想要以一种科技感的氛围去呈现每个文物，所以用 AE（After Effects）做了一些文物的 3D投息效果。',
  },
  {
    slug: 'pengcheng-new-energy', number: '05', brand: '鹏城新能源', type: '宣传片', title: '出海', titleEn: 'Going Global', category: 'COMMERCIAL', video: siteAsset('/portfolio-media/pengcheng-new-energy.mp4'), poster: siteAsset('/portfolio-media/pengcheng-new-energy.jpg'), year: '2025年', role: '剪辑师 / 编导', description: '此片是深圳市鹏程新能源公司的一个公司形象宣传片。因为客户是面向海外的，所以整体以英文形式去展示公司的整体项目、产品以及业务，最后还展现了公司的愿景。这是一个 Demo 版本',
  },
  {
    slug: 'ruitake-alarm-tvc', number: '06', brand: '锐塔克', type: 'TVC', title: '电子闹钟', titleEn: 'Alarm Clock TVC', category: 'COMMERCIAL', video: siteAsset('/portfolio-media/ruitake-tvc-alarm.mp4'), poster: siteAsset('/portfolio-media/ruitake-tvc-alarm.jpg'), year: '2024年', role: '剪辑师', description: '此片是深圳晓谷公司锐塔克品牌的一个电子闹钟 TVC 项目。\n\n讲的是一个陪伴的故事：电子闹钟从小陪到大，经历过各种事情，但它始终在那里。整体要突出一个比较偏成长、温和的情绪氛围。',
  },
  {
    slug: 'guangdong-tv-pet-toilet', number: '07', brand: '广东卫视', type: '电视栏目', title: '爱宠笑园—机场宠物厕所', titleEn: 'Pet Toilet at the Airport', category: 'TV & FILM', video: siteAsset('/portfolio-media/guangdong-tv-pet-toilet.mp4'), poster: siteAsset('/portfolio-media/guangdong-tv-pet-toilet.jpg'), year: '2023年', role: '剪辑师 / 编导', description: '这是一档在广东卫视播放的电视栏目《爱宠笑园》，栏目围绕宠物话题讲述一个个有趣生动的故事，这期节目围绕机场宠物厕所展开，展现了白云机场的人性化设施',
  },
  {
    slug: 'shein-anniversary', number: '08', brand: '希音', type: '活动快剪', title: '周年庆', titleEn: 'Anniversary Event Recap', category: 'COMMERCIAL', video: siteAsset('/portfolio-media/shein-anniversary.mp4'), poster: siteAsset('/portfolio-media/shein-anniversary.jpg'), year: '2023年', role: '剪辑师 / 编导', description: '这是广州希音的周年庆活动快剪，剪辑用时3小时，在海量素材中找出线索是挑战',
  },
  {
    slug: 'yuanclub-ar-game', number: '09', brand: 'YuanClub', type: '宣传片', title: '元宇宙 AR 游戏冲击波', titleEn: 'Metaverse AR Game Impact', category: 'COMMERCIAL', video: siteAsset('/portfolio-media/yuanclub-ar-game.mp4'), poster: siteAsset('/portfolio-media/yuanclub-ar-game.jpg'), year: '2024年', role: '剪辑师 / 编导', description: '此片是AR游戏冲击波的宣传片，除了赛场，还有多个场景的交叉蒙太奇叙事。在激烈的游戏比赛中插入观众反应突出现场的热情。',
  },
  {
    slug: 'nanshan-biomedical-investment', number: '10', brand: '南山区卫健委', type: '宣传片', title: '南山生物医药投资成果', titleEn: 'Nanshan Biomedical Investment Achievements', category: 'COMMERCIAL', video: siteAsset('/portfolio-media/nanshan-biomedical-investment.mp4'), poster: siteAsset('/portfolio-media/nanshan-biomedical-investment.png'), year: '2024 年', role: '剪辑师', description: '这条影片是我作为剪辑师，去展示南山区 2024 年生物医药投资成果。整体耗时 7 天，修改了 12 个版本。',
  },
];

const categoryLabels: { key: Filter; label: string }[] = [
  { key: 'ALL', label: 'ALL' }, { key: 'TV & FILM', label: 'TV & FILM' }, { key: 'COMMERCIAL', label: 'COMMERCIAL' }, { key: 'EDITORIAL', label: 'EDITORIAL' },
];

const categoryZh: Record<Category, string> = {
  'TV & FILM': '电视与影视',
  COMMERCIAL: '商业影像',
  EDITORIAL: '编辑与视觉',
};

function countFor(filter: Filter) {
  return filter === 'ALL' ? projects.length : projects.filter((project) => project.category === filter).length;
}

export default function Home() {
  const [filter, setFilter] = useState<Filter>('ALL');
  const [activeSlug, setActiveSlug] = useState(projects[0].slug);
  const [panel, setPanel] = useState<Panel>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [seriesIndex, setSeriesIndex] = useState(0);
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [pageReady, setPageReady] = useState(false);
  const [outgoingProject, setOutgoingProject] = useState<Project | null>(null);
  const [motionDirection, setMotionDirection] = useState<1 | -1>(1);
  const [motionKey, setMotionKey] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [playCursorState, setPlayCursorState] = useState<'hidden' | 'visible' | 'leaving'>('hidden');
  const videoRef = useRef<HTMLVideoElement>(null);
  const playCursorRef = useRef<HTMLSpanElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const wheelLocked = useRef(false);
  const transitionTimer = useRef<number | null>(null);
  const playCursorTimer = useRef<number | null>(null);
  const visitStartedAt = useRef<number | null>(null);

  const visibleProjects = useMemo(() => filter === 'ALL' ? projects : projects.filter((project) => project.category === filter), [filter]);
  const activeIndex = Math.max(0, visibleProjects.findIndex((project) => project.slug === activeSlug));
  const activeProject = visibleProjects[activeIndex] ?? visibleProjects[0] ?? projects[0];
  const activeSeriesClip = activeProject.series?.[seriesIndex] ?? null;
  const currentVideo = activeSeriesClip?.video ?? activeProject.video;
  const currentPoster = activeSeriesClip?.poster ?? activeProject.poster;

  const selectProject = (project: Project) => {
    setActiveSlug(project.slug); setSeriesIndex(0); window.history.replaceState({}, '', `#work=${project.slug}`);
  };
  const transitionToProject = (project: Project, direction: 1 | -1) => {
    if (project.slug === activeProject.slug) return;
    setOutgoingProject(activeProject);
    setMotionDirection(direction);
    setMotionKey((key) => key + 1);
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => setOutgoingProject(null), 1380);
    selectProject(project);
  };
  const moveProject = (direction: 1 | -1) => {
    const nextIndex = (activeIndex + direction + visibleProjects.length) % visibleProjects.length;
    transitionToProject(visibleProjects[nextIndex], direction);
  };
  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { void videoRef.current.play(); setPlaying(true); } else { videoRef.current.pause(); setPlaying(false); }
  };
  const handleWheel = (deltaY: number) => {
    if (preloaderVisible || detailOpen || panel || wheelLocked.current || Math.abs(deltaY) < 16) return;
    wheelLocked.current = true;
    moveProject(deltaY > 0 ? 1 : -1);
    window.setTimeout(() => { wheelLocked.current = false; }, 1320);
  };
  const showPlayCursor = () => {
    if (playCursorTimer.current !== null) window.clearTimeout(playCursorTimer.current);
    setPlayCursorState('visible');
  };
  const hidePlayCursor = () => {
    if (playCursorTimer.current !== null) window.clearTimeout(playCursorTimer.current);
    setPlayCursorState('leaving');
    playCursorTimer.current = window.setTimeout(() => setPlayCursorState('hidden'), 620);
  };

  useEffect(() => {
    const handleHash = () => { const next = window.location.hash.match(/^#work=(.+)$/)?.[1]; if (next && projects.some((project) => project.slug === next)) setActiveSlug(next); };
    window.addEventListener('hashchange', handleHash); return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const revealTimer = window.setTimeout(() => setPageReady(true), 5150);
    const removeTimer = window.setTimeout(() => setPreloaderVisible(false), 6600);
    return () => { window.clearTimeout(revealTimer); window.clearTimeout(removeTimer); };
  }, []);

  useEffect(() => {
    visitStartedAt.current = Date.now();
    const tick = () => setElapsedSeconds(Math.floor((Date.now() - (visitStartedAt.current ?? Date.now())) / 1000));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => () => {
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    if (playCursorTimer.current !== null) window.clearTimeout(playCursorTimer.current);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') moveProject(1);
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') moveProject(-1);
      if (event.key === 'Escape') { setDetailOpen(false); setPanel(null); }
      if (event.key.toLowerCase() === 'i') setDetailOpen(true);
    };
    window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey);
  });

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = muted;
    if (playing) void videoRef.current.play().catch(() => setPlaying(false));
  }, [currentVideo, muted, playing]);

  return (
    <main className={`site-shell ${pageReady ? 'is-ready' : 'is-loading'}`} onWheel={(event) => { event.preventDefault(); handleWheel(event.deltaY); }} onTouchStart={(event) => { const point = event.touches[0]; touchStart.current = point ? { x: point.clientX, y: point.clientY } : null; }} onTouchEnd={(event) => {
      if (touchStart.current === null) return;
      const point = event.changedTouches[0];
      const deltaX = (point?.clientX ?? 0) - touchStart.current.x;
      const deltaY = (point?.clientY ?? 0) - touchStart.current.y;
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) > 42) moveProject(Math.abs(deltaY) > Math.abs(deltaX) ? (deltaY < 0 ? 1 : -1) : (deltaX < 0 ? 1 : -1)); touchStart.current = null;
    }}>
      <div className="noise" aria-hidden="true" />
      {preloaderVisible && <section className="preloader" aria-label="正在加载廖海桥作品集">
        <div className="preloader-background" aria-hidden="true"><span className="preloader-half preloader-half-left" /><span className="preloader-half preloader-half-right" /></div>
        <div className="preloader-number-rail preloader-number-rail-left" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index}>{String(index * 10).padStart(2, '0')}</span>)}</div>
        <div className="preloader-number-rail preloader-number-rail-right" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index}>{String(110 - index * 10).padStart(2, '0')}</span>)}</div>
        <div className="preloader-columns" aria-hidden="true">
          <div className="preloader-column preloader-column-left"><div className="preloader-strip preloader-strip-left">{[...projects, ...projects, ...projects].map((project, index) => <img src={project.poster} alt="" loading="eager" key={`left-${project.slug}-${index}`} />)}</div></div>
          <div className="preloader-column preloader-column-right"><div className="preloader-strip preloader-strip-right">{[...projects.slice().reverse(), ...projects.slice().reverse(), ...projects.slice().reverse()].map((project, index) => <img src={project.poster} alt="" loading="eager" key={`right-${project.slug}-${index}`} />)}</div></div>
        </div>
        <div className="preloader-copy">
          <div className="preloader-loading-row"><span className="preloader-loading-left">剪辑 / EDITING</span><span className="preloader-loading-right">编导 / DIRECTION</span></div>
          <div className="preloader-name-lockup"><span className="preloader-name preloader-name-left">Liao</span><span className="preloader-odometer"><span>00</span><span>24</span><span>57</span><span>99</span></span><span className="preloader-name preloader-name-right">Haiqiao</span></div>
          <div className="preloader-signature">廖海桥 · VISUAL STORYTELLING</div>
        </div>
      </section>}
      <header className="topbar">
        <button className="identity" onClick={() => { setPanel(null); setDetailOpen(false); }} aria-label="返回作品首页"><span className="identity-name">Liao Haiqiao <i>廖海桥</i></span><span className="identity-latin">EDITOR / DIRECTOR</span></button>
        <span className="identity-role">CREATIVE</span>
        <nav className="main-nav" aria-label="主导航">
          <button className={!panel && !detailOpen ? 'nav-active' : ''} onClick={() => { setPanel(null); setDetailOpen(false); }}>• WORK</button>
          <button onClick={() => setDetailOpen(true)}>ARCHIVE</button>
          <button className={panel === 'about' ? 'nav-active' : ''} onClick={() => { setPanel('about'); setDetailOpen(false); }}>ABOUT</button>
          <a href={siteAsset('/LiaoHaiqiao-CV.pdf')} download>RESUME</a>
          <button className={panel === 'contact' ? 'nav-active' : ''} onClick={() => { setPanel('contact'); setDetailOpen(false); }}>CONTACT</button>
        </nav>
        <button className="language" onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')} aria-label="切换中英文">{language === 'zh' ? '中 / EN' : 'EN / 中'}</button>
      </header>

      <div className="ruler ruler-x" aria-hidden="true">{Array.from({ length: 11 }, (_, index) => <span key={index}>{index * 10}</span>)}</div>
      <div className="ruler ruler-y" aria-hidden="true">{Array.from({ length: 11 }, (_, index) => <span key={index}>{index * 10}</span>)}</div>

      <section className="work-stage" aria-label="作品浏览区">
        {outgoingProject && <div className={`hero-title hero-title-left hero-title-exit ${motionDirection === 1 ? 'exit-up' : 'exit-down'} tone-${activeIndex % 4}`} aria-hidden="true"><span>{outgoingProject.title}</span></div>}
        {outgoingProject && <div className={`hero-title hero-title-right hero-title-exit ${motionDirection === 1 ? 'exit-down' : 'exit-up'} tone-${activeIndex % 4}`} aria-hidden="true"><span>{outgoingProject.brand}</span></div>}
        <div className={`hero-title hero-title-left hero-title-enter ${motionDirection === 1 ? 'enter-from-bottom' : 'enter-from-top'} tone-${activeIndex % 4}`} key={`left-${motionKey}`} aria-hidden="true">{motionKey === 0 && activeIndex === 0 ? <><span>The Greatest</span><em>Love</em></> : <span>{language === 'zh' ? activeProject.title : activeProject.titleEn}</span>}</div>
        <div className={`hero-title hero-title-right hero-title-enter ${motionDirection === 1 ? 'enter-from-top' : 'enter-from-bottom'} tone-${activeIndex % 4}`} key={`right-${motionKey}`} aria-hidden="true">{motionKey === 0 && activeIndex === 0 ? <><span>Story Never</span><em>Told</em></> : <span>{activeProject.brand}</span>}</div>
        <button className={`floating-card card-top preview-loader ${motionDirection === 1 ? 'preview-rises' : 'preview-settles'}`} key={`top-${activeSlug}-${motionKey}`} onClick={() => moveProject(-1)} aria-label="上一个项目"><img src={visibleProjects[(activeIndex - 1 + visibleProjects.length) % visibleProjects.length]?.poster} alt="" /></button>
        <div className="feature-stage" aria-live="polite">
          <div className="feature-label"><span>FEATURE / {activeProject.type}</span><span>{activeProject.category}</span></div>
          <button className={`feature-card ${motionDirection === 1 ? 'video-expands' : 'video-assembles'}`} key={`video-${activeSlug}-${motionKey}`} onClick={() => setDetailOpen(true)} onPointerEnter={showPlayCursor} onPointerMove={(event) => { const frame = event.currentTarget.getBoundingClientRect(); if (playCursorRef.current) { playCursorRef.current.style.left = `${event.clientX - frame.left}px`; playCursorRef.current.style.top = `${event.clientY - frame.top}px`; } }} onPointerLeave={hidePlayCursor} aria-label={`播放 ${activeProject.title}`}><video src={currentVideo} poster={currentPoster} autoPlay muted loop playsInline preload={activeProject.slug === projects[0].slug ? 'auto' : 'metadata'} /><span ref={playCursorRef} className={`play-cursor play-cursor-${playCursorState}`} aria-hidden="true"><span className="play-cursor-copy play-cursor-top">• 播放视频</span><span className="play-cursor-copy play-cursor-bottom">• 播放视频</span></span></button>
          <div className="feature-caption"><span className="feature-number">{activeProject.number}.</span><span className="feature-total">.{String(projects.length).padStart(2, '0')}</span></div>
        </div>
        <button className={`floating-card card-bottom preview-loader ${motionDirection === 1 ? 'preview-rises' : 'preview-settles'}`} key={`bottom-${activeSlug}-${motionKey}`} onClick={() => moveProject(1)} aria-label="下一个项目"><img src={visibleProjects[(activeIndex + 1) % visibleProjects.length]?.poster} alt="" /></button>
        <div className="edge-watermarks" aria-hidden="true"><span className="edge-mark edge-mark-left">LHQ / 廖海桥</span><span className="edge-mark edge-mark-right">EDITOR · DIRECTOR</span><span className="edge-mark edge-mark-top">LHQ 01—09</span><span className="edge-monogram">L/HQ</span></div>
        <div className="stage-controls"><button onClick={() => moveProject(-1)} aria-label="上一个项目">↑ PREV</button><span>SCROLL TO BROWSE</span><button onClick={() => moveProject(1)} aria-label="下一个项目">NEXT ↓</button></div>
      </section>

      <footer className="site-footer"><span className="footer-year">© {new Date().getFullYear()}</span><div className="view-switch"><button className="filter-active">SLIDER</button><span>/</span><button onClick={() => setDetailOpen(true)}>LIST</button></div><div className="footer-dock"><div className="filter-row" aria-label="作品分类">{categoryLabels.map(({ key, label }) => { const count = countFor(key); if (key === 'EDITORIAL' && count === 0) return null; return <button key={key} className={filter === key ? 'filter-active' : ''} onClick={() => { setFilter(key); if (key !== 'ALL' && !visibleProjects.some((project) => project.category === key)) selectProject(projects[0]); }}>{filter === key ? '• ' : ''}{label} <sup>({String(count).padStart(2, '0')})</sup></button>; })}</div><time className="session-time" dateTime={`PT${elapsedSeconds}S`}>{new Date(elapsedSeconds * 1000).toISOString().slice(11, 19)}</time><div className="footer-tools"><button onClick={togglePlayback}>{playing ? 'PAUSE' : 'PLAY'}</button><button onClick={() => setMuted(!muted)}>{muted ? 'UNMUTE' : 'MUTE'}</button><button onClick={() => setPanel('about')}>CREDITS</button></div></div></footer>

      {detailOpen && <section className="detail-panel" aria-label="项目详情"><div className="detail-video-wrap"><video ref={videoRef} key={currentVideo} src={currentVideo} poster={currentPoster} autoPlay muted={muted} loop playsInline controls preload="metadata" /></div><aside className="detail-copy"><div className="detail-header"><span>{Number(activeProject.number)} / {projects.length}</span><button className="detail-close" onClick={() => setDetailOpen(false)} aria-label="关闭项目详情">关闭</button></div><div className="detail-content"><p className="detail-kicker">{activeProject.type} / {categoryZh[activeProject.category]}</p><h2>{activeProject.title}</h2><p className="detail-subtitle">{activeProject.brand}</p><div className="detail-credit"><span>我的职责</span><strong>{activeProject.role}</strong></div><div className="detail-credit"><span>品牌方</span><strong>{activeProject.brand}</strong></div><div className="detail-credit"><span>年份</span><strong>{activeProject.year}</strong></div><p className="detail-description">{activeProject.description}</p>{activeProject.series && <div className="series-picker"><span>系列视频 / {String(activeProject.series.length).padStart(2, '0')}</span>{activeProject.series.map((clip, index) => <button key={clip.title} className={index === seriesIndex ? 'series-active' : ''} onClick={() => { setSeriesIndex(index); setPlaying(true); }}>{String(index + 1).padStart(2, '0')}　{clip.title}</button>)}</div>}</div><div className="detail-nav"><button onClick={() => moveProject(-1)}>← 上一个项目</button><button onClick={() => moveProject(1)}>下一个项目 →</button></div></aside></section>}

      {panel && <section className="info-panel" aria-label={panel === 'about' ? '关于廖海桥' : '联系廖海桥'}><button className="panel-close" onClick={() => setPanel(null)}>CLOSE ×</button>{panel === 'about' ? <div className="panel-content"><p className="eyebrow">ABOUT / 关于</p><h2>廖海桥<br /><em>剪辑师 / 导演</em></h2><p>拥有三年视频制作经验，参与品牌宣传、深度科普、产品视频、企业短片、纪录片、活动花絮与电视栏目内容制作。</p><p>擅长素材整理、结构剪辑、节奏设计、音乐音效、字幕包装、基础调色与多平台版本输出。</p><div className="skill-list"><span>DaVinci Resolve</span><span>Premiere Pro</span><span>After Effects</span><span>Photoshop</span><span>结构剪辑</span><span>节奏设计</span></div></div> : <div className="panel-content"><p className="eyebrow">CONTACT / 联系</p><h2>LET&apos;S<br /><em>MAKE SOMETHING.</em></h2><a className="email-link" href="mailto:1273802467@qq.com">1273802467@qq.com ↗</a><a className="resume-link" href={siteAsset('/LiaoHaiqiao-CV.pdf')} download>DOWNLOAD RESUME / 下载简历 ↘</a><p className="contact-note">欢迎联系剪辑、后期制作、编导及影像内容相关机会。</p></div>}</section>}
    </main>
  );
}
