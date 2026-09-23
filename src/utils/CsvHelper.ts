// utility to interact with csv
//need to download third party library: npm install csv-parse

import fs from "fs"; //fs :file system
import { parse } from 'csv-parse/sync'; //parse is the object coming from csv module..it is coming from dependency which we downloaded through npm install

export class CsvHelper {

    static readCsv(filePath: string): Record<string, string>[] { //static method will be called using class name: no need to create the object of the class to call static method
        return parse(fs.readFileSync(filePath, 'utf-8'), { //if any special chars in file consider them as utf standard
            columns: true, //first row always a header not test data
            skip_empty_lines: true,
            trim: true,
        }) as Record<string, string>[];
    }
}