export function isJestTest() {
  return process.env.JEST_WORKER_ID !== undefined;
}

export function isTsNode() {
  return !!require.extensions['.ts'];
}
