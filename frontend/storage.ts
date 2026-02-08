
import { StartupAnalysis, SavedReport, User } from './types';

const GUEST_KEY = 'vs_reports_guest';
const USER_KEY_PREFIX = 'vs_reports_user_';

export const storageService = {
  saveReport(analysis: StartupAnalysis, user: User): SavedReport {
    const isGuest = user.name === 'Guest Analyst';
    const storageKey = isGuest ? GUEST_KEY : `${USER_KEY_PREFIX}${user.id}`;
    
    const existing: SavedReport[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const newReport: SavedReport = {
      id: analysis.id,
      userId: user.id,
      analysis: analysis,
      savedAt: new Date().toISOString()
    };
    
    // Avoid duplicates by ID
    const updated = [newReport, ...existing.filter(r => r.id !== analysis.id)];
    
    // For guests, maybe limit to 5 temporary reports
    if (isGuest && updated.length > 5) {
      updated.pop();
    }
    
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return newReport;
  },

  getReports(user: User): SavedReport[] {
    const isGuest = user.name === 'Guest Analyst';
    const storageKey = isGuest ? GUEST_KEY : `${USER_KEY_PREFIX}${user.id}`;
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  },

  deleteReport(reportId: string, user: User) {
    const isGuest = user.name === 'Guest Analyst';
    const storageKey = isGuest ? GUEST_KEY : `${USER_KEY_PREFIX}${user.id}`;
    const existing: SavedReport[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = existing.filter(r => r.id !== reportId);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }
};
