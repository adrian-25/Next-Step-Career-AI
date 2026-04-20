/**
 * Resume Export Service
 * Generates a downloadable HTML analysis report from the last ML analysis.
 * No external dependencies — pure browser HTML/CSS.
 */

import { MLAnalysisResult } from './mlAnalysis.service';

function scoreColor(s: number): string {
  if (s >= 80) return '#16a34a';
  if (s >= 60) return '#2563eb';
  if (s >= 40) return '#d97706';
  return '#dc2626';
}

function scoreLabel(s: number): string {
  if (s >= 80) return 'Excellent';
  if (s >= 60) return 'Good';
  if (s >= 40) return 'Fair';
  return 'Needs Work';
}

function badge(text: string, bg: string, color: string): string {
  return `<span style="background:${bg};color:${color};padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;margin:2px;display:inline-block">${text}</span>`;
}

function skillBadge(skill: string, type: 'matched' | 'missing' | 'partial'): string {
  const styles = {
    matched: { bg: '#dcfce7', color: '#15803d' },
    missing: { bg: '#fee2e2', color: '#b91c1c' },
    partial: { bg: '#fef3c7', color: '#92400e' },
  };
  const s = styles[type];
  return badge(skill, s.bg, s.color);
}

function progressBar(value: number, color: string): string {
  return `
    <div style="background:#e5e7eb;border-radius:4px;height:8px;margin:4px 0;overflow:hidden">
      <div style="background:${color};width:${Math.min(value, 100)}%;height:100%;border-radius:4px;transition:width 0.3s"></div>
    </div>`;
}

