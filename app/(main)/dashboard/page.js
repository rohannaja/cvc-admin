"use client";

import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { DateTime } from "luxon";

// styles
import dashboard from "./dashboard.module.css";
import { useQueryProcessor } from '@/hooks/useTanstackQuery';
import { formatToDecimal } from '@/lib/numberFormatter';

// assets

export default function Dashboard() {
  const { data: session, status} = useSession();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [initialDateTime, setInitialDateTime] = useState(null); // Store initial time from server  
  
  useEffect(() => {
    // Set initial date and time when authenticated
    if (status === 'authenticated') {
      setDate(DateTime.now().toLocaleString(DateTime.DATE_HUGE));
      setTime(DateTime.now().toLocaleString(DateTime.TIME_SIMPLE));
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      // Determine the API URL based on the environment
       

      // Fetch data from the server
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/datetime`)
        .then(response => response.json())
        .then(data => {
          const serverDateTime = DateTime.fromISO(data.datetime); // Parse the datetime from the server
          setInitialDateTime(serverDateTime); // Store the initial server datetime
          setDate(serverDateTime.toLocaleString(DateTime.DATE_HUGE)); // Set the date
          setTime(serverDateTime.toLocaleString(DateTime.TIME_SIMPLE)); // Set the initial time
        })
        .catch(error => {
          console.error('Error fetching date and time:', error);
        });
    }
  }, [status]);

  useEffect(() => {
    // Only start real-time updates if initialDateTime has been set
    if (!initialDateTime) return;

    // Update the time every 10 seconds
    const interval = setInterval(() => {
      const updatedDateTime = initialDateTime.plus({ seconds: 10 }); // Add 10 seconds to initial time
      setTime(updatedDateTime.toLocaleString(DateTime.TIME_SIMPLE)); // Update the time
      setInitialDateTime(updatedDateTime); // Update the initial time reference
    }, 10000); // Run every 10 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [initialDateTime]);

  const {data, status:dashboardStatus} = useQueryProcessor({
    url:`/admin/dashboard`,
    key:['dashboard','admin'],
  })


  // Show a loading state while authentication is being checked
  if (status === "loading" || dashboardStatus === "pending") {
    return <p>Loading...</p>;
  }  

  // The user should be authenticated at this point
  // You can proceed to render the dashboard UI
  return (
    <div className={dashboard.main_content_container}>
      <div className={dashboard.main_hero_container}>
        <h3 className={dashboard.hero_head}>
          Welcome {session.user.username}!
        </h3>
        <h6 className={dashboard.hero_info}>{date} | {time}</h6>
      </div>

      <div className={dashboard.main_content_row_div}>
        <div className={dashboard.main_stats_div}>
          <h6 className={dashboard.stats_head}>Total Collections for Month</h6>
          <div className={dashboard.stats_info_div}>
            <h3 className={dashboard.stats_info + ``}>{formatToDecimal(data.completed)}</h3>
          </div>
        </div>

        <div className={dashboard.main_stats_div}>
          <h6 className={dashboard.stats_head}>Remaining Collectibles</h6>
          <div className={dashboard.stats_info_div}>
            <h3 className={dashboard.stats_info}>{formatToDecimal(data.pending)}</h3>
          </div>
        </div>
      </div>

      <div className={dashboard.main_content_row_div}>
        <div className={dashboard.main_list_div}>
          <h6 className={dashboard.list_head}>Village Reports</h6>
          <div className={dashboard.list_info_div}>
            <h6 className={dashboard.list_info}>No data to display...</h6>
          </div>
        </div>

        <div className={dashboard.main_list_div}>
          <h6 className={dashboard.list_head}>System Reports</h6>
          <div className={dashboard.list_info_div}>
            <h6 className={dashboard.list_info}>No data to display...</h6>
          </div>
        </div>
      </div>
    </div>
  );
}