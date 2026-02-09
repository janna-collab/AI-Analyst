
import { StartupAnalysis, UploadedFile } from './types';
import { swarmProvider } from './agents/swarmProvider';

export const apiService = {
  async analyzeStartup(
    files: UploadedFile[], 
    notes: string, 
    sector: string,
    onProgress?: (status: string) => void
  ): Promise<StartupAnalysis> {
    return swarmProvider.executeFullAnalysis(files, notes, sector, onProgress);
  },

  async exportToCsv(analysis: StartupAnalysis): Promise<Blob> {
    const rows = [
      ["Field", "Value"],
      ["Company Name", analysis.companyName],
      ["Verdict", analysis.verdict],
      ["Overall Score", analysis.scores.overall],
      ["Executive Summary", analysis.executiveSummary],
      ["Reasoning", analysis.reasoning]
    ];
    const csvContent = rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  },

  async exportToJson(analysis: StartupAnalysis): Promise<Blob> {
    return new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
  },

  async sendToFounders(analysis: StartupAnalysis, email: string, customMessage: string): Promise<any> {
    // Generate a professional mailto link to trigger real email client
    const subject = encodeURIComponent(`Investment Feedback: ${analysis.companyName} x VentureScout AI`);
    const body = encodeURIComponent(
      `Hi Founder,\n\nOur institutional AI committee has completed the evaluation for ${analysis.companyName}.\n\nVerdict: ${analysis.verdict}\nOverall Score: ${analysis.scores.overall}/100\n\nExecutive Summary:\n${analysis.executiveSummary}\n\nAdditional Notes: ${customMessage}\n\nBest regards,\nVentureScout Analyst Team`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    return { success: true };
  }
};
