import fs from 'fs';
import path from 'path';

const typesPath = path.resolve('node_modules', '@testing-library', 'jest-dom', 'types', 'index.d.ts');
const refMatcher = /[\r\n]+\/\/\/ <reference types="jest" \/>/;

fs.readFile(typesPath, 'utf8', (err, data) => {
    if (err) throw err;

    fs.writeFile(
        typesPath,
        data.replace(refMatcher, ''),
        'utf8',
        function(err) {
            if (err) throw err;
        }
    );
});
