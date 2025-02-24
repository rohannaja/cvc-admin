import React from 'react'
import ProfileClient from './components/ProfileClient'
import { getSession } from '@/actions/getCurrentSession'

const ProfilePage = async () => {
    const session = await getSession()

    console.log(session)
  return (
    <>
      <ProfileClient userId= {session?.user?.usr_id}/>
    </>
  )
}

export default ProfilePage
