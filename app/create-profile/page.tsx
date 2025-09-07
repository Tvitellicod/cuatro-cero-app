"use client"

import { ProfileCreation } from "@/components/profile-creation"
import { useProfile } from "@/hooks/use-profile"

export default function CreateProfilePage() {
  const { userPlan, setCurrentProfile } = useProfile()

  const handleProfileCreate = (profileData: any) => {
    setCurrentProfile(profileData)
  }

  return <ProfileCreation userPlan={userPlan} onProfileCreate={handleProfileCreate} />
}
