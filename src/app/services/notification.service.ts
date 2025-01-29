import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';




@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
    this.init();

  }

  async init() {
    await LocalNotifications.requestPermissions(); // // Demander la permission pour les notifications
    await this.setupAppListeners(); // Configurer les écouteurs d'événements de l'application
  }


  // Méthode pour envoyer une notification simple
  async sendNotification() {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Vous avez des tâches à terminer',
          body: 'Certaines de vos tâches ne sont pas encore terminées',
          id: 1,
          schedule: { at: new Date(Date.now() + 1000 * 5) }, // Delai de 5 sec
        }
      ]
    });
  }

  // Méthode pour configurer les écouteurs d'événements de l'application afin d'envouyer un notification quand l'applis ce ferme
  setupAppListeners() {
    App.addListener('appStateChange', (state) => {
      if (!state.isActive) {
        this.sendNotification();
      }
    });
  }
}