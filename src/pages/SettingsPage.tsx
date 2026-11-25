import { Download, Upload, Settings, SunMoon, Database } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import InstallSection from '../components/InstallSection';
import StorageSection from '../components/StorageSection';
import { BackupStatusLine } from '../components/BackupReminder';
import { exportBackup } from '../services/backup';
import { markBackup } from '../services/backupState';
import { useTheme } from '../hooks/useTheme';
import { getAll, replaceAllCollections } from '../services/db';
import type { JournalNote, MaterialTemplate, ScoutEvent, ScoutTask } from '../types';

export default function SettingsPage(){
 const {theme,toggle}=useTheme();
 const exportData=async()=>{await exportBackup();};
 const exportCSV=async(store:'events'|'tasks')=>{const rows=await getAll<ScoutEvent|ScoutTask>(store);const keys=store==='events'?['title','category','start','end','location','status','priority','description']:['title','due','done','priority','eventId'];const csv=[keys.join(','),...rows.map(row=>keys.map(k=>{const value=(row as unknown as Record<string,unknown>)[k]??'';return `"${String(value).replace(/"/g,'""')}"`;}).join(','))].join('\r\n');const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`scout-planner-${store}-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);};
 const importData=async(file?:File)=>{
  if(!file)return;
  try{
   const data:unknown=JSON.parse(await file.text());
   if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Formato incorrecto');
   const backup=data as Record<string,unknown>;
   const valid=(key:string,required=true)=>{
    const value=backup[key];
    if(value===undefined&&!required)return true;
    if(!Array.isArray(value))return false;
    const ids=new Set<string>();
    return value.every((item:unknown)=>{
     if(!item||typeof item!=='object'||typeof (item as {id?:unknown}).id!=='string')return false;
     const id=(item as {id:string}).id;
     if(ids.has(id))return false;
     ids.add(id);return true;
    });
   };
   if(!valid('events')||!valid('tasks')||!valid('notes')||!valid('templates',false)||!valid('scouts',false)||!valid('evaluations',false)||!valid('camps',false))throw new Error('Formato incorrecto');
   if(!confirm('La importación reemplazará las colecciones incluidas en el respaldo. Las colecciones nuevas ausentes en respaldos antiguos se conservarán sin cambios. Antes de continuar, asegúrate de tener un respaldo reciente. ¿Deseas continuar?'))return;
   const collections:Parameters<typeof replaceAllCollections>[0]={events:backup.events as ScoutEvent[],tasks:backup.tasks as ScoutTask[],notes:backup.notes as JournalNote[]};if(Array.isArray(backup.templates))collections.templates=backup.templates as MaterialTemplate[];if(Array.isArray(backup.scouts))collections.scouts=backup.scouts as any[];if(Array.isArray(backup.evaluations))collections.evaluations=backup.evaluations as any[];if(Array.isArray(backup.camps))collections.camps=backup.camps as any[];await replaceAllCollections(collections);if(Object.keys(collections).length===7)markBackup();
   alert('Respaldo importado correctamente. La información se actualizó de forma segura.');
  }catch(error){
   alert(error instanceof Error&&error.message==='Formato incorrecto'?'El archivo no tiene la estructura de un respaldo válido o contiene identificadores duplicados.':'No se pudo importar. No se aplicaron cambios si la transacción falló. Verifica el archivo e inténtalo de nuevo.');
  }
 };
 return <><PageHeader title="Configuración" subtitle="Personaliza la aplicación y protege tu información."/><div className="settings-list"><section className="card settings-section"><div className="settings-icon"><SunMoon/></div><div className="settings-content"><h2>Apariencia</h2><p>Elige cómo quieres ver Scout Planner.</p><div className="setting-control"><span>Tema actual: {theme==='dark'?'Oscuro':'Claro'}</span><button className="button" onClick={toggle}>Cambiar tema</button></div></div></section><InstallSection/><StorageSection/><section className="card settings-section"><div className="settings-icon"><Database/></div><div className="settings-content"><h2>Respaldo de información</h2><p>Exporta eventos, tareas, bitácora, plantillas, campamentos, participantes, adelanto y evaluaciones. Los respaldos anteriores también se pueden importar.</p><BackupStatusLine/><div className="setting-control"><button className="button primary" onClick={()=>void exportData()}><Download size={16}/> Exportar respaldo JSON</button><label className="button upload-button"><Upload size={16}/> Importar respaldo<input type="file" accept="application/json,.json" onChange={e=>{void importData(e.target.files?.[0]);e.currentTarget.value='';}}/></label></div><div className="setting-control"><button className="button" onClick={()=>void exportCSV('events')}>Exportar eventos CSV</button><button className="button" onClick={()=>void exportCSV('tasks')}>Exportar tareas CSV</button></div></div></section><section className="card settings-section"><div className="settings-icon"><Settings/></div><div className="settings-content"><h2>Acerca de Scout Planner</h2><p>Tu herramienta personal para planear actividades Scout, organizar materiales y conservar tus experiencias.</p><span className="version-label">Datos guardados localmente en este dispositivo · Sin sincronización remota</span></div></section></div></>;
}
