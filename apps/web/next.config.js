//@ts-check
let composePlugins;
let withNx;
try {
  ({ composePlugins, withNx } = require('@nx/next'));
} catch {
  // If @nx/next isn't available (for example on Vercel when installing only
  // the package's dependencies), provide safe fallbacks so Next can still
  // build. These fallbacks are no-ops that keep the same function shapes
  // used below.
  composePlugins = (/** @type {any[]} */ ...plugins) => (/** @type {any} */ config) =>
    plugins.reduce((cfg, plugin) => (typeof plugin === 'function' ? plugin(cfg) : cfg), config);
  withNx = (/** @type {any} */ cfg) => cfg;
}

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
