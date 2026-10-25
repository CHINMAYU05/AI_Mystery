import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './styles.css';

const evidenceTypes = ['chat', 'image', 'cctv', 'document', 'witness', 'forensic'];
const icon = { chat: '↗', image: '▧', cctv: '◉', document: '▤', witness: '“', forensic: '⌕' };
const tokenFor = (id) => sessionStorage.getItem(`case:${id}`);
async function api(path, options = {}) {
  const response = await fetch(`/api/v1${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.caseId ? { Authorization: `Bearer ${tokenFor(options.caseId)}` } : {}), ...options.headers } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || 'Something went wrong. Please try again.');
  return data;
}

function Brand({ small = false }) { return <Link className={`brand ${small ? 'brand-small' : ''}`} to="/"><span className="brand-mark">C</span><span>CASEFILE<span className="brand-sub">AN AI MYSTERY ROOM</span></span></Link>; }
function Header() { return <header className="topbar"><Brand /><div className="topbar-right"><span className="live-dot" /> FICTIONAL CASEWORK <span className="top-separator">·</span> EST. 2025</div></header>; }
function Eyebrow({ children }) { return <div className="eyebrow"><span />{children}</div>; }

function Home() {
  const navigate = useNavigate();
  const [premise, setPremise] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [caseLength, setCaseLength] = useState('standard');
  const [tone, setTone] = useState('noir');
  const [selected, setSelected] = useState([...evidenceTypes]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [example, setExample] = useState(0);
  const examples = ['A priceless diamond disappears from a locked museum room during a private exhibition.', 'The lighthouse keeper vanishes on the one night the foghorn fell silent.', 'A celebrated chef collapses before the final course at a secluded mountain lodge.'];
  const trimmedLength = premise.trim().length;
  const toggleEvidence = (type) => setSelected((items) => items.includes(type) ? items.filter((item) => item !== type) : [...items, type]);
  async function createCase(event) {
    event.preventDefault(); setError('');
    if (trimmedLength < 30) { setError('Give your case a little more detail (at least 30 characters).'); return; }
    if (!selected.length) { setError('Choose at least one evidence type.'); return; }
    setBusy(true);
    try {
      const data = await api('/cases', { method: 'POST', body: JSON.stringify({ premise, difficulty, caseLength, tone, evidencePreferences: selected, language: 'en' }) });
      sessionStorage.setItem(`case:${data.caseId}`, data.accessToken);
      navigate(`/cases/${data.caseId}`);
    } catch (cause) { setError(cause.message); setBusy(false); }
  }
  return <><Header /><main className="home-wrap">
    <section className="hero"><div className="hero-copy"><Eyebrow>YOUR NEXT CASE STARTS HERE</Eyebrow><h1>Every clue tells<br />a <em>different story.</em></h1><p>Build a mystery from a single idea. Follow the evidence. Decide who did it.</p><div className="hero-meta"><span>01 <b>CREATE</b></span><i /><span>02 <b>INVESTIGATE</b></span><i /><span>03 <b>DEDUCE</b></span></div></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><div className="file-stamp">C<br/><small>— 014 —</small></div><div className="art-cross">✳</div><div className="art-caption">ARCHIVE / NIGHT SHIFT<br />EVIDENCE NEVER SLEEPS</div></div></section>
    <section className="create-layout"><form className="create-card" onSubmit={createCase}>
      <div className="section-heading"><div><Eyebrow>01 / OPEN A NEW FILE</Eyebrow><h2>Set the scene.</h2></div><span className="required-note">* REQUIRED</span></div>
      <label className="field-label" htmlFor="premise">Your premise <span>*</span></label>
      <textarea id="premise" value={premise} maxLength={2000} onChange={(event) => setPremise(event.target.value)} placeholder="A priceless diamond disappears from a locked museum room during a private exhibition…" aria-describedby="premise-hint premise-count" />
      <div className="field-foot"><span id="premise-hint">A few sentences is all it takes.</span><span id="premise-count" className={trimmedLength > 2000 ? 'count bad' : 'count'}>{premise.length.toLocaleString()} / 2,000</span></div>
      <div className="examples"><span>NEED A SPARK?</span>{examples.map((text, i) => <button type="button" className="example-chip" key={text} onClick={() => { setPremise(text); setExample(i); }}>{example === i && premise === text ? '✓ ' : '+ '}{['Museum heist', 'The quiet lighthouse', 'Last course'][i]}</button>)}</div>
      <div className="form-divider" /><div className="options-heading"><div><span className="field-label">Shape your case</span><span className="optional">OPTIONAL</span></div><span className="options-hint">Make it yours, or keep the defaults.</span></div>
      <div className="option-grid"><OptionSelect label="DIFFICULTY" value={difficulty} onChange={setDifficulty} options={['easy', 'medium', 'hard']} /><OptionSelect label="CASE LENGTH" value={caseLength} onChange={setCaseLength} options={['short', 'standard']} /><OptionSelect label="TONE" value={tone} onChange={setTone} options={['cozy', 'noir', 'thriller', 'lighthearted']} /></div>
      <div className="evidence-select"><div className="evidence-title"><span className="field-label">Evidence in the file</span><span className="optional">OPTIONAL · PICK ANY</span></div><div className="type-options">{evidenceTypes.map((type) => <button type="button" key={type} aria-pressed={selected.includes(type)} onClick={() => toggleEvidence(type)} className={`type-toggle ${selected.includes(type) ? 'active' : ''}`}><span>{icon[type]}</span>{type}</button>)}</div></div>
      {error && <div className="error-box" role="alert">{error}</div>}
      <button className="primary-button create-button" type="submit" disabled={busy}>{busy ? <><span className="spinner" /> BUILDING YOUR CASE FILE…</> : <>CREATE YOUR CASE <span>↗</span></>}</button>
      <p className="form-disclaimer">A work of fiction, created for the curious.</p>
    </form><aside className="side-note"><div className="side-note-head"><span>FIELD NOTE</span><span>NO. 001</span></div><div className="side-quote">“The truth is rarely pure and never simple.”</div><div className="side-by">— THE INVESTIGATOR’S HANDBOOK</div><div className="side-rule"/><div className="side-facts"><div><span>YOUR BRIEF</span><b>One idea. A whole case.</b></div><div><span>THE FILE</span><b>Suspects, evidence & a timeline.</b></div><div><span>THE REVEAL</span><b>Earned after your accusation.</b></div></div><div className="side-footer">KEEP YOUR EYES OPEN <span>◈</span></div></aside></section>
    <footer className="site-footer"><Brand small /><span>MADE FOR THE CURIOUS · ALL CASES ARE FICTIONAL</span><span>© CASEFILE 2025</span></footer>
  </main></>;
}
function OptionSelect({ label, value, onChange, options }) { return <label className="option-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((item) => <option value={item} key={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></label>; }

function CaseRoom() {
  const { caseId } = useParams(); const navigate = useNavigate();
  const [data, setData] = useState(null); const [error, setError] = useState(''); const [filter, setFilter] = useState('all'); const [selectedEvidence, setSelectedEvidence] = useState(null); const [notes, setNotes] = useState(''); const [accusing, setAccusing] = useState(false); const [suspectId, setSuspectId] = useState(''); const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef(null);
  const load = useCallback(async () => api(`/cases/${caseId}`, { caseId }), [caseId]);
  useEffect(() => { let timer; let active = true; let delay = 2000;
    const poll = async () => { try { const result = await load(); if (!active) return; setData(result); if (result.state === 'generating') { timer = setTimeout(poll, delay); delay = Math.min(5000, delay * 1.4); } else if (result.state === 'completed') navigate(`/cases/${caseId}/reveal`, { replace: true }); }
      catch (cause) { if (active) setError(cause.message); } };
    poll(); return () => { active = false; clearTimeout(timer); };
  }, [load, navigate, caseId]);
  useEffect(() => { if (data?.case) setNotes(localStorage.getItem(`notes:${caseId}`) || ''); }, [caseId, data]);
  useEffect(() => {
    if (!selectedEvidence && !accusing) return undefined;
    const modal = modalRef.current;
    const previouslyFocused = document.activeElement;
    const focusable = () => [...modal.querySelectorAll('button:not(:disabled), input:not(:disabled)')];
    focusable()[0]?.focus();
    function handleKeys(event) {
      if (event.key === 'Escape') { setSelectedEvidence(null); setAccusing(false); }
      if (event.key === 'Tab') {
        const items = focusable();
        if (!items.length) return;
        if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
        else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
      }
    }
    document.addEventListener('keydown', handleKeys);
    return () => { document.removeEventListener('keydown', handleKeys); previouslyFocused?.focus?.(); };
  }, [selectedEvidence, accusing]);
  async function submitAccusation() { if (!suspectId || submitting) return; setSubmitting(true); setError(''); try { await api(`/cases/${caseId}/accusation`, { method: 'POST', caseId, body: JSON.stringify({ suspectId }) }); navigate(`/cases/${caseId}/reveal`); } catch (cause) { setError(cause.message); setSubmitting(false); } }
  const currentCase = data?.case;
  const visibleEvidence = useMemo(() => currentCase?.evidence.filter((item) => filter === 'all' || item.type === filter) || [], [currentCase, filter]);
  if (error && !data) return <ErrorPage message={error} />;
  if (data?.state === 'failed') return <><Header /><main className="center-state"><Eyebrow>GENERATION INTERRUPTED</Eyebrow><h1>This file could not be assembled.</h1><p>Try again with a new case premise.</p><Link className="primary-button" to="/">RETURN TO CASEFILE ↗</Link></main></>;
  if (!currentCase) return <><Header /><main className="center-state"><span className="large-spinner"/><Eyebrow>{data?.state === 'generating' ? 'PREPARING YOUR CASE' : 'OPENING CASE FILE'}</Eyebrow><h1>{data?.state === 'generating' ? 'The evidence is coming together.' : 'Locating your file…'}</h1><p>{data?.state === 'generating' ? 'Cross-checking statements, timestamps, and alibis.' : 'The archive is just a moment away.'}</p><div className="loading-line"><span/></div></main></>;
  return <><Header /><main className="case-page"><div className="case-topline"><Link to="/">← ALL CASES</Link><span>CASE FILE / {caseId.slice(-6).toUpperCase()}</span><span className="case-status"><i/> ACTIVE INVESTIGATION</span></div><section className="case-intro"><div><Eyebrow>INVESTIGATION DOSSIER <span className="dossier-id">NO. {caseId.slice(-4).toUpperCase()}</span></Eyebrow><h1>{currentCase.title}</h1><p className="case-summary">{currentCase.summary}</p></div><div className="case-facts"><div><span>LOCATION</span><b>{currentCase.setting}</b></div><div><span>DIFFICULTY</span><b>{currentCase.difficulty}</b></div><div><span>STATUS</span><b>OPEN FILE</b></div></div></section>
    <section className="briefing paper-panel"><div className="panel-label"><span>01</span> CASE BRIEFING</div><p>{currentCase.briefing}</p><span className="paper-mark">◈</span></section>
    <section className="board-section"><SectionTitle number="02" title="Persons of interest" note={`${currentCase.suspects.length} PROFILES`} /><div className="suspect-grid">{currentCase.suspects.map((suspect, index) => <article key={suspect.id} className="suspect-card"><div className="suspect-top"><div className={`avatar avatar-${index}`}>{suspect.name.split(' ').map((part) => part[0]).join('')}</div><span className="suspect-number">SUSPECT 0{index + 1}</span></div><h3>{suspect.name}</h3><span className="suspect-role">{suspect.role}</span><p>{suspect.bio}</p><div className="suspect-clue"><span>MOTIVE TO INVESTIGATE</span>{suspect.publicMotiveHint}</div><div className="suspect-alibi"><span>STATED ALIBI</span>{suspect.alibi}</div></article>)}</div></section>
    <section className="board-section"><SectionTitle number="03" title="Evidence board" note={`${currentCase.evidence.length} ITEMS LOGGED`} /><div className="filter-row" aria-label="Filter evidence"><button className={filter === 'all' ? 'filter active' : 'filter'} onClick={() => setFilter('all')}>ALL <span>{currentCase.evidence.length}</span></button>{evidenceTypes.map((type) => <button key={type} className={filter === type ? 'filter active' : 'filter'} onClick={() => setFilter(type)}>{type.toUpperCase()}</button>)}</div><div className="evidence-grid">{visibleEvidence.map((item, index) => <button className="evidence-card" key={item.id} onClick={() => setSelectedEvidence(item)}><div className="evidence-meta"><span className={`evidence-icon type-${item.type}`}>{icon[item.type]}</span><span>{item.type}</span><span className="evidence-index">E-{String(index + 1).padStart(2, '0')}</span></div><h3>{item.title}</h3><p>{item.summary}</p><div className="evidence-bottom"><span>{item.sourceLabel}</span><span>OPEN FILE ↗</span></div>{item.mediaStatus !== 'generated' && <span className="simulation-tag">{item.mediaStatus === 'prompt_only' ? 'IMAGE DESCRIPTION' : 'SIMULATED RECORD'}</span>}</button>)}</div>{visibleEvidence.length === 0 && <div className="empty-state">No evidence of this type in the file.</div>}</section>
    <section className="lower-grid"><div className="timeline-panel"><SectionTitle number="04" title="Timeline" note="RECONSTRUCTED" /><div className="timeline">{currentCase.timeline.map((event) => <article className="timeline-event" key={event.id}><div className="timeline-time">{event.timeLabel}</div><div className="timeline-dot"/><p>{event.description}{event.linkedEvidenceIds.length > 0 && <span className="linked-evidence">{event.linkedEvidenceIds.length} RELATED {event.linkedEvidenceIds.length === 1 ? 'ITEM' : 'ITEMS'}</span>}</p></article>)}</div></div><div className="notes-panel"><div className="notes-heading"><span>FIELD NOTES</span><span>PRIVATE / LOCAL</span></div><label htmlFor="investigator-notes">Keep track of your theory.</label><textarea id="investigator-notes" value={notes} onChange={(event) => { setNotes(event.target.value); localStorage.setItem(`notes:${caseId}`, event.target.value); }} placeholder="What doesn't add up? Follow the thread…"/><span className="notes-foot">Saved in this browser only.</span></div></section>
    <div className="accusation-bar"><div><span>HAVE YOU FOUND YOUR ANSWER?</span><b>The evidence is in your hands.</b></div><button className="primary-button" onClick={() => setAccusing(true)}>MAKE AN ACCUSATION <span>↗</span></button></div>
    {error && <div className="error-box" role="alert">{error}</div>}
    {selectedEvidence && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedEvidence(null); }}><section ref={modalRef} className="modal evidence-modal" role="dialog" aria-modal="true" aria-labelledby="evidence-title"><button className="close-button" onClick={() => setSelectedEvidence(null)} aria-label="Close evidence details">×</button><Eyebrow>{selectedEvidence.type.toUpperCase()} / EVIDENCE RECORD</Eyebrow><h2 id="evidence-title">{selectedEvidence.title}</h2><p className="modal-summary">{selectedEvidence.summary}</p><div className="detail-meta"><span>SOURCE<b>{selectedEvidence.sourceLabel}</b></span><span>IN-WORLD TIME<b>{selectedEvidence.createdAtInStory || 'Time not recorded'}</b></span><span>MEDIA<b>{selectedEvidence.mediaStatus === 'prompt_only' ? 'Description only' : 'Fictional simulation'}</b></span></div><div className="evidence-content">{selectedEvidence.content}</div>{selectedEvidence.mediaPrompt && <div className="media-prompt"><span>IMAGE DESCRIPTION</span>{selectedEvidence.mediaPrompt}</div>}<div className="linked-people"><span>MENTIONED IN THIS RECORD</span>{currentCase.suspects.filter((suspect) => selectedEvidence.linkedSuspectIds.includes(suspect.id)).map((suspect) => suspect.name).join(' · ') || 'No named suspects'}</div></section></div>}
    {accusing && <div className="overlay"><section ref={modalRef} className="modal accuse-modal" role="dialog" aria-modal="true" aria-labelledby="accuse-title"><button className="close-button" onClick={() => setAccusing(false)} aria-label="Cancel accusation">×</button><Eyebrow>THE FINAL CALL</Eyebrow><h2 id="accuse-title">Who did it?</h2><p className="modal-summary">Choose the person you believe is responsible. Your accusation is final.</p><div className="accuse-list">{currentCase.suspects.map((suspect) => <label key={suspect.id} className={`accuse-option ${suspectId === suspect.id ? 'selected' : ''}`}><input type="radio" name="suspect" value={suspect.id} checked={suspectId === suspect.id} onChange={() => setSuspectId(suspect.id)}/><span className="radio-mark"/><span><b>{suspect.name}</b><small>{suspect.role}</small></span></label>)}</div><div className="modal-actions"><button className="secondary-button" onClick={() => setAccusing(false)}>KEEP INVESTIGATING</button><button className="primary-button" disabled={!suspectId || submitting} onClick={submitAccusation}>{submitting ? 'RECORDING…' : 'CONFIRM ACCUSATION ↗'}</button></div></section></div>}
    <footer className="site-footer"><Brand small /><span>FICTIONAL CASEWORK · HANDLE WITH CURIOSITY</span><span>CASE {caseId.slice(-6).toUpperCase()}</span></footer>
  </main></>;
}
function SectionTitle({ number, title, note }) { return <div className="section-title"><div><span>{number} /</span><h2>{title}</h2></div><span className="section-note">{note}</span></div>; }

function Reveal() {
  const { caseId } = useParams(); const [reveal, setReveal] = useState(null); const [caseData, setCaseData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { let active = true; Promise.all([api(`/cases/${caseId}/reveal`, { caseId }), api(`/cases/${caseId}`, { caseId })]).then(([result, caseResult]) => { if (active) { setReveal(result.reveal); setCaseData(caseResult.case); } }).catch((cause) => { if (active) setError(cause.message); }); return () => { active = false; }; }, [caseId]);
  if (error) return <ErrorPage message={error}/>;
  if (!reveal || !caseData) return <><Header/><main className="center-state"><span className="large-spinner"/><Eyebrow>OPENING THE SEALED FILE</Eyebrow><h1>The final report is being prepared.</h1></main></>;
  const accused = caseData.suspects.find((item) => item.id === reveal.accusedSuspectId); const culprit = caseData.suspects.find((item) => item.id === reveal.culpritSuspectId);
  const evidenceById = Object.fromEntries(caseData.evidence.map((item) => [item.id, item]));
  return <><Header/><main className="reveal-page"><div className="case-topline"><Link to={`/cases/${caseId}`}>← BACK TO CASE</Link><span>FINAL REPORT / {caseId.slice(-6).toUpperCase()}</span><span className="case-status"><i/> CASE CLOSED</span></div><section className={`reveal-hero ${reveal.isCorrect ? 'correct' : 'incorrect'}`}><Eyebrow>INVESTIGATION COMPLETE</Eyebrow><div className="reveal-seal">{reveal.isCorrect ? '✓' : '!'}</div><h1>{reveal.isCorrect ? 'Good instincts, detective.' : 'The evidence had another story.'}</h1><p>{reveal.isCorrect ? 'Your accusation held up against the facts.' : `You accused ${accused?.name || 'a suspect'}, but the evidence points elsewhere.`}</p></section><section className="solution-card paper-panel"><div className="panel-label"><span>FINAL</span> CANONICAL SOLUTION</div><div className="culprit-block"><span>THE CULPRIT</span><h2>{culprit?.name}</h2><p>{culprit?.role}</p></div><p className="solution-summary">{reveal.summary}</p><div className="solution-facts"><div><span>MOTIVE</span><p>{reveal.motive}</p></div><div><span>METHOD</span><p>{reveal.method}</p></div><div><span>OPPORTUNITY</span><p>{reveal.opportunity}</p></div></div></section><section className="board-section"><SectionTitle number="05" title="The evidence chain" note={`${reveal.evidenceChain.length} CONNECTED CLUES`} /><div className="chain-list">{reveal.evidenceChain.map((item, index) => <article className="chain-item" key={item.evidenceId}><span className="chain-number">0{index + 1}</span><div><span className="chain-evidence">{evidenceById[item.evidenceId]?.title || 'Evidence record'} <span>↗</span></span><p>{item.explanation}</p></div></article>)}</div></section>{reveal.redHerringExplanations.length > 0 && <section className="board-section red-herring-section"><SectionTitle number="06" title="The false leads" note="RED HERRINGS, EXPLAINED"/><div className="chain-list">{reveal.redHerringExplanations.map((item) => <article className="chain-item" key={item.evidenceId}><span className="chain-number muted">↗</span><div><span className="chain-evidence">{evidenceById[item.evidenceId]?.title || 'Evidence record'}</span><p>{item.explanation}</p></div></article>)}</div></section>}<div className="reveal-end"><p>Another case is waiting in the archive.</p><Link to="/" className="primary-button">CREATE ANOTHER MYSTERY ↗</Link></div><footer className="site-footer"><Brand small/><span>CASE CLOSED · FICTIONAL CASEWORK</span><span>© CASEFILE 2025</span></footer></main></>;
}
function ErrorPage({ message }) { return <><Header/><main className="center-state"><Eyebrow>FILE UNAVAILABLE</Eyebrow><h1>We couldn’t open this case.</h1><p>{message}</p><Link to="/" className="primary-button">RETURN TO CASEFILE ↗</Link></main></>; }
function App() { return <BrowserRouter><Routes><Route path="/" element={<Home/>}/><Route path="/cases/:caseId" element={<CaseRoom/>}/><Route path="/cases/:caseId/reveal" element={<Reveal/>}/><Route path="*" element={<ErrorPage message="That page is not in the archive."/>}/></Routes></BrowserRouter>; }

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