export function generateAnalysisReport(
  mlResult: MLAnalysisResult,
  analysis: any,
  role: string,
  fileName?: string
): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const roleLabel = role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const totalScore = analysis?.resumeScore?.totalScore ?? 0;
  const cs = analysis?.resumeScore?.componentScores ?? {};
  const recs: string[] = analysis?.resumeScore?.recommendations ?? [];

  const matchedSkills: string[] = mlResult.matchedSkills ?? [];
  const missingSkills: string[] = mlResult.missingSkills ?? [];
  const partialSkills = mlResult.partialSkills ?? [];
  const extractedSkills: string[] = mlResult.extractedSkills ?? [];

  const jobCompat = (mlResult.jobCompatibility ?? []).slice(0, 8);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume Analysis Report — ${roleLabel}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; color: #1e293b; line-height: 1.5; }
    .page { max-width: 900px; margin: 0 auto; padding: 32px 24px; }
    .header { background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 32px; border-radius: 16px; margin-bottom: 24px; }
    .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
    .header p { opacity: 0.85; font-size: 14px; }
    .meta { display: flex; gap: 24px; margin-top: 16px; flex-wrap: wrap; }
    .meta-item { font-size: 12px; opacity: 0.8; }
    .meta-item strong { display: block; font-size: 14px; opacity: 1; }
    .section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px; border: 1px solid #e2e8f0; }
    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .score-hero { display: flex; align-items: center; gap: 32px; flex-wrap: wrap; }
    .score-circle { width: 100px; height: 100px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 6px solid; }
    .score-big { font-size: 32px; font-weight: 800; }
    .score-label { font-size: 11px; color: #64748b; }
    .score-details { flex: 1; }
    .component-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 12px; }
    .component-card { padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
    .component-name { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; }
    .component-score { font-size: 24px; font-weight: 800; }
    .component-weight { font-size: 10px; color: #94a3b8; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 4px; }
    .compat-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
    .compat-row:last-child { border-bottom: none; }
    .compat-role { flex: 1; font-size: 13px; font-weight: 500; }
    .compat-score { font-size: 13px; font-weight: 700; width: 40px; text-align: right; }
    .compat-bar { flex: 2; }
    .rec-item { display: flex; gap: 8px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .rec-item:last-child { border-bottom: none; }
    .rec-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
    .ml-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .ml-card { padding: 16px; border-radius: 8px; text-align: center; }
    .ml-value { font-size: 28px; font-weight: 800; }
    .ml-name { font-size: 11px; color: #64748b; margin-top: 2px; }
    .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
    @media print { body { background: white; } .page { padding: 16px; } }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <h1>Resume Analysis Report</h1>
    <p>Next Step Career AI — ML-powered resume intelligence</p>
    <div class="meta">
      <div class="meta-item"><strong>${roleLabel}</strong>Target Role</div>
      <div class="meta-item"><strong>${dateStr} ${timeStr}</strong>Generated</div>
      ${fileName ? `<div class="meta-item"><strong>${fileName}</strong>File</div>` : ''}
      <div class="meta-item"><strong>${mlResult.predictedDisplay ?? roleLabel}</strong>Predicted Role</div>
      <div class="meta-item"><strong>${mlResult.mlConfidence ?? 0}%</strong>ML Confidence</div>
    </div>
  </div>

  <!-- Overall Score -->
  <div class="section">
    <div class="section-title">📊 Overall Score</div>
    <div class="score-hero">
      <div class="score-circle" style="border-color:${scoreColor(mlResult.finalScore)};color:${scoreColor(mlResult.finalScore)}">
        <span class="score-big">${mlResult.finalScore}</span>
        <span class="score-label">/ 100</span>
      </div>
      <div class="score-details">
        <div style="font-size:20px;font-weight:700;color:${scoreColor(mlResult.finalScore)}">${scoreLabel(mlResult.finalScore)}</div>
        <div style="font-size:13px;color:#64748b;margin-top:4px">
          ${mlResult.finalScore >= 80 ? 'Highly competitive for this role.' :
            mlResult.finalScore >= 60 ? 'Good match — a few gaps to close.' :
            mlResult.finalScore >= 40 ? 'Fair match — build key skills.' :
            'Upload a more detailed resume to improve your score.'}
        </div>
        ${progressBar(mlResult.finalScore, scoreColor(mlResult.finalScore))}
        <div style="font-size:12px;color:#94a3b8;margin-top:4px">
          ${matchedSkills.length} skills matched · ${missingSkills.length} gaps · ${extractedSkills.length} total extracted
        </div>
      </div>
    </div>
  </div>

  <!-- ML Scores -->
  <div class="section">
    <div class="section-title">🤖 ML Score Breakdown</div>
    <div class="ml-grid">
      <div class="ml-card" style="background:#eff6ff;border:1px solid #bfdbfe">
        <div class="ml-value" style="color:#1d4ed8">${mlResult.mlScore ?? 0}%</div>
        <div class="ml-name">TF-IDF Score</div>
        ${progressBar(mlResult.mlScore ?? 0, '#1d4ed8')}
      </div>
      <div class="ml-card" style="background:#fffbeb;border:1px solid #fde68a">
        <div class="ml-value" style="color:#b45309">${mlResult.fuzzyScore ?? 0}%</div>
        <div class="ml-name">Fuzzy Score</div>
        ${progressBar(mlResult.fuzzyScore ?? 0, '#b45309')}
      </div>
      <div class="ml-card" style="background:#f0fdf4;border:1px solid #bbf7d0">
        <div class="ml-value" style="color:#15803d">${mlResult.finalScore ?? 0}%</div>
        <div class="ml-name">Final Score (0.7×ML + 0.3×Fuzzy)</div>
        ${progressBar(mlResult.finalScore ?? 0, '#15803d')}
      </div>
    </div>
  </div>

  ${totalScore > 0 ? `
  <!-- Resume Quality Score -->
  <div class="section">
    <div class="section-title">📋 Resume Quality Score</div>
    <div class="score-hero">
      <div class="score-circle" style="border-color:${scoreColor(totalScore)};color:${scoreColor(totalScore)}">
        <span class="score-big">${totalScore}</span>
        <span class="score-label">/ 100</span>
      </div>
      <div class="score-details" style="flex:1">
        <div class="component-grid">
          ${[
            { label: 'Skills',     score: cs.skillsScore ?? 0,     weight: '40%', color: '#2563eb' },
            { label: 'Projects',   score: cs.projectsScore ?? 0,   weight: '25%', color: '#7c3aed' },
            { label: 'Experience', score: cs.experienceScore ?? 0, weight: '20%', color: '#059669' },
            { label: 'Education',  score: cs.educationScore ?? 0,  weight: '15%', color: '#d97706' },
          ].map(c => `
            <div class="component-card">
              <div class="component-name">${c.label} <span class="component-weight">(${c.weight})</span></div>
              <div class="component-score" style="color:${c.color}">${c.score}</div>
              ${progressBar(c.score, c.color)}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>
  ` : ''}

  <!-- Skills -->
  <div class="section">
    <div class="section-title">✅ Matched Skills (${matchedSkills.length})</div>
    <div class="skills-grid">
      ${matchedSkills.map(s => skillBadge(s, 'matched')).join('')}
      ${matchedSkills.length === 0 ? '<span style="color:#94a3b8;font-size:13px">No matched skills detected</span>' : ''}
    </div>
  </div>

  ${partialSkills.length > 0 ? `
  <div class="section">
    <div class="section-title">≈ Partial Matches — Fuzzy Logic (${partialSkills.length})</div>
    <div class="skills-grid">
      ${partialSkills.map((ps: any) => skillBadge(`${ps.skill} (${ps.similarity}%)`, 'partial')).join('')}
    </div>
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">❌ Missing Skills (${missingSkills.length})</div>
    <div class="skills-grid">
      ${missingSkills.map(s => skillBadge(s, 'missing')).join('')}
      ${missingSkills.length === 0 ? '<span style="color:#94a3b8;font-size:13px">No critical gaps detected</span>' : ''}
    </div>
  </div>

  <!-- Job Compatibility -->
  ${jobCompat.length > 0 ? `
  <div class="section">
    <div class="section-title">💼 Job Role Compatibility</div>
    ${jobCompat.map((jc: any, i: number) => `
      <div class="compat-row">
        ${i === 0 ? badge('Best Match', '#dcfce7', '#15803d') : ''}
        <div class="compat-role">${jc.display}</div>
        <div class="compat-bar">${progressBar(jc.score, scoreColor(jc.score))}</div>
        <div class="compat-score" style="color:${scoreColor(jc.score)}">${jc.score}%</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Recommendations -->
  ${recs.length > 0 ? `
  <div class="section">
    <div class="section-title">💡 Recommendations</div>
    ${recs.map(rec => {
      const isPositive = /excellent|strong|good|great/i.test(rec);
      return `<div class="rec-item">
        <div class="rec-dot" style="background:${isPositive ? '#16a34a' : '#d97706'}"></div>
        <div>${rec}</div>
      </div>`;
    }).join('')}
  </div>
  ` : ''}

  <!-- Footer -->
  <div class="footer">
    Generated by Next Step Career AI · ${dateStr} · next-step-career-ai.vercel.app
    <br>ML Pipeline: TF-IDF Vectorization + Multinomial Naive Bayes + Fuzzy Matching (Levenshtein + Jaccard)
  </div>

</div>
</body>
</html>`;
}

/**
 * Download the analysis report as an HTML file.
 */
export function downloadAnalysisReport(
  mlResult: MLAnalysisResult,
  analysis: any,
  role: string,
  fileName?: string
): void {
  const html = generateAnalysisReport(mlResult, analysis, role, fileName);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resume-analysis-${role}-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download from localStorage (last analysis).
 */
export function downloadLastAnalysisReport(): boolean {
  try {
    const raw = localStorage.getItem('lastAnalysisResult');
    const role = localStorage.getItem('lastDetectedRole') ?? 'software_developer';
    if (!raw) return false;
    const analysis = JSON.parse(raw);
    const mlResult = analysis?.mlResult;
    if (!mlResult) return false;
    downloadAnalysisReport(mlResult, analysis, role);
    return true;
  } catch { return false; }
}
