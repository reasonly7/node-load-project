import { loadProject } from './utils/loadProject';
import * as path from 'node:path';

const filesMap = await loadProject(path.resolve(__dirname, '..'));
console.log(Object.keys(filesMap))
// writeFileSync('test.txt', JSON.stringify(filesMap, null, 2));
