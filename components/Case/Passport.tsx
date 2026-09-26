import type { Project } from '@/lib/content/projects'
import s from './Case.module.css'

export function Passport({ project }: { project: Project }) {
  const parts = [String(project.year), project.role, project.team, project.duration, project.tags.join(', ')]
  return <p className={`ui ${s.passport}`}>{parts.filter(Boolean).join(' · ')}</p>
}
