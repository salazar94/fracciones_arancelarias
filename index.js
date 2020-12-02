import Excel from "exceljs";

import { writeFile } from "fs";


class ExcelFraction {

    constructor() {
        this.excel = new Excel.Workbook();
        this.worksheets = null;
        this.workBook = null;
        this.path = './ECONOMIA_NICO-17-nov-20.xlsx';
        this.formatFraction = RegExp(/\b([0-9]{4}[.][0-9]{2}[.][0-9]{2})\b/);
    }

    async getWorkBook() {
        return await this.excel.xlsx.readFile(this.path);
    }

    isFraction(fraction) {
        return this.formatFraction.test(fraction);
    }

    async prinByTable() {
        const workBook = await this.getWorkBook();
        const fractions = workBook.worksheets.map((sheet) => this.setFractions(sheet))
        writeFile('helloworld.json', JSON.stringify(fractions), function (err) {
            if (err) return console.log(err);
            console.log('Hello World > helloworld.txt');
        });
        console.log(fractions)

    }

    setFractions(sheet) {
        if (sheet.id > 104) return false;
        try {
            const fracciones = [];
            const last = sheet.rowCount;
            sheet.getColumn(1).style = { numFmt: 'yyyy.mm.dd' };
            for (let index = 1; index < last; index++) {

                let cellValue = sheet.getRow(index).getCell(1).value;
                let fraccion = '';
                if (this.isDate(cellValue)) {
                    fraccion = this.fractionFromDate(cellValue);
                } else {
                    fraccion = sheet.getRow(index).getCell(1).value?.richText[0].text;
                }
                if (this.isFraction(fraccion)) {
                    let Nico = sheet.getRow(index).getCell(2).value.toString();
                    Nico = Nico > 9 ? Nico : `0${Nico}`;
                    fracciones.push({ fraccion: fraccion, nico: Nico })
                }
            }
            return fracciones;
        } catch (error) {
            console.log(error)
        }

    }

    fractionFromDate(dateLong) {
        const date = new Date(dateLong);
        return `${date.getFullYear()}.${this.appendZero(date.getUTCMonth() + 1)}.${this.appendZero(date.getUTCDate())}`
    }

    isDate(date) {
        return Date.parse(date.toString()) > 0;
    }

    appendZero(number = 0) {
        return number > 9 ? number : `0${number}`;
    }
}

const excel = new ExcelFraction();

try {
    excel.prinByTable();
} catch (error) {

}

