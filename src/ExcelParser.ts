import { Injectable } from '@nestjs/common';

@Injectable()
export class ExcelParser {
    private nameFile; 
    private arrStFile; //массив с данными о товарах
    private arrKategory; //массив с данными о категориях
    
    constructor(nameFile: string) {
      this.nameFile = nameFile;    
      var XLSX = require('xlsx'); 
      var workbook = XLSX.readFile(this.nameFile);
      this.getBodyJSON(workbook); 
    }
    //свойсто для массива со списком категорий
    getArrKategory(): any[]{
      return this.arrKategory;
    }
    //свойсто для массива со списком товаров
    getArrStFile(): any[]{
      return this.arrStFile;
    }
    getBodyJSON(workbook : any): void {
      var data = [];
      var sheet_name_list = workbook.SheetNames;
  
      var tmpArrKategory = [];
      var tmpArrStFile = [];
      var isFirstSheet = true;
      
      //поочередная обработка страниц excel-документа
      sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
  
        var headers = {};
        for (var z in worksheet) {
          if (z[0] === '!') continue;
          var col = z.substring(0, 1);
  
          var row = parseInt(z.substring(1));
  
          var value = worksheet[z].v;
  
          if (row == 1) {
            headers[col] = value;
            continue;
          }
  
          if (!data[row]) data[row] = {};
          data[row][headers[col]] = value;
        }
        
        data.shift();
        data.shift();
        //
  
        //выбираем в какой массив писать данные | товары или категории 
        if(isFirstSheet){      
          tmpArrKategory = [...data];
          isFirstSheet = false;
        } else {
          tmpArrStFile = [...data];
        }
  
        data = [];
      });
    
      this.arrKategory = tmpArrKategory;
      this.arrStFile = tmpArrStFile;
    }
  }
  