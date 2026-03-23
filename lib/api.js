const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function loginEmployee(payload) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Login failed.");
  }

  return data;
}

export async function fetchMe(accessToken) {
  const response = await fetch(`${API_BASE_URL}/api/accounts/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Session expired.");
  }

  return data;
}