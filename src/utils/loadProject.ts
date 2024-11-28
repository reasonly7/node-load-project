import * as path from 'node:path';
import * as fs from 'node:fs/promises';

export const loadProject = async (projectPath: string) => {
  const fileList: string[] = [];

  const traverse = async (currentPath: string) => {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(projectPath, fullPath);

      if (entry.isDirectory()) {
        // 递归子目录
        await traverse(fullPath);
      } else if (entry.isFile()) {
        // 收集文件
        fileList.push(relativePath);
      }
    }
  };

  // 开始递归遍历
  await traverse(projectPath);
  return fileList;
};
