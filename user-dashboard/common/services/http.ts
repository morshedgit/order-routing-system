import { API_AUTH_URL } from "../constants";

export const httpService = async (
  input: string | URL | Request,
  init?: RequestInit | undefined
): Promise<Response> => {
  const token = sessionStorage.getItem("BearerToken");
  const response = await fetch(input, {
    ...init,
    headers: { ...init?.headers, Authorization: token || "" },
  });
  console.log(response);
  if (response.status === 401) window.location.href = `${API_AUTH_URL}/auth`;
  if (response.status === 403) window.location.href = `/403`;
  return response;
};
