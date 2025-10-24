// /lib/storage.ts

export type UserProfile = {
  id: number
  name: string
  category: string
  createdAt: string
}

export const saveProfileForEmail = (email: string, profile: UserProfile) => {
  if (!email) return
  const key = `profiles_${email}`
  const existing = JSON.parse(localStorage.getItem(key) || "[]")
  existing.push(profile)
  localStorage.setItem(key, JSON.stringify(existing))
}

export const getProfilesForEmail = (email: string): UserProfile[] => {
  if (!email) return []
  const key = `profiles_${email}`
  return JSON.parse(localStorage.getItem(key) || "[]")
}

export const deleteProfileForEmail = (email: string, id: number) => {
  const key = `profiles_${email}`
  const profiles = JSON.parse(localStorage.getItem(key) || "[]")
  const updated = profiles.filter((p: UserProfile) => p.id !== id)
  localStorage.setItem(key, JSON.stringify(updated))
}
