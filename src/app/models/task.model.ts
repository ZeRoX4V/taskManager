export interface Task {
    id: number;
    titre: string;
    description: string;
    dateLimite: Date;
    dateCreation: Date;
    priorite: 'Basse' | 'Moyenne' | 'Haute';
    statut: 'A Faire' | 'En Cour' | 'Terminé'; // Statuts mis à jour
}
