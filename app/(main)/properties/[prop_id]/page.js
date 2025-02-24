import { getSession } from '@/actions/getCurrentSession'
import React from 'react'
import PropertyInfoClient from './PropertyInfoClient'

const ViewPropertyPage = async () => {

    const session = await getSession()

    if(!session || !session.user) {
      return redirect("/")
    }

  return (
      <>
        <PropertyInfoClient  userId= {session?.user?.usr_id}/>
      </>
  )
}

export default ViewPropertyPage