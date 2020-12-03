import Excel from "exceljs";

import { writeFile } from "fs";


// // import data from './helloworld';
// readFile('./helloworld.json', 'utf-8', (err, jsonString) => {
//     const data = JSON.parse(jsonString);
//     let datass = [1, 2, 3];
//     datass
//     console.log(data.length)
//     //whatever other code you may fanacy
// });


class ExcelFraction {

    constructor() {
        this.excel = new Excel.Workbook();
        this.path = './ECONOMIA_NICO-17-nov-20.xlsx';
        this.formatFraction = RegExp(/\b([0-9]{4}[.][0-9]{2}[.][0-9]{2})\b/);
    }

    async getWorkBook() {
        return await this.excel.xlsx.readFile(this.path);
    }

    async getFractions() {
        const workBook = await this.getWorkBook();
        const fractions = workBook.worksheets.map((sheet) => sheet.id > 104 ? null : this.setFractions(sheet))
        await this.saveJson('fracciones', fractions);
    }

    async saveJson(name, data) {
        writeFile(`${name}.json`, JSON.stringify(data), async (res, error) => {
            console.log('Archivo json creado');
        });
    }

    isFraction(fraction) {
        return this.formatFraction.test(fraction);
    }


    fractionFromDate(dateLong) {
        const date = new Date(dateLong);
        return `${date.getFullYear()}.${this.appendZero(date.getUTCMonth() + 1)}.${this.appendZero(date.getUTCDate())}`;
    }

    setFractions(sheet) {
        const fracciones = [];
        const rowCount = sheet.rowCount;
        sheet.getColumn(1).style = { numFmt: 'yyyy.mm.dd' };
        for (let index = 0; index <= rowCount; index++) {
            let cellValue = sheet.getRow(index).getCell(1).value;
            let fraccion = this.isDate(cellValue) ? this.fractionFromDate(cellValue) : cellValue?.richText[0]?.text
            if (this.isFraction(fraccion)) {
                let Nico = this.appendZero(sheet.getRow(index).getCell(2).value.toString());
                fracciones.push({ fraccion: fraccion, nico: Nico })
            }
        }
        return fracciones;
    }


    isDate(date) {
        let posibleDate = Date.parse(date);
        posibleDate = typeof date === 'string' || posibleDate < 1 ? 1 : posibleDate;
        return posibleDate > 0;
    }

    appendZero(number = 0) {
        return number > 9 ? number : `0${number}`;
    }

}

const excel = new ExcelFraction();

try {
    excel.getFractions();
} catch (error) {

}



