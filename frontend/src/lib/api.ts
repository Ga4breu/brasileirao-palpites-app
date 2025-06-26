export async function apiFetch(path: string, options: RequestInit = {}) {
  const base = import.meta.env.VITE_API_URL;
  const res = await fetch(`${base}${path}`, options);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMatches() {
  return apiFetch('/api/matches');
}

export async function getPredictions() {
  return apiFetch('/api/predictions', { headers: { ...authHeaders() } });
}

export async function savePrediction(matchId: number, homeScore: number, awayScore: number) {
  return apiFetch('/api/predictions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ matchId, homeScore, awayScore }),
  });
}

export async function getRanking() {
  return apiFetch('/api/ranking');
}
