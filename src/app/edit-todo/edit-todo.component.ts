import { Component, OnInit } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.less']
})
export class EditTodoComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,

    ) { }

  ngOnInit(): void {

    this.getTodo()
  }

  todos: any = JSON.parse(localStorage.getItem('TodoList'));
  newTodo:{id:number, label:string, holdLabel:string, quantity: number, holdQuantity: number, isEdit: boolean;} =
  {
    id: 0,
    label:'',
    holdLabel:'',
    quantity: 0,
    holdQuantity: 0,
    isEdit: false,
  }

  getTodo(){
    let id = this.route.snapshot.paramMap.get('id')

    for (let i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id == id) {
        this.newTodo.id = this.todos[i].id
        this.newTodo.label = this.todos[i].label
        this.newTodo.quantity =this.todos[i].quantity
        console.log(this.newTodo)
      }

    }

  }

  updateTodo(todo:any){
    if (!(this.newTodo.label || this.newTodo.quantity)) {
      alert('Fill the boxes')

    }else{
      for (let i = 0; i < this.todos.length; i++){
        if(this.todos[i].id == todo.id){
          this.todos[i].label = todo.label
          this.todos[i].quantity = todo.quantity
          this.todos[i].isEdit = false;
          todo.holdLabel = this.todos[i].label
          todo.holdQuantity = this.todos[i].quantity

          this.router.navigate(['/'])
        }
      }

      localStorage.setItem("TodoList", JSON.stringify(this.todos))
    }
  }

  cancelTodo(todo:any){
    for (let i = 0; i < this.todos.length; i++)
    if(this.todos[i].id == todo.id){

      this.todos[i].label = todo.holdLabel
      this.todos[i].quantity = todo.holdQuantity
      this.todos[i].isEdit = false;

      console.log(this.todos[i])
  }

    this.router.navigate(['/'])
  }



}
