import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
  standalone: false,
})
export class TaskListPage implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectStatut: string = '';
  selectPriorite: string = '';

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks; // Mettre à jour les tâches
      this.filteredTasks = this.tasks; // Initialiser avec toutes les tâches
    });
  }

  viewTaskDetails(taskId: number) {
    this.router.navigate(['/task-details', taskId]);
  }

  goToAddTask() {
    this.router.navigate(['/add-task']);
  }

  async deleteTask(taskId: number) {
    await this.taskService.deleteTask(taskId);
  }

  async changeTaskStatut(taskId: number) {
    await this.taskService.changeTaskStatut(taskId);
  }

  getStatutCouleur(statut: string): string {
    switch (statut) {
      case 'A Faire':
        return 'red'; // Rouge
      case 'En Cour':
        return 'orange'; // Jaune
      case 'Terminé':
        return 'green'; // Vert
      default:
        return 'whie'; // Couleur par défaut
    }
  }

  getPriotiteCouleur(statut: string): string {
    switch (statut) {
      case 'Basse':
        return 'green'; // Rouge
      case 'Moyenne':
        return 'orange'; // Jaune
      case 'Haute':
        return 'red'; // Vert
      default:
        return 'whie'; // Couleur par défaut
    }
  }

  async filterTasks() {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesStatut = this.selectStatut ? task.statut === this.selectStatut : true;
      const matchesPriorite = this.selectPriorite ? task.priorite === this.selectPriorite : true;
      return matchesStatut && matchesPriorite;
    });
  }
}