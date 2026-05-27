import { Buffer } from 'node:buffer';
import process from 'node:process';

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => resolve(Buffer.concat(chunks)));
    request.on('error', reject);
  });
}

function createProxyHeaders(requestHeaders) {
  return Object.fromEntries(
    Object.entries(requestHeaders).filter(
      ([key]) => !HOP_BY_HOP_HEADERS.has(key.toLowerCase())
    )
  );
}

function getBackendOrigin() {
  const rawOrigin = process.env.BACKEND_API_ORIGIN?.trim();

  if (!rawOrigin) {
    throw new Error('BACKEND_API_ORIGIN environment variable is required.');
  }

  const originWithProtocol = /^https?:\/\//.test(rawOrigin)
    ? rawOrigin
    : `http://${rawOrigin}`;
  const backendUrl = new URL(originWithProtocol);
  backendUrl.pathname = backendUrl.pathname.replace(/\/api\/?$/, '');

  return backendUrl.origin + backendUrl.pathname.replace(/\/$/, '');
}

function createTargetUrl(request) {
  const backendOrigin = getBackendOrigin();
  const requestUrl = new URL(
    request.url,
    `https://${request.headers.host || 'localhost'}`
  );
  const queryPath = requestUrl.searchParams.get('path');
  const fallbackPath = requestUrl.pathname.replace(/^\/api\/?/, '');
  const apiPath = (queryPath || fallbackPath).replace(/^\/+/, '');
  const targetUrl = new URL(`/api/${apiPath}`, backendOrigin);

  requestUrl.searchParams.forEach((value, key) => {
    if (key !== 'path') {
      targetUrl.searchParams.append(key, value);
    }
  });

  return targetUrl;
}

export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.end();
    return;
  }

  try {
    const targetUrl = createTargetUrl(request);
    const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
    const body = hasBody ? await readRequestBody(request) : undefined;
    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers: createProxyHeaders(request.headers),
      body,
    });

    response.statusCode = backendResponse.status;

    backendResponse.headers.forEach((value, key) => {
      if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
        response.setHeader(key, value);
      }
    });

    const responseBody = Buffer.from(await backendResponse.arrayBuffer());
    response.end(responseBody);
  } catch (error) {
    console.error('API proxy failed:', error);
    response.statusCode = 502;
    response.setHeader('Content-Type', 'application/json');
    response.end(
      JSON.stringify({
        message: '백엔드 API 프록시 요청에 실패했습니다.',
      })
    );
  }
}
