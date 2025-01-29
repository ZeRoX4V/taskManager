import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service'; // Importer le service de notifications
import { ToastController } from '@ionic/angular'; // Importer ToastController


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
  standalone: false,
})
export class TaskListPage implements OnInit {
  tasks: Task[] = []; // Tableau pour stocker les tâches
  filteredTasks: Task[] = []; // Tableau pour stocker les tâches filtrées
  selectStatut: string = ''; // Variable pour stocker le statut sélectionné
  selectPriorite: string = ''; // Variable pour stocker la priorité sélectionnée

  constructor(private taskService: TaskService, private router: Router, private notificationService: NotificationService, private toastController: ToastController) { }

  // Méthode appelée lors de l'initialisation du composant pour charger les tâches
  ngOnInit() {
    // Charge les tâches depuis le service
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filteredTasks = this.tasks;
    });
  }

  // Méthode pour naviguer vers les détails d'une tâche
  viewTaskDetails(taskId: number) {
    this.router.navigate(['/task-details', taskId]);
  }

  // Méthode pour naviguer vers la page d'ajout de tâche
  goToAddTask() {
    this.router.navigate(['/add-task']);
  }

  // Méthode pour supprimer une tâche
  async deleteTask(taskId: number) {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?'); // Afficher la boîte de dialogue de confirmation
    if (confirmDelete) {
      await this.taskService.deleteTask(taskId); // Appeler le service pour supprimer la tâche
      this.Toast('La tâche a été supprimée avec succès.', 'success');
    }
    else {
      this.Toast('La tâche n\'a pas été supprimée', 'danger');
    }
  }

  // Toast pour la suppression d'une tâche
  async Toast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
    });
    await toast.present();
  }

  // Méthode pour changer le statut d'une tâche
  async changeTaskStatut(taskId: number) {
    await this.taskService.changeTaskStatut(taskId); // Appele le service pour changer le statut de la tâche
  }

  // Méthode pour déterminer la couleur du texte en fonction du statut
  getStatutCouleur(statut: string): string {
    switch (statut) {
      case 'A Faire':
        return 'red';
      case 'En Cour':
        return 'orange';
      default:
        return 'black';
    }
  }

  // Méthode pour déterminer la couleur du texte en fonction de la priorité
  getPriotiteCouleur(priorite: string): string {
    switch (priorite) {
      case 'Basse':
        return 'green';
      case 'Moyenne':
        return 'orange';
      case 'Haute':
        return 'red';
      default:
        return 'black';
    }
  }

  // Méthode pour filtrer les tâches en fonction du statut et de la priorité sélectionnés
  async filterTasks() {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesStatut = this.selectStatut ? task.statut === this.selectStatut : true; // Vérifie le statut
      const matchesPriorite = this.selectPriorite ? task.priorite === this.selectPriorite : true; // Vérifie la priorité
      return matchesStatut && matchesPriorite; // Retourne vrai si les deux conditions sont remplies
    });
  }
}