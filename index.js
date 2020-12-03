import Excel from 'exceljs';
import { writeFile } from 'fs';

// interface fractions {
//   fraction: string,
//   nico: string
// };
// readFile('./fracciones.json', (error, files) => {
//   let m = JSON.parse(files.toString());
//   m = m.map((x) => x?.fraccion).filter(Boolean);  
//   const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index);
//   const s = findDuplicates(m);
//   m = [...new Set(s)];
//   writeFile(`${'fracciones-repetidas'}.json`, JSON.stringify(m), async () => {
//     console.log('Archivo json creado');
//   });
//   console.log(m);
// });

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
    const fractions = workBook.worksheets.map((sheet) => (sheet.id > 104 ? null : this.setFractions(sheet)));
    await this.saveJson('fracciones', fractions);
  }

  // eslint-disable-next-line class-methods-use-this
  async saveJson(name, data) {
    writeFile(`${name}.json`, JSON.stringify(data.flat()), async () => {
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
    const { rowCount } = sheet;
    const fracciones = [];
    sheet.getColumn(1).style = { numFmt: 'yyyy.mm.dd' };
    for (let index = 0; index <= rowCount; index++) {
      const cellValue = sheet.getRow(index).getCell(1).value;
      const fraccion = this.isDate(cellValue) ? this.fractionFromDate(cellValue) : cellValue?.richText[0]?.text;
      if (this.isFraction(fraccion)) {
        const Nico = this.appendZero(sheet.getRow(index).getCell(2).value.toString());
        fracciones.push({ fraccion, nico: Nico });
      }
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

// const excel = new ExcelFraction();
// excel.getFractions();
