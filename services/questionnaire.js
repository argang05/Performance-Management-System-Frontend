export async function fetchCurrentQuestionnaire(accessToken) {
    const response = await fetch("/api/questionnaire/current", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data?.detail || "Failed to load questionnaire.");
    }
  
    return data;
  }
  
  export async function saveQuestionnaireDraft(accessToken, payload) {
    const response = await fetch("/api/questionnaire/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data?.detail || "Failed to save draft.");
    }
  
    return data;
  }
  
  export async function submitQuestionnaire(accessToken, payload) {
    const response = await fetch("/api/questionnaire/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data?.detail || "Failed to submit questionnaire.");
    }
  
    return data;
  }