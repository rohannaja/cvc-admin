"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// styles
import accounts from "./accounts.module.css";

// assets

// components
import AccountListItem from "./components/AccountListItem";


export default function Accounts() {
  const [users, setUsers] = useState([]); // State to store the user data

  // Fetch data when the component is mounted
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Determine the API URL based on the environment
          // Default to localhost if no environment variable is set

        

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users`); // Call your API
        const data = await response.json(); // Parse the JSON response
        setUsers(data); // Store the data in state
      } catch (error) {
        console.error('Error fetching users:', error); // Handle any errors
      }
    };

    fetchUsers(); // Trigger the fetch when the component mounts
  }, []); // The empty dependency array ensures this only runs on initial render

  return (
    <div className={accounts.main_content_container}>

      <div className={accounts.main_cta_row}>
        <div className={accounts.cta_filter_div}>
          <Link href="/accounts" className={`${accounts.cta_filt_btn} ${accounts.cta_filt_active_btn}`}>
            All
          </Link>

          <Link href="/accounts" className={`${accounts.cta_filt_btn}`}>
            Officer
          </Link>

          <Link href="/accounts" className={`${accounts.cta_filt_btn}`}>
            Homeowner
          </Link>
        </div>

        <div className={accounts.cta_pagination_div}>

        </div>

        <Link href="/accounts">
          <div className={accounts.cta_search_div}>
            
          </div>
        </Link>

        <Link href="/accounts/new-account" className={accounts.cta_newacc_btn}>
          New Account
        </Link>
      </div>

      <div className={accounts.main_list_container}>

        <div className={accounts.main_list_label_div}>
          <div className={accounts.list_label_photo_div}>
            
          </div>
          <div className={accounts.list_label_name_div}>
            <p className={accounts.list_label_name}>FULL NAME</p>
          </div>
          <div className={accounts.list_label_role_div}>
            <p className={accounts.list_label_role}>ROLE</p>
          </div>
          <div className={accounts.list_label_cta_div}>
            
          </div>
        </div>

        {/* Check if users data is available and map through it */}
        {users.length > 0 ? (
          users.map((user) => (
            <AccountListItem key={user.usr_id} userInfo={user} />
          ))
        ) : (
          <p>No users available</p> // Fallback message if no users are found
        )}
      </div>

    </div>
  );
}
