/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
import fs from 'fs';
import dns from 'dns';
//import { head } from 'lodash';
let pathPromise: Promise<string>;
async function validateEmailAddresses(inputPath: string[], outputFile: string) {
  const path = inputPath[0];
console.log(path)
  // pathPromise = new Promise((resolve, reject) => {
  //   fs.readFile(path, 'utf8', (err, data) => {
  //     if (err) {
  //       reject(err);
  //     } else {
  //       resolve(data);
  //     }
  //   });
  // });
  // const fileContent: string = await pathPromise;
  // const lines = fileContent.split('\n');
  const fileContent = fs.createReadStream(path); //fs.readFileSync(path, 'utf8');
  let csvFile = '';
  for await (const path of fileContent as fs.ReadStream) {
    csvFile += path;
  }
  
  const lines = csvFile.trim().split('\n');
  
  const header = lines.shift();
  // header
  const footer = lines.pop();
  const validatedEmailPromises: unknown[] = [];
  for (const email of lines) {
    const domain = email.split('@')[1];
    

    const val: Promise<unknown> = new Promise((resolve, reject) => {
      dns.resolve(domain, 'MX', function (err) {
        if (err) {
          resolve(null);
        } else {
          resolve(email);
        }
      });
    });
    validatedEmailPromises.push(val);
  }

  const validatedEmail: string[] = (await Promise.all(
    validatedEmailPromises
  )) as string[];
  
  const validEmailDomains: string[] = validatedEmail.filter((x) => x !== null);
  const outPut = [header, ...validEmailDomains, footer].join('\n');
  // return fs.writeFile(outputFile, outPut, 'utf8', (err) => {
  //   if (err) {
  //     console.log(err);
  //   }

  // });
  const finalSample = fs.createWriteStream(outputFile);
  return finalSample.write(outPut);
}

//console.log(validateEmailAddresses(["./fixtures/inputs/small-sample.csv"], ""));
export default validateEmailAddresses;
