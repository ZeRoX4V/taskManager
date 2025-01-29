import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
  standalone: false,
})
export class TaskDetailsPage implements OnInit {
  taskForm: FormGroup;
  task: Task | undefined;
  isEditing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.formBuilder.group({
      titre: ['', Validators.required],
      description: [''],
      dateLimite: ['', Validators.required],
      priorite: ['']
    });
  }

  async ngOnInit() {
    const taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.task = await this.taskService.getTaskById(taskId);
    if (this.task) {
      this.taskForm.patchValue({
        titre: this.task.titre,
        description: this.task.description,
        dateLimite: this.task.dateLimite ? new Date(this.task.dateLimite).toISOString() : '',
        priorite: this.task.priorite
      });
    }
  }

  toggleEdit() {
    if (this.isEditing && this.taskForm.valid) {
      const updatedTask = { ...this.task, ...this.taskForm.value };

      const dateLimite = new Date(updatedTask.dateLimite); // Convertir JJ/MM/AAAA en YYYY-MM-DD
      const dateCreation = new Date(this.task?.dateCreation ?? '');

      // Permettre la même date
      if (this.compareDates(dateLimite, dateCreation) || dateLimite > dateCreation) {
        updatedTask.dateLimite = dateLimite;

        this.taskService.updateTask(updatedTask);
        this.task = updatedTask; // Mettre à jour la tâche locale
      } else {
        alert('La date limite ne peut pas être antérieure à la date de création.');
        return;
      }
    } else if (!this.taskForm.valid) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    this.isEditing = !this.isEditing;
  }

  compareDates(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  goBack() {
    this.router.navigate(['/task-list']);
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
        return 'white'; // Couleur par défaut
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

}