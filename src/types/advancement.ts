export type ScoutClass = 'Tercera clase' | 'Segunda clase' | 'Primera clase';
/** La app solo usa 'Pendiente' y 'Completado'. 'En proceso' se conserva para leer datos y respaldos anteriores. */
export type ChallengeStatus = 'Pendiente' | 'En proceso' | 'Completado';
export interface Challenge { number:number; category:string; description:string; kind:'Práctico'|'Requisito'; }
export interface ScoutMember { id:string; name:string; patrol:string; currentClass:ScoutClass; joinedAt:string; notes:string; createdAt:string; }
export interface ChallengeEvaluation { id:string; memberId:string; scoutClass:ScoutClass; challengeNumber:number; status:ChallengeStatus; evaluatedAt:string; evaluator:string; observations:string; }
export interface CampParticipant { id:string; name:string; memberId?:string; notes:string; }
export interface CampActivity { id:string; day:string; start:string; end:string; activity:string; responsible:string; materials:string; }
export interface CampExpense { id:string; concept:string; quantity:number; unitCost:number; actualCost:number; }
export interface CampTask { id:string; title:string; responsible:string; done:boolean; due:string; }
export interface CampMenu { id:string; day:string; meal:string; dish:string; ingredients:string; quantityPerPerson:string; }
export interface CampPlan { id:string; name:string; start:string; end:string; location:string; objective:string; description:string; status:string; participants:CampParticipant[]; activities:CampActivity[]; expenses:CampExpense[]; tasks:CampTask[]; shopping:{id:string;item:string;quantity:string;done:boolean}[]; menus:CampMenu[]; evaluation:{wentWell:string;wentWrong:string;problems:string;learnings:string;recommendations:string;agreements:string}; createdAt:string; }
