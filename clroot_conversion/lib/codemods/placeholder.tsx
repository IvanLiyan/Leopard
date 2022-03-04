/* 
    $ npx jscodeshift is being used to run the runMods.ts codemod script instead of ts-node
    since ts-node has unexpected behavior (i.e. recursively calling runMods() and creating
    more child exec processes than expected)
*/

export {};
