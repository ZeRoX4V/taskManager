import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importer FormsModule
import { TaskListPage } from './task-list.page';

const routes: Routes = [
  {
    path: '',
    component: TaskListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule, // Ajouter FormsModule ici
    RouterModule.forChild(routes)
  ],
  declarations: [TaskListPage]
})
export class TaskListPageModule { }