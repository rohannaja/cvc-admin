import { getSession } from '@/actions/getCurrentSession';
import React from 'react'
import WalletClient from './components/WalletClient';
import { redirect } from 'next/navigation';

async function page() {

  const session = await getSession()
  console.log(session)

  if (!session) {
    redirect('/');
  }

  return (
    <>
      <WalletClient userId={session?.user?.usr_id} />
    </>
  )
}

export default page