import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
  standalone: false,
})
export class AddTaskPage {
  taskForm: FormGroup; // Formulaire pour ajouter une nouvelle tâche

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {
    // Initialisation du formulaire avec des contrôles sur la dateLimite et le titre
    this.taskForm = this.formBuilder.group({
      titre: ['', Validators.required],
      description: [''],
      dateLimite: ['', Validators.required],
      priorite: ['Basse']
    });
  }

  // Méthode pour ajouter une nouvelle tâche
  async addTask() {
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value; // Récupérer les valeurs du formulaire

      const dateLimite = new Date(task.dateLimite);  // Converti la date limite en objet Date
      const dateCreation = new Date(); // récupère la date du jour

      // Compare les dates pour pas que la date limite soit inférieur a la date de creation
      if (this.compareDates(dateLimite, dateCreation) || dateLimite > dateCreation) {
        // Ajoute la tâche
        await this.taskService.addTask({
          ...task,
          dateCreation: dateCreation, // Ajouter la date de création
          dateLimite: dateLimite // Met à jour la date limite avec l'objet Date
        });
        this.router.navigate(['/task-list']); // Redirige vers la liste des tâches
      } else {
        alert('La date limite ne peut pas être antérieure à la date de création.');
        return;
      }
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  // Méthode pour comparer deux dates
  compareDates(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }
}