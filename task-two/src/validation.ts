/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
import fs from 'fs';
import dns from 'dns';
let pathPromise: Promise<string>;
async function validateEmailAddresses(inputPath: string[], outputFile: string) {
  let path = inputPath[0];
  pathPromise = new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  let fileContent: string = await pathPromise;
  let lines = fileContent.split('\n');
  let header = lines.splice(0, 1);
  let footer = lines.splice(-1);
  let validatedEmailPromises: unknown[] = [];
  for (let email of lines) {
    const domain = email.split('@')[1];

    let val: Promise<unknown> = new Promise((resolve, reject) => {
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

  let validatedEmail: string[] = (await Promise.all(
    validatedEmailPromises,
  )) as string[];
  let validEmailDomains: string[] = validatedEmail.filter((x) => x !== null);
  let outPut = [...header, ...validEmailDomains, ...footer].join('\n');
  return fs.writeFile(outputFile, outPut, 'utf8', (err) => {
    if (err) {
      console.log(err);
    }
  });
}

// console.log(validateEmailAddresses(["./fixtures/inputs/small-sample.csv"], ""));
export default validateEmailAddresses;
