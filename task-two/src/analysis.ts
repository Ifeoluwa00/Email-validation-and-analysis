/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */
import fs from 'fs';
import * as emailValidator from 'email-validator';

function analyseFiles(inputPaths: string[], outputPath: string) {
  const path = inputPaths[0];
  const fileContent = fs.readFileSync(path, 'utf8');
  const lines = fileContent.trim().split('\n');
  // to remove "Emails" heading at the beginning of csv file
  lines.splice(0, 1);

  // console.log(lines.length)
  const validDomains: string[] = [];
  const sampleObj: {
    [key: string]: string[] | number | { [key: string]: number };
  } = {};
  let count1 = 0;
  let count2 = 0;
  const emailArr: {
    [key: string]: number;
  } = {};
  for (const email of lines) {
    if (emailValidator.validate(email)) {
      validDomains.push(email.split('@')[1]);
      count1++;
      const domain: string = email.split('@')[1];

      if (emailArr[domain]) {
        emailArr[domain]++;
      } else {
        emailArr[domain] = 1;
      }
    }
    if (lines) {
      count2++;
    }
  }
  sampleObj['valid-domains'] = [...new Set(validDomains)];
  sampleObj['totalEmailsParsed'] = count2;
  sampleObj['totalValidEmails'] = count1;
  sampleObj['categories'] = emailArr;
  // sampleObj
  return fs.writeFileSync(outputPath, JSON.stringify(sampleObj, null, ' '));
}

//console.log(analyseFiles(["/Users/decagon/Desktop/week4_TASK/week-4-node-008-Ifeoluwa00/task-two/fixtures/inputs/small-sample.csv"], ""))
export default analyseFiles;

//list of valid domains
//number of emails parsed
//numner of valid emails
//for each domain you encountered,
// console.log(lines.length)
// console.log(validEmails.length)
// read the input file, using the input path
// console.log(lines[3])
// console.log(lines[3].split("@")[1])
// let validEmails = []
//keep track of the total emails parsed
//keep track of valid emails
//keep track of valid emails domain
//count number of mails for a particular email
// validEmails.push(email)
// console.log('Complete the implementation in src/analysis.ts');
