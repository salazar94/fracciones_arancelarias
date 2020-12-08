import Excel from 'exceljs';
import { writeFile } from 'fs';


class ExcelFraction {
    constructor() {
        this.excel = new Excel.Workbook();
        this.path = './ECONOMIA_NICO-17-nov-20.xlsx';
        this.formatFraction = RegExp(/\b([0-9]{4}[.][0-9]{2}[.][0-9]{2})\b/);
    }

    async getWorkBook() {
        return this.excel.xlsx.readFile(this.path);
    }
   
    async getFractions() {
        const workBook = await this.getWorkBook();
        const fractions = workBook.worksheets.map((sheet) => (sheet.id < 105 ? null : this.setFractions(sheet)));
        // const fractions =  this.setFractions(workBook.worksheets[117]);
        
        await this.saveJson('fracciones TIGIE', fractions);
    }

    // eslint-disable-next-line class-methods-use-this
    async saveJson(name, data) {
        data = data.flat().filter(Boolean);
        writeFile(`${name}.json`, JSON.stringify(data), async () => {
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
        try {

            const { rowCount } = sheet;
            for (let index = 0; index <= rowCount; index++) {
                const cellValue1 = sheet.getRow(index).getCell(1).value;
                const cellValue2 = sheet.getRow(index).getCell(2).value;
                const fraccionV = this.isDate(cellValue1) ? this.fractionFromDate(cellValue1) : cellValue1?.richText[0]?.text;
                const fraccionN = this.isDate(cellValue2) ? this.fractionFromDate(cellValue2) : cellValue2?.richText[0]?.text;
                if (this.isFraction(fraccionV) && this.isFraction(fraccionN)) {
                    const Nico = this.appendZero(sheet.getRow(index).getCell(3).value.toString());
                    fracciones.push({ fraccionVieja: fraccionV, fraccionNueva: fraccionN, nico: Nico, fraccionIndice: `${fraccionN}${Nico}` });
                }
            }

        } catch (error) {
            console.log(error)
        }
        return fracciones;
    }

    // eslint-disable-next-line class-methods-use-this
    isDate(date) {
        let posibleDate = Date.parse(date);
        posibleDate = typeof date === 'string' || posibleDate < 1 ? 1 : posibleDate;
        return posibleDate > 0;
    }

    // eslint-disable-next-line class-methods-use-this
    appendZero(number = 0) {
        return number > 9 ? number : `0${number}`;
    }
}

const excel = new ExcelFraction();
excel.getFractions();
