
import { StartupAnalysis, UploadedFile } from './types';
import { mockService } from './mockService';

const BACKEND_URL = 'http://localhost:8000/api/v1';

/**
 * Utility to convert base64 data to a Blob for multipart/form-data transmission
 */
function base64ToBlob(base64: string, type: string): Blob {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type });
}

export const apiService = {
  async analyzeStartup(
    files: UploadedFile[], 
    notes: string, 
    sector: string,
    onProgress?: (status: string) => void
  ): Promise<StartupAnalysis> {
    onProgress?.("Attempting to reach Backend Analysis Swarm...");

    try {
      const formData = new FormData();
      formData.append('notes', notes);
      formData.append('sector', sector);
      
      files.forEach((file) => {
        const blob = base64ToBlob(file.data, file.type || 'application/pdf');
        formData.append('files', blob, file.name);
      });

      const response = await fetch(`${BACKEND_URL}/analysis/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Backend responded with status ${response.status}`);
      }

      onProgress?.("Backend analysis successful. Rendering report...");
      return await response.json();

    } catch (err: any) {
      console.warn("Backend unavailable or failed. Falling back to local Intelligence Swarm.", err);
      // Delegate complex logic to mockService if backend fails
      return mockService.analyzeStartup(files, notes, sector, onProgress);
    }
  },

  async exportToCsv(analysis: StartupAnalysis): Promise<Blob> {
    const rows = [
      ["Field", "Value"],
      ["Company Name", analysis.companyName],
      ["Verdict", analysis.verdict],
      ["Sector", analysis.sector],
      ["Overall Score", analysis.scores.overall],
      ["One Liner", analysis.oneLiner],
      ["Executive Summary", analysis.executiveSummary],
      ["Reasoning", analysis.reasoning]
    ];
    const csvContent = rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  },

  async exportToJson(analysis: StartupAnalysis): Promise<Blob> {
    return new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
  },

  async sendToFounders(analysis: StartupAnalysis, email: string, message: string): Promise<any> {
    try {
      const response = await fetch(`${BACKEND_URL}/analysis/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis, email, message }),
      });

      if (!response.ok) throw new Error('Backend email dispatch failed');
      return await response.json();
    } catch (err) {
      console.warn("Backend email failed, falling back to mock dispatch.", err);
      return mockService.sendToFounders(analysis, email, message);
    }
  }
};
