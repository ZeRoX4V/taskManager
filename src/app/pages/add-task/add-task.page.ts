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
  taskForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.formBuilder.group({
      titre: ['', Validators.required],
      description: [''],
      dateLimite: ['', Validators.required],
      priorite: ['Basse']
    });
  }

  async addTask() {
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value;
      // Convertir la date limite en objet Date
      const dateLimite = new Date(task.dateLimite); // Convertir JJ/MM/AAAA en objet Date
      const dateCreation = new Date(); // La date de création est maintenant

      // Comparer les dates
      if (this.compareDates(dateLimite, dateCreation) || dateLimite > dateCreation) {
        // Ajouter la tâche
        await this.taskService.addTask({
          ...task,
          dateCreation: dateCreation, // Ajouter la date de création
          dateLimite: dateLimite // Mettre à jour la date limite avec l'objet Date
        });
        this.router.navigate(['/task-list']); // Rediriger vers la liste des tâches
      }
      else {
        alert('La date limite ne peut pas être antérieure à la date de création.');
        return;
      }
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }

  compareDates(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

}