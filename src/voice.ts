const BUSINESS_ID = "d50362b5-4edb-4405-bd05-d8692d6e612e";

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined' && window.KORA_CONFIG?.apiBaseUrl) {
    return window.KORA_CONFIG.apiBaseUrl;
  }
  return "https://kora-agent.grubtok.com";
}

export async function createVoiceSession(
  locale?: string,
  page_context?: Record<string, unknown>
) {
  const apiBaseUrl = getApiBaseUrl();
  const payload = {
    business_id: BUSINESS_ID,
    locale,
    page_context,
  };

  const response = await fetch(`${apiBaseUrl}/api/v1/public/voice/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create voice session' }));
    throw new Error(errorData.message || 'Failed to create voice session');
  }
  return await response.json();
}