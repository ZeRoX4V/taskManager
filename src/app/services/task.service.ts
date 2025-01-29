import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';



@Injectable({
    providedIn: 'root' // Indique que ce service est disponible dans toute l'application
})
export class TaskService {
    private tasks: Task[] = []; // Tableau pour stocker les tâches
    private nextId = 1; // ID de la prochaine tâche à ajouter
    private tasksSubject = new BehaviorSubject<Task[]>([]); // listener

    constructor(private storage: Storage) {
        this.init();
    }

    // Méthode pour initialiser le service
    async init() {
        try {
            await this.storage.create(); // Créer le stockage
            await this.loadTasks(); // Charger les tâches existantes
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du stockage:', error);
            // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
        }
    }

    // Méthode pour charger les tâches depuis le stockage
    async loadTasks() {
        try {
            const storedTasks = await this.storage.get('tasks'); // Récupérer les tâches stockées
            if (storedTasks) {
                this.tasks = storedTasks; // Met à jour le tableau de tâches
                this.nextId = this.tasks.length ? Math.max(...this.tasks.map(task => task.id)) + 1 : 1;// Détermine le prochain ID à utiliser
                this.tasksSubject.next(this.tasks); // observable
            }
        } catch (error) {
            console.error('Erreur lors du chargement des tâches:', error);
        }
    }

    // Méthode pour obtenir un Observable des tâches
    getTasks() {
        return this.tasksSubject.asObservable(); // Retourne un Observable des tâches
    }

    // Méthode pour ajouter une nouvelle tâche
    async addTask(task: Task): Promise<void> {
        try {
            task.id = this.nextId++; // Assigne un ID à la tâche
            task.dateCreation = new Date(); // Défini la date de création
            task.statut = 'A Faire'; // Initialise le statut de la tâche
            this.tasks.push(task); // Ajoute la tâche au tableau
            await this.storage.set('tasks', this.tasks); // Enregistre la tâche dans le stockage
            this.tasksSubject.next(this.tasks); // observable
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la tâche:', error);
            // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
        }
    }

    // Méthode pour mettre à jour une tâche existante
    async updateTask(updatedTask: Task): Promise<void> {
        try {
            const index = this.tasks.findIndex(task => task.id === updatedTask.id); // Trouve l'index de la tâche à mettre à jour
            if (index !== -1) {
                this.tasks[index] = updatedTask; // Met à jour la tâche
                await this.storage.set('tasks', this.tasks); // Enregistre la tâche mises à jour dans le stockage
                this.tasksSubject.next(this.tasks); // observable
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la tâche:', error);
        }
    }

    // Méthode pour supprimer une tâche par son ID
    async deleteTask(id: number): Promise<void> {
        try {
            this.tasks = this.tasks.filter(task => task.id !== id); // Filtre la tâche à supprimer
            await this.storage.set('tasks', this.tasks); // On enregistre les tâches dans le storage 
            this.tasksSubject.next(this.tasks); // observable
        } catch (error) {
            console.error('Erreur lors de la suppression de la tâche:', error);

        }
    }

    // Méthode pour changer le statut d'une tâche
    async changeTaskStatut(id: number): Promise<void> {
        try {
            const task = await this.getTaskById(id);
            if (task) {
                if (task.statut === 'A Faire') {
                    task.statut = 'En Cour';
                } else if (task.statut === 'En Cour') {
                    task.statut = 'Terminé';
                }
                await this.updateTask(task);
            }
        } catch (error) {
            console.error('Erreur lors du changement de statut de la tâche:', error);

        }
    }

    // Méthode pour récupérer une tâche par son ID
    async getTaskById(id: number): Promise<Task | undefined> {
        try {
            return this.tasks.find(task => task.id === id);
        } catch (error) {
            console.error('Erreur lors de la récupération de la tâche par ID:', error);
            return undefined;
        }
    }

}