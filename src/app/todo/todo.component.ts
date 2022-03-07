import { Component, ElementRef, OnInit } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';
import { ViewChild } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.less'],
})
export class TodoComponent implements OnInit {
  ngOnInit() {
    this.getTodo();

  }
  @ViewChild('uploadCsv') fileImportInput: ElementRef;

  title = 'Grocery List';
  todos: any[] = [];
  checkedboxArr: any[] = [];
  csvDataArr: any[] = [];

  header = true;
  isChecked: boolean;
  bulkSelect: Boolean;
  newTodo: {
    id: number;
    checked: boolean;
    label: string;
    holdLabel: string;
    quantity: number;
    holdQuantity: number;
    isEdit: boolean;
  } = {
    id: 0,
    label: '',
    holdLabel: '',
    quantity: 0,
    holdQuantity: 0,
    isEdit: false,
    checked: false,
  };

  addTodo(newTodo: {label: string; quantity: number }) {
    if (!(this.newTodo.label && this.newTodo.quantity)) {
      alert('Fill todo');
    } else {
      this.todos.push(newTodo);
      this.todos.forEach((todo, index) => {
        todo.id = index + 1;
      });
      this.newTodo.holdLabel = this.newTodo.label;
      this.newTodo.holdQuantity = this.newTodo.quantity;

      this.newTodo = {
        id: 0,
        label: '',
        holdLabel: '',
        quantity: 0,
        holdQuantity: 0,
        isEdit: false,
        checked: false,
      };

      localStorage.setItem('TodoList', JSON.stringify(this.todos));
    }
  }

  getTodo() {
    if (localStorage.getItem('TodoList') === null) {
      alert('fillings');
    } else {
      this.todos = JSON.parse(localStorage.getItem('TodoList'));
    }
  }

  editTodo(todo: any) {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id == todo.id) {
        this.todos[i].isEdit = true;
      }
    }
  }

  cancelTodo(todo: any) {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id == todo.id) {
        this.todos[i].isEdit = false;
        this.todos[i].label = todo.holdLabel;
        this.todos[i].quantity = todo.holdQuantity;
      }
    }
  }

  updateTodo(todo: any) {
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id == todo.id) {
        this.todos[i].isEdit = false;
        todo.holdLabel = this.todos[i].label;
        todo.holdQuantity = this.todos[i].quantity;
      }

      console.log(this.todos);
      localStorage.setItem('TodoList', JSON.stringify(this.todos));
    }
  }

  deleteTodo(todo: any) {
    let index = this.todos.indexOf(todo);
    this.todos.splice(index, 1);
    localStorage.setItem('TodoList', JSON.stringify(this.todos));
  }

  onCheck(event: any, todo: any) {
    let maxItem = 1;
    if (event.target.checked) {
      this.checkedboxArr.push(todo);
      // if (this.checkedboxArr.length > maxItem) {
      //   this.checkedboxArr[0].checked = false;
      //   this.checkedboxArr.splice(0, 1);
      // }
    } else {
      for (let i = 0; i < this.checkedboxArr.length; i++) {
        if (this.checkedboxArr[i] === todo) {
          this.checkedboxArr.splice(i, 1);
        }
      }
      //   // let remove = this.checkedboxArr.indexOf(todo)
      //   // this.checkedboxArr.splice(remove, 1)
      //   // this.isChecked = false
    }

    // if(event.target.checked){
    //   this.isChecked = true;
    //   this.checkedboxArr.push(todo)

    // }else{
    //   this.isChecked = false;
    //   let remove = this.checkedboxArr.indexOf(todo)
    //   this.checkedboxArr.splice(remove, 1)
    // }

    this.checkedboxArr.forEach((todo, index) => {
      todo.id = index + 1;
    });

    if (this.checkedboxArr.length === 0) {
      this.isChecked = false;
      this.bulkSelect = false;
    } else {
      this.isChecked = true;
    }
    localStorage.setItem('CheckedBox', JSON.stringify(this.checkedboxArr));
  }

  onBulkSelect($event: any) {
    if ($event.target.checked) {
      this.bulkSelect = true;
      this.isChecked = true;
      this.todos.forEach((e) => {
        this.checkedboxArr.push(e);
      });
    } else {
      this.bulkSelect = false;
      this.isChecked = false;
      this.checkedboxArr = [];
    }

    localStorage.setItem('CheckedBox', JSON.stringify(this.checkedboxArr));
  }

  onCheckForIndex(todo: any) {
    let index = null;
    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id == todo.id) index = i;
    }

    return index;
  }

  multipleDelete() {
    this.checkedboxArr.forEach((e) => {
      if (this.onCheckForIndex(e) != null) {
        this.todos.splice(this.onCheckForIndex(e), 1);
      }
    });

    this.isChecked = false;
    this.bulkSelect = false;
    this.checkedboxArr = [];

    localStorage.setItem('CheckedBox', JSON.stringify(this.checkedboxArr));
    localStorage.setItem('TodoList', JSON.stringify(this.todos));
  }

  exportCsv() {
    let data = this.todos;

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'Grocery_List',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['S/N', 'LABEL', 'HOLD LABEL', 'QUANTITY', 'HOLD QUANTITY', 'EDITING']
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);
  }

  constructor(private ngxCsvParser: NgxCsvParser, private router: Router) {}

  // Your applications input change listener for the CSV File
  fileChangeListener($event: any): void {
    // Select the files from the event
    const files = $event.srcElement.files;

    // Parse the file you want to select for the operation along with the configuration
    this.ngxCsvParser
      .parse(files[0], { header: this.header, delimiter: ',' })
      .pipe()
      .subscribe(
        (result: Array<any>) => {
          console.log('Result', result);
          this.csvDataArr = result;
          this.importCsv();
        },
        (error: NgxCSVParserError) => {
          console.log('Error', error);
        }
      );

  }

  importCsv() {
    for (let i = 0; i < this.csvDataArr.length; i++) {
      let csv = this.csvDataArr[i];
      let csvData: any = {};

      csvData.id = csv.id;
      csvData.label = csv.label;
      csvData.holdLabel = csv.holdLabel;
      csvData.quantity = csv.quantity;
      csvData.holdQuantity = csv.holdQuantity;

      if (csv.isEdit == 'FALSE' || csv.checked == 'FALSE') {
        csvData.isEdit = false;
        csvData.checked = false;
      } else {
        csvData.isEdit = true;
        csvData.checked = true;
      }

      this.todos.push(csvData);
      this.todos.forEach((csv, index) => {
        csv.id = index + 1;
      });
    }
    localStorage.setItem('TodoList', JSON.stringify(this.todos));
    console.log(this.todos);

    this.fileImportInput.nativeElement.value = null;
    this.csvDataArr = [];
    console.log(this.fileImportInput.nativeElement.value )
  }
}
