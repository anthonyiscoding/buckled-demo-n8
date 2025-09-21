import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: Date): string {
  date = new Date(date)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 0) {
    return "Just now"
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hours ago`
  } else {
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }
}

export const getFileDetails = (event: React.ChangeEvent<HTMLInputElement>) => {
  // TODO: For actual file upload will return name + hash
  const files = Array.from(event.target.files || [])
  const names: string[] = []
  files.forEach(f => names.push(f.name))
  return names
}