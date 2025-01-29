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
  taskForm: FormGroup; // Formulaire pour modifier les détails de la tâche
  task: Task | undefined; // Tâche à afficher/modifier
  isEditing: boolean = false; // Indicateur pour savoir si nous sommes en mode édition

  constructor(
    private formBuilder: FormBuilder, // Service pour construire le form
    private route: ActivatedRoute, // Service pour accéder aux paramètres de la route pour récupérer l'id
    private taskService: TaskService,
    private router: Router,
  ) {
    // Initialisation du formulaire avec des contrôles sur la dateLimite et le titre
    this.taskForm = this.formBuilder.group({
      titre: ['', Validators.required],
      description: [''],
      dateLimite: ['', Validators.required],
      priorite: ['']
    });
  }

  // Méthode appelée lors de l'initialisation du composant
  async ngOnInit() {
    const taskId = Number(this.route.snapshot.paramMap.get('id')); // Récupére l'ID de la tâche depuis les paramètres de l'URL
    this.task = await this.taskService.getTaskById(taskId); // Charger la tâche en fonction de l'id

    if (this.task) {
      // Si la tâche existe, rempli le formulaire avec les détails de la tâche
      this.taskForm.patchValue({
        titre: this.task.titre,
        description: this.task.description,
        dateLimite: this.task.dateLimite ? new Date(this.task.dateLimite).toISOString() : '', // Convertir en format ISO
        priorite: this.task.priorite
      });
    }
  }

  // Méthode pour basculer entre le mode édition et le mode affichage
  toggleEdit() {
    if (this.isEditing && this.taskForm.valid) {
      const updatedTask = { ...this.task, ...this.taskForm.value }; // Créer un nouvel objet tâche avec les valeurs du formulaire

      const dateLimite = new Date(updatedTask.dateLimite); // Convertir la date limite en objet Date
      const dateCreation = new Date(this.task?.dateCreation ?? ''); // Récupérer la date de création

      // Vérifier si la date limite est valide
      if (this.compareDates(dateLimite, dateCreation) || dateLimite > dateCreation) {
        updatedTask.dateLimite = dateLimite; // Met à jour la date limite

        this.taskService.updateTask(updatedTask); // Appele le service pour mettre à jour la tâche
        this.task = updatedTask; // Met à jour la tâche affichée
      } else {
        alert('La date limite ne peut pas être antérieure à la date de création.'); // Alerte si la date limite est invalide
        return;
      }
    } else if (!this.taskForm.valid) {
      alert('Veuillez remplir tous les champs obligatoires.'); // Alerte si le formulaire n'est pas valide
      return;
    }
    this.isEditing = !this.isEditing; // Basculer l'état d'édition
  }

  // Méthode pour comparer deux dates
  compareDates(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  // Méthode pour naviguer vers la liste des tâches
  goBack() {
    this.router.navigate(['/task-list']);
  }

  // Méthode pour déterminer la couleur du texte en fonction du statut
  getStatutCouleur(statut: string): string {
    switch (statut) {
      case 'A Faire':
        return 'red';
      case 'En Cour':
        return 'orange';
      case 'Terminé':
        return 'green';
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
}