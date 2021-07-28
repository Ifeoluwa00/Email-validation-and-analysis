/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */
import fs from 'fs';
import * as emailValidator from 'email-validator';

async function analyseFiles(inputPaths: string[], outputPath: string) {
  const path = inputPaths[0];
  const fileContent = fs.createReadStream(path)//fs.readFileSync(path, 'utf8');
  let csvFile = ""
  for await (const path of fileContent as fs.ReadStream) {
    csvFile+=path
  }
  const lines = csvFile.trim().split("\n")  //const lines = fileContent.trim().split('\n');
  // console.log(lines)
  // to remove "Emails" heading at the beginning of csv file
  lines.shift();


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
  let writeResult= JSON.stringify(sampleObj, null, ' ')
  let finalSample = fs.createWriteStream(outputPath)
  return finalSample.write(writeResult)
    //fs.writeFileSync(outputPath, JSON.stringify(sampleObj, null, ' '));
}

//console.log(analyseFiles(["/Users/decagon/Desktop/week4_TASK/week-4-node-008-Ifeoluwa00/task-two/fixtures/inputs/small-sample.csv"], ""))
export default analyseFiles;

