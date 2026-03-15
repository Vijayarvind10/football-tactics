import { withQuota } from "./quota";

const BASE_URL = "https://v3.football.api-sports.io";

export async function footballApi<T>(
  path: string,
  params?: Record<string, string | number>
): Promise<T> {
  return withQuota(async () => {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, String(v));
      }
    }

    const res = await fetch(url.toString(), {
      headers: {
        "x-rapidapi-key": process.env.API_FOOTBALL_KEY!,
        "x-rapidapi-host": "v3.football.api-sports.io",
      },
    });

    if (!res.ok) {
      throw new Error(`API-Football error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json() as { response: T; errors: Record<string, string> };
    if (Object.keys(json.errors ?? {}).length > 0) {
      throw new Error(`API-Football API error: ${JSON.stringify(json.errors)}`);
    }
    return json.response;
  });
}
