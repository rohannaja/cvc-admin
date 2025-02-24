"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

// styles
import transactions from "./transactions.module.css";

// assets

// components
import TransactionItem from "./components/TransactionItem.js";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";


export default function Accounts() {
  // const [transactionData, setTransactionData] = useState([]); // State to store the user data


  const {data: transactionData, status} = useQueryProcessor({
    url:`/admin/transactions`,
    key:['transactions'],
    options: {
      staleTime:0
    }
  })
  // Fetch data when the component is mounted
  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     try {
  //       // Determine the API URL based on the environment
  //         // Default to localhost if no environment variable is set

  //       if (process.env.NEXT_PUBLIC_URL_DEF === 'test') {
  //       apiUrl = process.env.NEXT_PUBLIC_URL_TEST;
  //       } else if (process.env.NEXT_PUBLIC_URL_DEF === 'dev') {
  //       apiUrl ;
  //       } else if (process.env.NEXT_PUBLIC_URL_DEF === 'production') {
  //       apiUrl = process.env.NEXT_PUBLIC_URL_PROD;
  //       }

  //       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/transactions`); // Call your API
  //       const data = await response.json(); // Parse the JSON response
  //       setTransactionData(data); // Store the data in state
  //     } catch (error) {
  //       console.error('Error fetching users:', error); // Handle any errors
  //     }
  //   };

  //   fetchTransactions(); // Trigger the fetch when the component mounts
  // }, []); // The empty dependency array ensures this only runs on initial render

  if(status === "pending") return <div>loading...</div>
  return (
    <div className={transactions.main_content_container}>

      <div className={transactions.main_cta_row}>
        <div className={transactions.cta_filter_div}>
          <Link href="/transactions" className={`${transactions.cta_filt_btn} ${transactions.cta_filt_active_btn}`}>
            All
          </Link>

          <Link href="/transactions" className={`${transactions.cta_filt_btn}`}>
            Partial
          </Link>

          <Link href="/transactions" className={`${transactions.cta_filt_btn}`}>
            Full
          </Link>

          <Link href="/transactions" className={`${transactions.cta_filt_btn}`}>
            Advanced
          </Link>

          <Link href="/transactions" className={`${transactions.cta_filt_btn}`}>
            Pending
          </Link>
        </div>

        <div className={transactions.cta_pagination_div}>

        </div>

        <Link href="/transactions">
          <div className={transactions.cta_search_div}>
            
          </div>
        </Link>
      </div>

      <div className={transactions.main_list_container}>

        <div className={transactions.main_list_label_div}>
          <div className={transactions.list_label_trnid_div}>
            <p className={transactions.list_label_trnid}>TRN. ID</p>
          </div>
          <div className={transactions.list_label_date_div}>
            <p className={transactions.list_label_date}>DATE</p>
          </div>
          <div className={transactions.list_label_type_div}>
            <p className={transactions.list_label_type}>TYPE</p>
          </div>
          <div className={transactions.list_label_user_div}>
            <p className={transactions.list_label_user}>USER</p>
          </div>
          <div className={transactions.list_label_status_div}>
            <p className={transactions.list_label_status}>STATUS</p>
          </div>
          <div className={transactions.list_label_cta_div}>
            <p className={transactions.list_label_cta}>ACTION</p>
          </div>
        </div>

        {/* Check if users data is available and map through it */}
        {transactionData?.length > 0 ? (
          transactionData.map((transaction) => (
            <TransactionItem key={transaction._id} transInfo={transaction} />
          ))
        ) : (
          <p>No transaction activity yet...</p> // Fallback message if no users are found
        )}
      </div>

    </div>
  );
}
