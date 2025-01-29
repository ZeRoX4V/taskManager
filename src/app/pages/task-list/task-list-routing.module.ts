import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'task-list', pathMatch: 'full' },
  { path: 'task-list', loadChildren: () => import('./task-list.module').then(m => m.TaskListPageModule) },
  { path: 'add-task', loadChildren: () => import('../add-task/add-task.module').then(m => m.AddTaskPageModule) },
  { path: 'task-details/:id', loadChildren: () => import('../task-details/task-details.module').then(m => m.TaskDetailsPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }