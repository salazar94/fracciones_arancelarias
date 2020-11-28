import Excel from "exceljs";



class ExcelFraction {

    constructor() {
        this.excel = new Excel.Workbook();
        this.worksheets = null;
        this.workBook = null;
        this.formatFraction = RegExp('[0-9]{4}[.][0-9]{2}[.][0-9]{2}');
    }

    async getBook() {
        return await this.excel.xlsx.readFile('./ECONOMIA_NICO-17-nov-20.xlsx');
    }

    async getWorkBook() {
        this.workBook = await this.getBook();
    }

    async getSheetNames() {
        await this.getWorkBook();
        return this.worksheets.worksheets.map(worksheet => worksheet.name);
    }

    isFraction(fraction) {
        return this.formatFraction.test(fraction);
    }

    async prinByTable() {
        await this.getWorkBook();
        const frac = []
        this.workBook.eachSheet(async (w, id) => {
            // console.log(id)
            frac.push(await this.setFractions(id));
        })
        console.log(await frac)
    }
    async setFractions(id) {
        let m = await this.workBook.getWorksheet(id);
        //  this.workBook.eachSheet()
        const fracciones = [];
        for (let index = 1; index < m.rowCount; index++) {
            console.log(m.getRow(index).getCell(1).value)
            let fraccion = m.getRow(index).getCell(1).value?.richText[0]?.text;
            if (this.isFraction(fraccion)) {
                let Nico = m.getRow(index).getCell(2).value.toString();
                Nico = Nico > 9 ? Nico : `0${Nico}`;
                fracciones.push({ fraccion: fraccion, nico: Nico })
            }
        }
        return fracciones;
    }
}

const excel = new ExcelFraction();
// let m = excel.getSheetNames()
excel.prinByTable();
// console.log(await m)