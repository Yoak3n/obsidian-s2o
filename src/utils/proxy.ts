import { ProxyAgent, setGlobalDispatcher } from 'undici';
export function loadProxy(proxyUrl: string) {
    if (!proxyUrl || proxyUrl.length === 0) {
        return;
    }
    const httpDispatcher = new ProxyAgent({ uri: proxyUrl});
    setGlobalDispatcher(httpDispatcher);
}