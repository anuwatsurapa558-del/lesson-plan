import React, { useState, useEffect, useRef } from 'react';

const SUBJECTS = [
  'ภาษาไทย',
  'คณิตศาสตร์',
  'วิทยาศาสตร์และเทคโนโลยี',
  'สังคมศึกษา ศาสนา และวัฒนธรรม',
  'สุขศึกษาและพลศึกษา',
  'ศิลปะ',
  'การงานอาชีพ',
  'ภาษาต่างประเทศ (อังกฤษ)'
];

const GRADES = [
  'อนุบาล 1', 'อนุบาล 2', 'อนุบาล 3',
  'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6',
  'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'
];

const PRESETS = {
  active: {
    label: 'Active Learning',
    approach: 'Active Learning เน้นให้ผู้เรียนมีส่วนร่วมผ่านกิจกรรมกลุ่มและการอภิปราย',
    assessment: 'สังเกตการมีส่วนร่วม + ประเมินชิ้นงาน + แบบทดสอบท้ายคาบ'
  },
  stem: {
    label: 'STEM/STEAM',
    approach: 'STEM Education บูรณาการวิทย์-เทคโน-วิศวะ-คณิต ผ่านการแก้ปัญหาจริง',
    assessment: 'ประเมินกระบวนการออกแบบและชิ้นงาน + Rubric ทักษะ STEM'
  },
  pbl: {
    label: 'Project-Based',
    approach: 'Project-Based Learning ให้ผู้เรียนสร้างชิ้นงานเพื่อแสดงความเข้าใจ',
    assessment: 'ประเมินโครงงาน + การนำเสนอ + การประเมินตนเองและเพื่อน'
  },
  inquiry: {
    label: '5E Learning Cycle',
    approach: '5E Learning Cycle: Engage-Explore-Explain-Elaborate-Evaluate',
    assessment: 'แบบสังเกต + ใบงานสำรวจ + แบบทดสอบก่อน-หลังเรียน'
  },
  traditional: {
    label: 'บรรยาย + อภิปราย',
    approach: 'บรรยายเนื้อหาสำคัญ ผสมการอภิปรายและตัวอย่างประกอบ',
    assessment: 'แบบทดสอบก่อน-หลังเรียน + ใบงาน + การซักถาม'
  }
};

// Design tokens
const C = {
  bg: '#FAF7F0',
  card: '#FFFFFF',
  border: '#E5DDC8',
  borderStrong: '#D4C8AA',
  ink: '#1A1D24',
  muted: '#6B6357',
  teal: '#1E4A5F',
  tealLight: '#2F6E82',
  gold: '#B8891E',
  cream: '#F5EDD8'
};

