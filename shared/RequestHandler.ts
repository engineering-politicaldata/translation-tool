export async function apiRequest(input: RequestInfo, init?: RequestInit) {
    const res = await fetch(input, init);
    if (res.ok) {
        const data = await res.json();
        if (data.backendError) {
            throw data.backendError;
        }
        return data;
    }
    // TODO handle 403 error correctly
    const error = await res.json();
    throw error;
}
