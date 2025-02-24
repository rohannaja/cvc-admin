// app/dashboard/layout.js

import compstyle from '@/app/components.module.css';
import Sidebar from "./components/sidebar.js";
import Header from "./components/header.js";
import { redirect } from 'next/navigation';
import { getSession } from '@/actions/getCurrentSession.js';

export const metadata = {
  title: "CVConnect | Admin - Change Password",
  description: "Integrated solutions for record management.",
};

export default async function ProfileLayout({ children }) {
  const session = await getSession()

  if (!session) {
    redirect('/');
  }

  return (
      <main className={compstyle.main_container}>
        <div className={compstyle.main_ui_container}>
            {children}
        </div>
      </main>
  );
}