/**
 * TODO: Rewrite this config to ESM
 * But currently electron-builder doesn't support ESM configs
 * @see https://github.com/develar/read-config-file/issues/10
 */

/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
export default async function () {
  const {getVersion} = await import('./version/getVersion.mjs');
  return {
    productName: 'Constellation',  // Pour macOS et Windows
    directories: {
      output: 'dist',
      buildResources: 'buildResources',
    },
    files: ['packages/**/dist/**'],
    extraMetadata: {
      version: getVersion(),
      name: 'Constellation',  // Pour linux deb
    },

    // Specify linux target just for disabling snap compilation
    linux: {
      target: 'deb',
    },
  };
}
