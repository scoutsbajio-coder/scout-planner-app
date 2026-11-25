import type { ReactNode } from 'react';

export default function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="card empty">
      <div className="icon-wrap">{icon}</div>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
