import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { AddTaskPage } from './add-task.page';

const routes: Routes = [
  {
    path: '',
    component: AddTaskPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule, // Ajoutez FormsModule ici
    RouterModule.forChild(routes)
  ],
  declarations: [AddTaskPage]
})
export class AddTaskPageModule { }