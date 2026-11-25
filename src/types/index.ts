export type Theme = 'light' | 'dark';
export type EventCategory = 'Campamento' | 'Actividad Scout' | 'Reunión' | 'Servicio' | 'Capacitación' | 'Evento especial' | 'Personal' | 'Otro';
export type EventStatus = 'Planeado' | 'Confirmado' | 'Realizado' | 'Cancelado';
export interface ChecklistItem { id: string; title: string; quantity: string; category: string; done: boolean; }
export interface ScoutEvent {
  id: string; title: string; category: EventCategory; start: string; end: string;
  location: string; description: string; priority: 'Baja' | 'Media' | 'Alta'; status: EventStatus;
  checklist: ChecklistItem[]; createdAt: string;
}
export interface MaterialTemplate {
  id: string; name: string; description: string; materials: ChecklistItem[];
  createdAt: string; updatedAt: string;
}
export interface ScoutTask { id: string; title: string; due: string; done: boolean; eventId?: string; priority: 'Baja' | 'Media' | 'Alta'; }
export interface JournalNote { id: string; title: string; content: string; category: string; createdAt: string; eventId?: string; }
export type CollectionName = 'events' | 'tasks' | 'notes' | 'templates' | 'scouts' | 'evaluations' | 'camps';
