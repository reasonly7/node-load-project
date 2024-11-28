import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import ignore, { Ignore } from 'ignore';

const createIgnore = (
  parentIgnore: Ignore,
  extraRules: string[] = [],
): Ignore => {
  return ignore().add([parentIgnore, ...extraRules]);
};

const toUnixPath = (filePath: string) =>
  path.normalize(filePath).replace(/\\/g, '/');

/**
 * load project files in memory
 * @param projectPath string
 * @returns Record<string, string>, like: { "src/index.ts": "..."}
 */
export const loadProject = async (projectPath: string) => {
  const filesMap: Record<string, string> = {};
  const initalIgnore = ignore().add(['.git']);

  const traverse = async (currentPath: string, parentIgnore: Ignore) => {
    let currentIgnore = createIgnore(parentIgnore);
    const ignoreFilePath = path.join(currentPath, '.gitignore');

    if (existsSync(ignoreFilePath)) {
      const gitignoreContent = await fs.readFile(ignoreFilePath, 'utf-8');
      currentIgnore = createIgnore(
        currentIgnore,
        gitignoreContent.split('\n').filter(Boolean),
      );
    }

    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(projectPath, fullPath);

      if (currentIgnore.ignores(relativePath)) {
        continue;
      }

      if (entry.isDirectory()) {
        await traverse(fullPath, currentIgnore);
      } else if (entry.isFile()) {
        const key = toUnixPath(relativePath);
        const value = await fs.readFile(fullPath, 'utf-8');
        filesMap[key] = value;
      }
    }
  };

  await traverse(projectPath, initalIgnore);

  return filesMap;
};
