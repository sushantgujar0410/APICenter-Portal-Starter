import { HttpReqParam } from 'api-docs-ui';
import { ApiDeployment } from '@/types/apiDeployment';
import { OperationMetadata } from '@/types/apiSpec';

/**
 * Resolves complete URL template for a given operation on given deployment.
 * If there is no deployment, it will return a complete path with base URL.
 */
export function resolveOpUrlTemplate(operation?: OperationMetadata, deployment?: ApiDeployment, versionName?: string): string {
  let host = deployment?.server.runtimeUri[0] || '';

  // Ensure protocol prefix is present
  if (host && !/^https?:\/\//i.test(host)) {
    host = `https://${host}`;
  }

  const components = [host, versionName || '', operation?.urlTemplate || ''];

  return components
    .join('/')
    .replace(/([^:])\/{2,}/g, '$1/');
}

const URL_TEMPLATE_PARAM_REGEX = /{([^}]+)}/g;

export function getUrlTemplateParams(urlTemplate: string): string[] {
  const matches = urlTemplate.match(URL_TEMPLATE_PARAM_REGEX);
  if (!matches) {
    return [];
  }

  return matches.map((match) => match.replace(/[{}]/g, ''));
}

export function resolveUrlTemplate(urlTemplate: string, urlParams: HttpReqParam[]): string {
  return urlTemplate.replace(URL_TEMPLATE_PARAM_REGEX, (match, param) => {
    const urlParam = urlParams.find((p) => p.name === param);
    return urlParam?.value || match;
  });
}
