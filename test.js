const { chunkByChar, chunkBySection, chunkBySentence } = require("./chunking");

const doc = `# Report
## Medical Research
Researchers found a new bug in the trial data. It was fixed. The study continues.
## Software Engineering
Engineers fixed 120 bugs this year. Most were in the login module. Release is next month.`;

console.log("SECTION:", chunkBySection(doc));
console.log("SENTENCE:", chunkBySentence(doc, 2, 1));
console.log("CHAR:", chunkByChar(doc, 60, 10));