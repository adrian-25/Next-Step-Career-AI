import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  FileText, Plus, Trash2, Download, Eye, EyeOff,
  User, Briefcase, GraduationCap, Code2, FolderOpen,
  Award, ChevronDown, ChevronUp,
} from 'lucide-react';
import { getDataset } from '@/ai/ml/rolePredictor';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  year: string;
  grade: string;
}

interface ProjectEntry {
  id: string;
  name: string;
  tech: string;
  description: string;
}

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;
  targetRole: string;
  skills: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  certifications: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ROLES = getDataset().map(e => ({ key: e.role, label: e.display }));

function uid() { return Math.random().toString(36).slice(2, 9); }

const DEFAULT_DATA: ResumeData = {
  name: '', email: '', phone: '', linkedin: '', github: '',
  summary: '', targetRole: 'software_developer', skills: '',
  experience: [{ id: uid(), company: '', role: '', duration: '', description: '' }],
  education:  [{ id: uid(), degree: '', institution: '', year: '', grade: '' }],
  projects:   [{ id: uid(), name: '', tech: '', description: '' }],
  certifications: '',
};

// ── Resume HTML generator ─────────────────────────────────────────────────────

function generateResumeHTML(data: ResumeData): string {
  const skillList = data.skills.split(',').map(s => s.trim()).filter(Boolean);
  const certList  = data.certifications.split('\n').map(s => s.trim()).filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${data.name} — Resume</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1a1a1a; background: white; padding: 32px 40px; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 22pt; font-weight: 700; color: #0A1628; letter-spacing: -0.5px; }
  .contact { font-size: 9.5pt; color: #475569; margin-top: 4px; }
  .contact a { color: #2563EB; text-decoration: none; }
  .divider { border: none; border-top: 2px solid #2563EB; margin: 14px 0 10px; }
  .section-title { font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0A1628; margin-bottom: 8px; }
  .summary { font-size: 10.5pt; color: #334155; line-height: 1.6; margin-bottom: 14px; }
  .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
  .skill-tag { background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; padding: 2px 10px; border-radius: 12px; font-size: 9.5pt; font-weight: 500; }
  .entry { margin-bottom: 12px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-title { font-weight: 700; font-size: 10.5pt; color: #0F172A; }
  .entry-sub { font-size: 10pt; color: #475569; }
  .entry-date { font-size: 9.5pt; color: #64748B; }
  .entry-desc { font-size: 10pt; color: #334155; line-height: 1.55; margin-top: 3px; white-space: pre-line; }
  .cert-list { list-style: none; }
  .cert-list li::before { content: "✓ "; color: #2563EB; font-weight: bold; }
  .cert-list li { font-size: 10pt; color: #334155; margin-bottom: 3px; }
  @media print { body { padding: 20px 28px; } }
</style>
</head>
<body>

<h1>${data.name || 'Your Name'}</h1>
<div class="contact">
  ${data.email ? `<a href="mailto:${data.email}">${data.email}</a>` : ''}
  ${data.phone ? ` &nbsp;|&nbsp; ${data.phone}` : ''}
  ${data.linkedin ? ` &nbsp;|&nbsp; <a href="${data.linkedin}">LinkedIn</a>` : ''}
  ${data.github ? ` &nbsp;|&nbsp; <a href="${data.github}">GitHub</a>` : ''}
</div>

${data.summary ? `
<hr class="divider">
<div class="section-title">Professional Summary</div>
<div class="summary">${data.summary}</div>
` : ''}

${skillList.length > 0 ? `
<hr class="divider">
<div class="section-title">Technical Skills</div>
<div class="skills-grid">
  ${skillList.map(s => `<span class="skill-tag">${s}</span>`).join('')}
</div>
` : ''}

${data.experience.some(e => e.company || e.role) ? `
<hr class="divider">
<div class="section-title">Experience</div>
${data.experience.filter(e => e.company || e.role).map(e => `
<div class="entry">
  <div class="entry-header">
    <div>
      <span class="entry-title">${e.role || 'Role'}</span>
      ${e.company ? ` &nbsp;—&nbsp; <span class="entry-sub">${e.company}</span>` : ''}
    </div>
    ${e.duration ? `<span class="entry-date">${e.duration}</span>` : ''}
  </div>
  ${e.description ? `<div class="entry-desc">${e.description}</div>` : ''}
</div>`).join('')}
` : ''}

${data.projects.some(p => p.name) ? `
<hr class="divider">
<div class="section-title">Projects</div>
${data.projects.filter(p => p.name).map(p => `
<div class="entry">
  <div class="entry-header">
    <span class="entry-title">${p.name}</span>
    ${p.tech ? `<span class="entry-date">${p.tech}</span>` : ''}
  </div>
  ${p.description ? `<div class="entry-desc">${p.description}</div>` : ''}
</div>`).join('')}
` : ''}

${data.education.some(e => e.degree || e.institution) ? `
<hr class="divider">
<div class="section-title">Education</div>
${data.education.filter(e => e.degree || e.institution).map(e => `
<div class="entry">
  <div class="entry-header">
    <div>
      <span class="entry-title">${e.degree || 'Degree'}</span>
      ${e.institution ? ` &nbsp;—&nbsp; <span class="entry-sub">${e.institution}</span>` : ''}
    </div>
    <span class="entry-date">${[e.year, e.grade].filter(Boolean).join(' · ')}</span>
  </div>
</div>`).join('')}
` : ''}

${certList.length > 0 ? `
<hr class="divider">
<div class="section-title">Certifications</div>
<ul class="cert-list">
  ${certList.map(c => `<li>${c}</li>`).join('')}
</ul>
` : ''}

</body>
</html>`;
}

// ── Section components ────────────────────────────────────────────────────────

function SectionHeader({ title, icon: Icon, color, open, onToggle }: {
  title: string; icon: React.ElementType; color: string;
  open: boolean; onToggle: () => void;
}) {
  return (
    <button
      className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors hover:bg-muted/30"
      onClick={onToggle}
      aria-expanded={open}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}>
        <Icon className="h-4 w-4" style={{ color }} aria-hidden="true" />
      </div>
      <span className="font-display font-semibold text-sm flex-1">{title}</span>
      {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function ResumeBuilderPage() {
  const [data, setData]         = useState<ResumeData>(DEFAULT_DATA);
  const [preview, setPreview]   = useState(false);
  const [sections, setSections] = useState({
    contact: true, summary: true, skills: true,
    experience: true, projects: false, education: true, certs: false,
  });

  const toggle = (s: keyof typeof sections) =>
    setSections(prev => ({ ...prev, [s]: !prev[s] }));

  const set = (field: keyof ResumeData, value: any) =>
    setData(prev => ({ ...prev, [field]: value }));

  // Experience helpers
  const addExp = () => set('experience', [...data.experience, { id: uid(), company: '', role: '', duration: '', description: '' }]);
  const delExp = (id: string) => set('experience', data.experience.filter(e => e.id !== id));
  const setExp = (id: string, field: keyof ExperienceEntry, value: string) =>
    set('experience', data.experience.map(e => e.id === id ? { ...e, [field]: value } : e));

  // Education helpers
  const addEdu = () => set('education', [...data.education, { id: uid(), degree: '', institution: '', year: '', grade: '' }]);
  const delEdu = (id: string) => set('education', data.education.filter(e => e.id !== id));
  const setEdu = (id: string, field: keyof EducationEntry, value: string) =>
    set('education', data.education.map(e => e.id === id ? { ...e, [field]: value } : e));

  // Project helpers
  const addProj = () => set('projects', [...data.projects, { id: uid(), name: '', tech: '', description: '' }]);
  const delProj = (id: string) => set('projects', data.projects.filter(p => p.id !== id));
  const setProj = (id: string, field: keyof ProjectEntry, value: string) =>
    set('projects', data.projects.map(p => p.id === id ? { ...p, [field]: value } : p));

  const handleDownload = () => {
    const html = generateResumeHTML(data);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${data.name || 'resume'}-${data.targetRole}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const html = generateResumeHTML(data);
    const win  = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  return (
    <div className="page-content max-w-[1280px] space-y-0">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563EB, #0EA5E9)' }}>
            <FileText className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">Resume Builder</h1>
            <p className="text-sm text-muted-foreground">Build an ATS-friendly resume — export as HTML or print as PDF</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" aria-hidden="true" /> Print / PDF
          </Button>
          <Button size="sm" onClick={handleDownload} className="gradient-bg text-white gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download HTML
          </Button>
        </div>
      </div>

      {/* Full desktop two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        alignItems: 'start',
      }}>

        {/* ── Left: Form (scrollable) ── */}
        <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>

          {/* Target Role */}
          <div className="ent-card p-4">
            <p className="section-label mb-2">Target Role</p>
            <select
              value={data.targetRole}
              onChange={e => set('targetRole', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
              aria-label="Target role"
            >
              {ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
          </div>

          {/* Contact */}
          <div className="ent-card overflow-hidden">
            <SectionHeader title="Contact Information" icon={User} color="#2563EB" open={sections.contact} onToggle={() => toggle('contact')} />
            {sections.contact && (
              <div className="px-4 pb-4 space-y-2">
                <Input placeholder="Full Name *" value={data.name} onChange={e => set('name', e.target.value)} aria-label="Full name" />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Email *" value={data.email} onChange={e => set('email', e.target.value)} aria-label="Email" />
                  <Input placeholder="Phone" value={data.phone} onChange={e => set('phone', e.target.value)} aria-label="Phone" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="LinkedIn URL" value={data.linkedin} onChange={e => set('linkedin', e.target.value)} aria-label="LinkedIn" />
                  <Input placeholder="GitHub URL" value={data.github} onChange={e => set('github', e.target.value)} aria-label="GitHub" />
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="ent-card overflow-hidden">
            <SectionHeader title="Professional Summary" icon={FileText} color="#8B5CF6" open={sections.summary} onToggle={() => toggle('summary')} />
            {sections.summary && (
              <div className="px-4 pb-4">
                <Textarea
                  placeholder="2–3 sentences about your experience, skills, and career goals..."
                  className="min-h-[80px] text-sm resize-none"
                  value={data.summary}
                  onChange={e => set('summary', e.target.value)}
                  aria-label="Professional summary"
                />
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="ent-card overflow-hidden">
            <SectionHeader title="Technical Skills" icon={Code2} color="#10B981" open={sections.skills} onToggle={() => toggle('skills')} />
            {sections.skills && (
              <div className="px-4 pb-4">
                <Textarea
                  placeholder="Python, React, Node.js, PostgreSQL, Docker, AWS, Machine Learning..."
                  className="min-h-[60px] text-sm resize-none font-code"
                  value={data.skills}
                  onChange={e => set('skills', e.target.value)}
                  aria-label="Skills (comma-separated)"
                />
                <p className="text-xs text-muted-foreground mt-1">Comma-separated list</p>
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="ent-card overflow-hidden">
            <SectionHeader title="Experience" icon={Briefcase} color="#F59E0B" open={sections.experience} onToggle={() => toggle('experience')} />
            {sections.experience && (
              <div className="px-4 pb-4 space-y-4">
                {data.experience.map((exp, i) => (
                  <div key={exp.id} className="space-y-2 pt-2 border-t first:border-0 first:pt-0"
                    style={{ borderColor: 'hsl(var(--border))' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">Entry {i + 1}</span>
                      {data.experience.length > 1 && (
                        <button onClick={() => delExp(exp.id)} aria-label="Remove experience">
                          <Trash2 className="h-3.5 w-3.5 text-red-400 hover:text-red-600" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Job Title *" value={exp.role} onChange={e => setExp(exp.id, 'role', e.target.value)} aria-label="Job title" />
                      <Input placeholder="Company *" value={exp.company} onChange={e => setExp(exp.id, 'company', e.target.value)} aria-label="Company" />
                    </div>
                    <Input placeholder="Duration (e.g. Jan 2023 – Present)" value={exp.duration} onChange={e => setExp(exp.id, 'duration', e.target.value)} aria-label="Duration" />
                    <Textarea
                      placeholder="• Developed X using Y, resulting in Z&#10;• Led team of N engineers to deliver..."
                      className="min-h-[80px] text-sm resize-none"
                      value={exp.description}
                      onChange={e => setExp(exp.id, 'description', e.target.value)}
                      aria-label="Job description"
                    />
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addExp} className="w-full gap-1.5 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Add Experience
                </Button>
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="ent-card overflow-hidden">
            <SectionHeader title="Projects" icon={FolderOpen} color="#0EA5E9" open={sections.projects} onToggle={() => toggle('projects')} />
            {sections.projects && (
              <div className="px-4 pb-4 space-y-4">
                {data.projects.map((proj, i) => (
                  <div key={proj.id} className="space-y-2 pt-2 border-t first:border-0 first:pt-0"
                    style={{ borderColor: 'hsl(var(--border))' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">Project {i + 1}</span>
                      {data.projects.length > 1 && (
                        <button onClick={() => delProj(proj.id)} aria-label="Remove project">
                          <Trash2 className="h-3.5 w-3.5 text-red-400 hover:text-red-600" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Project Name *" value={proj.name} onChange={e => setProj(proj.id, 'name', e.target.value)} aria-label="Project name" />
                      <Input placeholder="Tech Stack (React, Node.js...)" value={proj.tech} onChange={e => setProj(proj.id, 'tech', e.target.value)} aria-label="Tech stack" />
                    </div>
                    <Textarea
                      placeholder="Brief description of what you built and its impact..."
                      className="min-h-[60px] text-sm resize-none"
                      value={proj.description}
                      onChange={e => setProj(proj.id, 'description', e.target.value)}
                      aria-label="Project description"
                    />
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addProj} className="w-full gap-1.5 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Add Project
                </Button>
              </div>
            )}
          </div>

          {/* Education */}
          <div className="ent-card overflow-hidden">
            <SectionHeader title="Education" icon={GraduationCap} color="#6366F1" open={sections.education} onToggle={() => toggle('education')} />
            {sections.education && (
              <div className="px-4 pb-4 space-y-4">
                {data.education.map((edu, i) => (
                  <div key={edu.id} className="space-y-2 pt-2 border-t first:border-0 first:pt-0"
                    style={{ borderColor: 'hsl(var(--border))' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">Entry {i + 1}</span>
                      {data.education.length > 1 && (
                        <button onClick={() => delEdu(edu.id)} aria-label="Remove education">
                          <Trash2 className="h-3.5 w-3.5 text-red-400 hover:text-red-600" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Degree / Course *" value={edu.degree} onChange={e => setEdu(edu.id, 'degree', e.target.value)} aria-label="Degree" />
                      <Input placeholder="Institution *" value={edu.institution} onChange={e => setEdu(edu.id, 'institution', e.target.value)} aria-label="Institution" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Year (e.g. 2020–2024)" value={edu.year} onChange={e => setEdu(edu.id, 'year', e.target.value)} aria-label="Year" />
                      <Input placeholder="Grade / CGPA" value={edu.grade} onChange={e => setEdu(edu.id, 'grade', e.target.value)} aria-label="Grade" />
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addEdu} className="w-full gap-1.5 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Add Education
                </Button>
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="ent-card overflow-hidden">
            <SectionHeader title="Certifications" icon={Award} color="#EC4899" open={sections.certs} onToggle={() => toggle('certs')} />
            {sections.certs && (
              <div className="px-4 pb-4">
                <Textarea
                  placeholder="AWS Solutions Architect&#10;Google Cloud Professional&#10;Certified Kubernetes Administrator"
                  className="min-h-[80px] text-sm resize-none"
                  value={data.certifications}
                  onChange={e => set('certifications', e.target.value)}
                  aria-label="Certifications (one per line)"
                />
                <p className="text-xs text-muted-foreground mt-1">One per line</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Preview (sticky) ── */}
        <div style={{ position: 'sticky', top: '1rem', maxHeight: 'calc(100vh - 140px)', overflow: 'hidden' }}>
          <div className="ent-card overflow-hidden h-full">
            <div className="px-4 py-3 border-b flex items-center justify-between"
              style={{ borderColor: 'hsl(var(--border))' }}>
              <p className="section-label">Live Preview</p>
              <Badge className="text-xs badge-info">ATS-Friendly Format</Badge>
            </div>
            <div
              className="overflow-auto"
              style={{ height: 'calc(100vh - 200px)', background: 'white' }}
              dangerouslySetInnerHTML={{ __html: generateResumeHTML(data) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
