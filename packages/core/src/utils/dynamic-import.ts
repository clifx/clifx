export async function dynamicImport<T>(path: string): Promise<T> {
  return import(path).then((mod) => mod.default ?? mod);
}
