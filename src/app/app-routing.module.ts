import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditTodoComponent } from './edit-todo/edit-todo.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { TodoComponent } from './todo/todo.component';

const routes: Routes = [
  {path: '', component: TodoComponent},
  {path: 'edit/:id', component: EditTodoComponent},
  // {path: 'edit/:id/:label/:quantity', component: EditTodoComponent},
  {path: '**', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
