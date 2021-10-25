export async function apiRequest(input: RequestInfo, init?: RequestInit) {
    const res = await fetch(input, init);
    if (res.ok) {
        const data = await res.json();
        if (data.backendError) {
            throw data;
        }
        return data;
    }
    if (res.status == 403) {
    }
    const error = await res.json();
    throw error;
}
