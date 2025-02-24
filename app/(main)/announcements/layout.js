// app/dashboard/layout.js

import compstyle from '@/app/components.module.css';
import Sidebar from "./components/sidebar.js";
import Header from "./components/header.js";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route.js';
import { redirect } from 'next/navigation';
import { Providers } from "../../providers.js";

export const metadata = {
  title: "CVConnect | Admin - Dashboard",
  description: "Integrated solutions for record management.",
};

export default async function AnnouncementsLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
      <main className={compstyle.main_container}>
        <Sidebar />
        <div className={compstyle.main_ui_container}>
          <Header userSession={session}/>
          <Providers session={session}>
            {children}
          </Providers>
        </div>
      </main>
  );
}