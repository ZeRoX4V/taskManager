import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs'; // Importer BehaviorSubject

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private tasks: Task[] = [];
    private nextId = 1;
    private tasksSubject = new BehaviorSubject<Task[]>([]); // Créer un BehaviorSubject

    constructor(private storage: Storage) {
        this.init();
    }

    async init() {
        try {
            await this.storage.create();
            await this.loadTasks();
        } catch (error) {
            console.error('Initialisation du stockage impossible :', error);
        }
    }

    async loadTasks() {
        try {
            const storedTasks = await this.storage.get('tasks');
            if (storedTasks) {
                this.tasks = storedTasks;
                this.nextId = this.tasks.length ? Math.max(...this.tasks.map(task => task.id)) + 1 : 1;
                this.tasksSubject.next(this.tasks);
            }
        } catch (error) {
            console.error('Chargement des tâches impossible :', error);
        }
    }

    getTasks() {
        return this.tasksSubject.asObservable(); // Retourner un Observable
    }

    async addTask(task: Task): Promise<void> {
        try {
            task.id = this.nextId++;
            task.dateCreation = new Date();
            task.statut = 'A Faire'; // Initialiser le statut
            this.tasks.push(task);
            await this.storage.set('tasks', this.tasks);
            this.tasksSubject.next(this.tasks); // Émettre les tâches mises à jour
        } catch (error) {
            console.error('Ajout de la tâche impoossible:', error);
        }
    }

    async updateTask(updatedTask: Task): Promise<void> {
        try {
            const index = this.tasks.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                this.tasks[index] = updatedTask;
                await this.storage.set('tasks', this.tasks);
                this.tasksSubject.next(this.tasks); // Émettre les tâches mises à jour
            }
        } catch (error) {
            console.error('Mise à jour de la tâche impossible :', error);
        }
    }

    async deleteTask(id: number): Promise<void> {
        try {
            this.tasks = this.tasks.filter(task => task.id !== id);
            await this.storage.set('tasks', this.tasks);
            this.tasksSubject.next(this.tasks); // Émettre les tâches mises à jour
        } catch (error) {
            console.error('Suppression de la tâche impossible:', error);
        }
    }

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
            console.error('Changement de statut de la tâche impossible :', error);
        }
    }

    async getTaskById(id: number): Promise<Task | undefined> {
        try {
            return this.tasks.find(task => task.id === id);
        } catch (error) {
            console.error('Récupération de la tâche par ID impossible:', error);
            return undefined;
        }
    }
}