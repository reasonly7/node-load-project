import { loadProject } from './utils/loadProject';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

const filesMap = await loadProject(path.resolve(__dirname, '..'));

const prefixPath = path.resolve(__dirname, '../output');
const dirCheckMap: Record<string, boolean> = {};

for (const [fileRelativePath, content] of Object.entries(filesMap)) {
  const fileFullPath = path.resolve(prefixPath, fileRelativePath);
  const fileDir = path.dirname(fileFullPath);

  if (!dirCheckMap[fileDir]) {
    await fs.mkdir(fileDir, { recursive: true });
    dirCheckMap[fileDir] = true;
  }
  
  fs.writeFile(fileFullPath, content, 'utf-8');
}
