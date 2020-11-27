import Excel from "exceljs";


const Excel = new Excel.Workbook();

Excel.xlsx.readFile('./ECONOMIA_NICO-17-nov-20.xlsx').then((d) => {
    console.log(d.worksheets.forEach(worksheet => console.log(worksheet.id, worksheet.name)));
})

