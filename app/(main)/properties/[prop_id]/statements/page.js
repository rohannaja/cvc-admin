"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// styles
import properties from "../../properties.module.css";
import statements from "./statements.module.css";

// assets
import backBtn from '@/public/svg/backbtn.svg';

// components
import StatementListItem from "./components/StatementListItem.js";

export default function Statements() {
    const [propertyData, setPropertyData] = useState(null);
    const [ownerData, setOwnerData] = useState(null);  // State to store owner data
    const [billingStatements, setBillingStatements] = useState([]); // State to store billing statements

    const params = useParams();  // Use useParams to get dynamic route params
    const prop_id = params.prop_id; // Get prop_id from the URL 

    // Fetch user data when usr_id is available
    useEffect(() => {
        if (prop_id) {
        // Determine the API URL based on the environment
         // Default to localhost if no environment variable is set

        
        // Fetch property data
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/properties/${prop_id}`)
        .then((res) => res.json())
        .then((data) => {
            setPropertyData(data);

            // Fetch owner data if prop_owner exists in the property data
            if (data.prop_owner_id) {
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${data.prop_owner_id}`)
                    .then((res) => res.json())
                    .then((userData) => setOwnerData(userData))
                    .catch((error) => console.error('Error fetching owner data:', error));
            }
        })
        .catch((error) => console.error('Error fetching property data:', error));
        
        // Fetch billing statements for the property
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/properties/${prop_id}/statements`)
        .then((res) => res.json())
        .then((data) => {
            setBillingStatements(data); // Set the fetched statements
        })
        .catch((error) => console.error('Error fetching billing statements:', error));
        }
    }, [prop_id]); // Re-run the effect when prop_id changes

    if (!propertyData) {
        return <div>No property data retrieved.</div>;
    }

    if (!ownerData) {
        return <div>No owner data retrieved.</div>;
    }

    return (
        <div className={properties.main_content_container}>
            <div className={statements.main_content_div}>
                <div className={statements.content_div_cta_row}>
                    <Link href={`/properties/${prop_id}`} className={statements.backbtn_cont}>
                        <div className={statements.backbtn_img_div}>
                            <Image src={backBtn} alt="Back Icon" height={25} width={25}/>
                        </div>
                        <p>Back</p>
                    </Link>
                </div>

                <div className={statements.main_content_title_div}>
                    <h3 className={statements.content_title}>{propertyData.prop_owner_lastname} | Residence - Statements</h3>
                </div>

                <div className={statements.main_statements_list_container}>
                    <div className={statements.statements_list_item_label_div}>
                        <div className={statements.statements_list_item_date_label_div}>
                            <p className={statements.statements_list_item_date_label}>DATE</p>
                        </div>
                        <div className={statements.statements_list_item_id_label_div}>
                            <p className={statements.statements_list_item_id_label}>BILLING ID</p>
                        </div>
                        <div className={statements.statements_list_item_status_label_div}>
                            <p className={statements.statements_list_item_status_label}>PAYMENT STATUS</p>
                        </div>
                        <div className={statements.statements_list_item_cta_label_div}>
                            <p className={statements.statements_list_item_cta_label}>ACTION</p>
                        </div>
                    </div>

                    {/* Map through billing statements and pass them to StatementListItem */}
                    {billingStatements?.length > 0 ? (
                        billingStatements.map((statement) => (
                            <StatementListItem key={statement.bll_id} statement={statement} propId={prop_id} />
                        ))
                    ) : (
                        <p>No billing statements found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}