export default function App() {
  const [preset, setPreset] = useState('active');
  const [form, setForm] = useState({
    grade: 'ป.4',
    subject: 'วิทยาศาสตร์และเทคโนโลยี',
    topic: '',
    duration: 60,
    periods: 1,
    approach: PRESETS.active.approach,
    assessment: PRESETS.active.assessment,
    notes: ''
  });

  const [plan, setPlan] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch (e) { } };
  }, []);

  const applyPreset = (key) => {
    setPreset(key);
    setForm(f => ({ ...f, approach: PRESETS[key].approach, assessment: PRESETS[key].assessment }));
  };

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleGenerate = async () => {
    if (!form.topic.trim()) {
      setError('กรุณากรอกหัวเรื่องที่ต้องการสอน');
      return;
    }
    setError('');
    setIsGenerating(true);
    setPlan('');

    const prompt = `คุณเป็นผู้เชี่ยวชาญด้านการเขียนแผนการจัดการเรียนรู้ตามหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน พ.ศ. 2551 (ฉบับปรับปรุง พ.ศ. 2560)

กรุณาสร้างแผนการจัดการเรียนรู้ที่มีคุณภาพและใช้ได้จริง ตามข้อมูลต่อไปนี้:

• ระดับชั้น: ${form.grade}
• กลุ่มสาระการเรียนรู้: ${form.subject}
• หน่วยการเรียนรู้/หัวเรื่อง: ${form.topic}
• ระยะเวลาต่อคาบ: ${form.duration} นาที
• จำนวนคาบเรียน: ${form.periods} คาบ
• แนวการจัดการเรียนรู้: ${form.approach}
• รูปแบบการวัดและประเมินผล: ${form.assessment}
${form.notes.trim() ? `• หมายเหตุเพิ่มเติมจากครู: ${form.notes}` : ''}

ให้เขียนแผนโดยแบ่งเป็น 10 หัวข้อ แต่ละหัวข้อขึ้นต้นด้วย ## (ห้ามเปลี่ยนชื่อหัวข้อ):

## มาตรฐานการเรียนรู้และตัวชี้วัด
## สาระสำคัญ
## จุดประสงค์การเรียนรู้
## สาระการเรียนรู้
## สมรรถนะสำคัญของผู้เรียน
## คุณลักษณะอันพึงประสงค์
## กิจกรรมการเรียนรู้
## สื่อและแหล่งการเรียนรู้
## การวัดและประเมินผล
## บันทึกหลังสอน

ข้อกำหนดในการเขียน:
- ระบุมาตรฐานและตัวชี้วัดที่ตรงกับหลักสูตรจริง (เช่น ว 1.1 ป.4/1, ค 1.1 ม.2/3)
- จุดประสงค์แยกเป็น K (ความรู้), P (ทักษะ/กระบวนการ), A (คุณลักษณะ) ให้ชัดเจน
- กิจกรรมแบ่งเป็น "ขั้นนำ" "ขั้นสอน/ปฏิบัติ" "ขั้นสรุป" ระบุเวลาที่ใช้แต่ละขั้น (นาที)
- ระบุสื่อการสอนและแหล่งเรียนรู้ที่หาได้จริงในโรงเรียนไทย
- ระบุวิธีวัด เครื่องมือวัด และเกณฑ์ผ่านให้ครบทุกจุดประสงค์
- ส่วน "บันทึกหลังสอน" ให้เว้นเป็นหัวข้อย่อยให้ครูกรอก เช่น "ผลการจัดการเรียนรู้:" "ปัญหา/อุปสรรค:" "แนวทางแก้ไข:"
- ใช้ **ตัวหนา** เน้นคำสำคัญเช่นชื่อจุดประสงค์ ชื่อขั้น
- ให้เนื้อหาละเอียด นำไปใช้ได้ทันที เหมาะสมกับพัฒนาการของผู้เรียนในระดับชั้นนี้

เขียนเป็นภาษาไทยทั้งหมด ไม่ต้องมีคำนำหรือคำท้าย เริ่มที่ ## แรกเลย`;

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 8000,
            temperature: 0.7
          }
        })
      });

      if (!response.ok || !response.body) throw new Error('API error');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const t = line.trim();
          if (t.startsWith('data: ')) {
            const data = t.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                fullText += text;
                setPlan(fullText);
              }
            } catch (e) { }
          }
        }
      }

      setHistory(h => [{
        id: Date.now(),
        topic: form.topic,
        subject: form.subject,
        grade: form.grade,
        plan: fullText,
        form: { ...form },
        timestamp: new Date().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })
      }, ...h].slice(0, 8));

    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการสร้างแผน กรุณาลองอีกครั้ง');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { }
  };

  const handlePrint = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const sections = plan.split(/^## /gm).filter(Boolean);
    const escapeHtml = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const renderBody = (body) => {
      return escapeHtml(body).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    };
    const sectionsHtml = sections.map((s, i) => {
      const idx = s.indexOf('\n');
      const title = idx > -1 ? s.slice(0, idx).trim() : s.trim();
      const body = idx > -1 ? s.slice(idx + 1).trim() : '';
      return `<section>
        <h2><span class="n">${String(i + 1).padStart(2, '0')}</span>${escapeHtml(title)}</h2>
        <div class="body">${renderBody(body)}</div>
      </section>`;
    }).join('');
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(form.topic)}</title>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&family=Kanit:wght@500;700&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
      <style>
        @page { margin: 20mm; }
        body { font-family: Sarabun, sans-serif; max-width: 780px; margin: 24px auto; padding: 16px; line-height: 1.75; color: #1A1D24; font-size: 15px; }
        h1 { font-family: Kanit; font-size: 26px; border-bottom: 2px solid #1E4A5F; padding-bottom: 10px; margin-bottom: 6px; }
        .meta { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #6B6357; margin-bottom: 32px; }
        section { margin-top: 24px; page-break-inside: avoid; }
        h2 { font-family: Kanit; font-size: 18px; color: #1A1D24; display: flex; align-items: baseline; gap: 12px; margin-bottom: 8px; }
        h2 .n { font-family: 'IBM Plex Mono', monospace; font-size: 11px; background: #1E4A5F; color: #F5EDD8; padding: 3px 8px; border-radius: 3px; letter-spacing: 0.05em; }
        .body { padding-left: 40px; }
        strong { color: #1E4A5F; }
      </style>
      </head><body>
      <h1>แผนการจัดการเรียนรู้: ${escapeHtml(form.topic)}</h1>
      <div class="meta">${escapeHtml(form.grade)} · ${escapeHtml(form.subject)} · ${form.duration} นาที × ${form.periods} คาบ</div>
      ${sectionsHtml}
      </body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 600);
  };

  const loadFromHistory = (item) => {
    setForm(item.form);
    setPlan(item.plan);
    setPreset('active');
    setTimeout(() => previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const formatInline = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: C.teal, fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  const renderSections = () => {
    if (!plan) return null;
    const sections = plan.split(/^## /gm).filter(Boolean);
    return sections.map((section, i) => {
      const idx = section.indexOf('\n');
      const title = (idx > -1 ? section.slice(0, idx) : section).trim();
      const body = (idx > -1 ? section.slice(idx + 1) : '').trim();

      return (
        <div key={i} className="mb-7">
          <div className="flex items-baseline gap-3 mb-3">
            <span style={{
              background: C.teal,
              color: C.cream,
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 11,
              fontWeight: 500,
              padding: '3px 8px',
              borderRadius: 3,
              letterSpacing: '0.05em',
              lineHeight: 1
            }}>{String(i + 1).padStart(2, '0')}</span>
            <h3 style={{
              fontFamily: 'Kanit, sans-serif',
              fontSize: 17,
              fontWeight: 600,
              color: C.ink,
              lineHeight: 1.3,
              flex: 1
            }}>{title}</h3>
          </div>
          <div style={{
            paddingLeft: 40,
            fontFamily: 'Sarabun, sans-serif',
            fontSize: 15,
            lineHeight: 1.8,
            color: '#2A2620',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {formatInline(body)}
          </div>
        </div>
      );
    });
  };

  const inputBase = {
    width: '100%',
    padding: '10px 12px',
    fontSize: 15,
    fontFamily: 'Sarabun, sans-serif',
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 4,
    color: C.ink,
    outline: 'none',
    transition: 'border-color 0.15s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: 10,
    fontFamily: 'IBM Plex Mono, monospace',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: C.muted,
    marginBottom: 6
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'Sarabun, sans-serif', color: C.ink }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: C.teal, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontFamily: 'Kanit, sans-serif', color: C.cream, fontSize: 20, fontWeight: 700, lineHeight: 1 }}>ส</span>
              <div style={{ position: 'absolute', bottom: -3, right: -3, width: 10, height: 10, background: C.gold, borderRadius: 2 }} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Kanit, sans-serif', fontSize: 20, fontWeight: 600, lineHeight: 1.15, margin: 0 }}>สร้างแผนการสอน</h1>
              <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.12em', color: C.muted, textTransform: 'uppercase', margin: '3px 0 0' }}>Lesson Plan Studio</p>
            </div>
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10.5, color: C.muted, letterSpacing: '0.06em' }}>
            หลักสูตรแกนกลาง · 2551 · ฉบับปรับปรุง 2560
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>

        {/* CONFIG PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 20 }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.15em', color: C.gold, textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>
              — แนวการสอน (Preset)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Object.entries(PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  style={{
                    padding: '7px 12px',
                    fontSize: 13,
                    fontFamily: 'Sarabun, sans-serif',
                    fontWeight: preset === key ? 600 : 400,
                    background: preset === key ? C.teal : 'transparent',
                    color: preset === key ? C.cream : C.ink,
                    border: `1px solid ${preset === key ? C.teal : C.border}`,
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>ระดับชั้น</label>
                <select value={form.grade} onChange={e => upd('grade', e.target.value)} style={{ ...inputBase, padding: '10px 8px' }}>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>กลุ่มสาระ</label>
                <select value={form.subject} onChange={e => upd('subject', e.target.value)} style={{ ...inputBase, padding: '10px 8px' }}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>หน่วย / หัวเรื่อง</label>
              <input
                type="text"
                value={form.topic}
                onChange={e => upd('topic', e.target.value)}
                placeholder="เช่น แรงและการเคลื่อนที่, การอ่านจับใจความ, พหุนาม"
                style={inputBase}
                onFocus={e => e.target.style.borderColor = C.teal}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>เวลา / คาบ (นาที)</label>
                <input type="number" min="20" max="180" value={form.duration} onChange={e => upd('duration', +e.target.value)} style={inputBase} />
              </div>
              <div>
                <label style={labelStyle}>จำนวนคาบ</label>
                <input type="number" min="1" max="20" value={form.periods} onChange={e => upd('periods', +e.target.value)} style={inputBase} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>วิธีจัดการเรียนรู้</label>
              <textarea
                value={form.approach}
                onChange={e => upd('approach', e.target.value)}
                rows={2}
                style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            <div>
              <label style={labelStyle}>การวัดและประเมินผล</label>
              <textarea
                value={form.assessment}
                onChange={e => upd('assessment', e.target.value)}
                rows={2}
                style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            <div>
              <label style={labelStyle}>หมายเหตุเพิ่มเติม (ไม่บังคับ)</label>
              <textarea
                value={form.notes}
                onChange={e => upd('notes', e.target.value)}
                rows={2}
                placeholder="เช่น มีผู้เรียนพิเศษ, มีสื่อ IT พร้อม, ห้อง lab จำกัด"
                style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            {error && (
              <div style={{ padding: '10px 12px', background: '#FCEBE6', color: '#8B2E1E', fontSize: 13, borderRadius: 3, borderLeft: `3px solid #B54D2E` }}>
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{
                padding: '14px 20px',
                fontSize: 15,
                fontFamily: 'Kanit, sans-serif',
                fontWeight: 600,
                background: isGenerating ? C.muted : C.teal,
                color: C.cream,
                border: 'none',
                borderRadius: 4,
                cursor: isGenerating ? 'wait' : 'pointer',
                letterSpacing: '0.02em',
                transition: 'background 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
              onMouseEnter={e => { if (!isGenerating) e.currentTarget.style.background = '#153B4C'; }}
              onMouseLeave={e => { if (!isGenerating) e.currentTarget.style.background = C.teal; }}
            >
              {isGenerating ? (
                <>
                  <span style={{ width: 14, height: 14, border: `2px solid ${C.cream}`, borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  กำลังสร้างแผน...
                </>
              ) : (
                plan ? 'สร้างใหม่' : 'สร้างแผนการสอน'
              )}
            </button>
          </div>
        </div>

        {/* PREVIEW PANEL */}
        <div ref={previewRef} style={{ minWidth: 0, gridColumn: 'span 1', minHeight: 500 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 28, minHeight: 500, position: 'relative' }}>

            {/* Plan header when we have a plan */}
            {(plan || isGenerating) && (
              <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.15em', color: C.gold, textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>
                  — แผนการจัดการเรียนรู้
                </div>
                <h2 style={{ fontFamily: 'Kanit, sans-serif', fontSize: 26, fontWeight: 600, color: C.ink, margin: 0, lineHeight: 1.25 }}>
                  {form.topic || '(ยังไม่ระบุหัวเรื่อง)'}
                </h2>
                <div style={{ marginTop: 10, fontSize: 13, color: C.muted, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span><strong style={{ color: C.ink, fontWeight: 600 }}>{form.grade}</strong></span>
                  <span style={{ color: C.borderStrong }}>·</span>
                  <span>{form.subject}</span>
                  <span style={{ color: C.borderStrong }}>·</span>
                  <span>{form.duration} นาที × {form.periods} คาบ</span>
                </div>

                {plan && !isGenerating && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                    <button onClick={handleCopy} style={actionBtnStyle}>
                      {copied ? '✓ คัดลอกแล้ว' : 'คัดลอกข้อความ'}
                    </button>
                    <button onClick={handlePrint} style={actionBtnStyle}>
                      พิมพ์ / บันทึกเป็น PDF
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {!plan && !isGenerating && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center', padding: 20 }}>
                <div style={{ width: 80, height: 100, border: `2px solid ${C.borderStrong}`, borderRadius: 4, position: 'relative', marginBottom: 24, background: 'linear-gradient(to bottom, #FFF 0%, #FFF 100%)' }}>
                  <div style={{ position: 'absolute', left: 12, top: 12, right: 12, height: 1, background: C.border }} />
                  <div style={{ position: 'absolute', left: 12, top: 22, right: 20, height: 1, background: C.border }} />
                  <div style={{ position: 'absolute', left: 12, top: 32, right: 30, height: 1, background: C.border }} />
                  <div style={{ position: 'absolute', left: 12, top: 46, right: 12, height: 1, background: C.border }} />
                  <div style={{ position: 'absolute', left: 12, top: 56, right: 24, height: 1, background: C.border }} />
                  <div style={{ position: 'absolute', left: 12, top: 66, right: 18, height: 1, background: C.border }} />
                  <div style={{ position: 'absolute', top: -6, right: -6, background: C.gold, color: C.card, fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', padding: '2px 6px', borderRadius: 2, fontWeight: 600 }}>NEW</div>
                </div>
                <h3 style={{ fontFamily: 'Kanit, sans-serif', fontSize: 20, fontWeight: 600, color: C.ink, margin: '0 0 8px' }}>
                  พร้อมสร้างแผนแรกของคุณ
                </h3>
                <p style={{ fontSize: 14, color: C.muted, maxWidth: 320, lineHeight: 1.65, margin: 0 }}>
                  กรอกหัวเรื่องและปรับตัวเลือกด้านซ้าย ระบบจะสร้างแผน 10 หัวข้อครบตามหลักสูตรแกนกลาง พร้อมใช้งานทันที
                </p>
              </div>
            )}

            {/* Sections */}
            <div>
              {renderSections()}
              {isGenerating && plan && (
                <span style={{ display: 'inline-block', width: 8, height: 16, background: C.teal, verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
              )}
            </div>

            {/* Loading state (no partial content yet) */}
            {isGenerating && !plan && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12 }}>
                <div style={{ width: 32, height: 32, border: `3px solid ${C.border}`, borderTopColor: C.teal, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <div style={{ fontSize: 14, color: C.muted, fontFamily: 'Sarabun, sans-serif' }}>กำลังร่างแผนการสอน...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <section style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Kanit, sans-serif', fontSize: 18, fontWeight: 600, color: C.ink, margin: 0 }}>แผนที่สร้างล่าสุด</h2>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: C.muted, letterSpacing: '0.06em' }}>
              {history.length} รายการ
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => loadFromHistory(item)}
                style={{
                  textAlign: 'left',
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  padding: 14,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'Sarabun, sans-serif'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.08em', color: C.gold, textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>
                  {item.grade}
                </div>
                <div style={{ fontFamily: 'Kanit, sans-serif', fontSize: 15, fontWeight: 500, color: C.ink, marginBottom: 6, lineHeight: 1.3 }}>
                  {item.topic}
                </div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
                  {item.subject}
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: C.muted, marginTop: 8, letterSpacing: '0.03em' }}>
                  {item.timestamp}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <footer style={{ borderTop: `1px solid ${C.border}`, marginTop: 24 }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '20px 24px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 10.5, letterSpacing: '0.05em', color: C.muted, textAlign: 'center' }}>
          แผนที่สร้างเป็นเพียงร่างต้นแบบ · ครูควรตรวจสอบและปรับให้เหมาะกับบริบทของโรงเรียนและผู้เรียน
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 50% { opacity: 0; } }
        select:focus, input:focus, textarea:focus { border-color: ${C.teal} !important; }
        button:focus-visible { outline: 2px solid ${C.gold}; outline-offset: 2px; }
      `}</style>
    </div>
  );
}

const actionBtnStyle = {
  padding: '7px 12px',
  fontSize: 12.5,
  fontFamily: 'Sarabun, sans-serif',
  fontWeight: 500,
  background: 'transparent',
  color: '#1E4A5F',
  border: `1px solid #1E4A5F`,
  borderRadius: 3,
  cursor: 'pointer',
  transition: 'all 0.15s'
};
