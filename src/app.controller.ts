import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ExcelParser } from './ExcelParser';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    //инициализация класса-парсера, получение 2х листов из excel
    let t = new ExcelParser('struktura.xlsx');
    var kategory = t.getArrKategory();
    var stFile = t.getArrStFile();
    //

    //настройки подключения к бд
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'nestjs'
    });
    //
    connection.connect();

    //очистка таблиц
    this.sqlReq(connection,'TRUNCATE category;');
    this.sqlReq(connection,'TRUNCATE structure;');
    this.sqlReq(connection,'TRUNCATE logList;');
    //

    //добавление информации о категориях | на текущий момент не проверяется существует ли родитель для дочерней категории 
    kategory.forEach(function(item){
      if (item["parent_id"] === undefined){
        var reqInsert = 'INSERT INTO `category`(`id`, `name`) VALUES (?,?)';
        var param = [item["id"], item["name"]];
        connection.query(reqInsert,param, function (error, results) {
          if (error) throw error;
        });
      } else {
        var reqInsert = 'INSERT INTO `category`(`id`, `name`, `parent_id`) VALUES (?,?,?)';
        var param = [item["id"], item["name"],item["parent_id"]];
        connection.query(reqInsert,param, function (error, results) {
          if (error) throw error;
        });
      }      
    });
    
    //прогонка данных о товарах
    let numRowDoc = 1; // номер строки в документе, с которой начинаются записи
    stFile.forEach(function(item){
      //преобразование даты excel в формат даты mysql
      var date = new Date((item["Последнее обновление"] - 25569) * 86400 * 1000);
      var d = date.getDate();
      var m = date.getMonth() + 1; //Month from 0 to 11
      var y = date.getFullYear();
      var dateStr =  '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
      //

      var reqCall = 'SELECT test(?,?,?,?,?,?,?) as result FROM DUAL';
      var param = [numRowDoc,item["Категория"],item["Наименование товара"],
      item["Количество на складе"],item["Цена"],item["Единица измерения"],dateStr]

      connection.query(reqCall,param, function (error, results) {
        if (error) throw error; 
        /*if(results[0].result == 0){
          console.log("Записано в лог");
        } else {
          console.log("Записано в таблицу");
        }*/
      });      
      
      numRowDoc++;
    });

    
    connection.end();

    return this.appService.getHello();
  }

  //функция для сокращения кода, при выполнение запросов на очистку таблиц без обработки результата 
  sqlReq(connection: any, stringReq : string) : void[]{
    connection.query(stringReq, function (error, results) {
      if (error) throw error;
    });
    return null;
  }
}


