/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  postcss: true,
  tailwind: true,

  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: [],
  watchPaths: ['./tailwind.config.ts'],
  cacheDirectory: './node_modules/.cache/remix',
}
