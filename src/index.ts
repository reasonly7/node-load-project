import { loadProject } from './utils/loadProject';
import * as path from 'node:path';

const fileList = await loadProject(path.resolve(__dirname, '..'));
console.log(fileList);
