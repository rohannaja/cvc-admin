"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// styles
import properties from "../properties.module.css";
import propinf from "./propinf.module.css";

// assets
import backBtn from '@/public/svg/backbtn.svg';

export default function PropertyInfoClient({userId}) {
    const [propertyData, setPropertyData] = useState(null);
    const params = useParams();  // Use useParams to get dynamic route params
    const prop_id = params.prop_id; // Get prop_id from the URL 

    useEffect(() => {
        if (prop_id) {
        // Determine the API URL based on the environment
          // Default to localhost if no environment variable is set

        
        // Make sure the endpoint matches your API route
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/properties/${prop_id}`)
            .then((res) => res.json())
            .then((data) => setPropertyData(data))
            .catch((error) => console.error('Error fetching property data:', error));
        }
    }, [prop_id]); // Re-run the effect when prop_id changes


    if (!propertyData) {
        return <div>No property data retrieved.</div>;
    }

    const { prop_tot_amt_due, prop_tot_hoamaint_fee, prop_tot_water_charge, prop_tot_garb_fee } = propertyData.prop_collectibles_total;


    let payStatElement;
    if (propertyData.prop_payment_status === "PENDING ADMIN CHANGES") {
        payStatElement = (
            <p className={propinf.propinf_info_paystat_pending}>PENDING ADMIN CHANGES</p>
        )
    } else if (propertyData.prop_payment_status === "PENDING CONFIRMATION") {
        payStatElement = (
            <p className={propinf.propinf_info_paystat_pending}>PENDING CONFIRMATION</p>
        )
    } else if (propertyData.prop_payment_status === "PARTIAL") {
        payStatElement = (
            <p className={propinf.propinf_info_paystat_partial}>PARTIAL</p>
        )
    } else if (propertyData.prop_payment_status === "PAID") {
        payStatElement = (
            <p className={propinf.propinf_info_paystat_paid}>PAID</p>
        )
    } else if (propertyData.prop_payment_status === "LATE") {
        payStatElement = (
            <p className={propinf.propinf_info_paystat_late}>LATE</p>
        )
    }

    let currWaterBill;
    if (propertyData.prop_billing_status === "pending") {
        currWaterBill = (
            <p className={propinf.propinf_coll_data_water_pending}>PENDING</p>
        )
    } else if (propertyData.prop_billing_status != "pending") {
        currWaterBill = (
            <p className={propinf.propinf_coll_data_cont}>PHP {propertyData.prop_curr_water_charges.toString()}</p>
        )
    }

    let totWaterBill;
    if (propertyData.prop_billing_status === "pending") {
        totWaterBill = (
            <p className={propinf.propinf_coll_data_water_pending}>PENDING</p>
        )
    } else if (propertyData.prop_billing_status != "pending") {
        totWaterBill = (
            <p className={propinf.propinf_coll_data_cont}>PHP {prop_tot_water_charge.toString()}</p>
        )
    }

    console.log(propertyData)
    return (
        <div className={properties.main_content_container}>
            <div className={propinf.main_content_div}>

                <div className={propinf.content_div_cta_row}>
                    <Link href="/properties" className={propinf.backbtn_cont}>
                        <div className={propinf.backbtn_img_div}>
                            <Image src={backBtn} alt="Back Icon" height={25} width={25}/>
                        </div>
                        <p>Back</p>
                    </Link>

                    <Link href={`/properties/${propertyData.prop_id}/edit-property`} className={propinf.editprop_btn}>
                        Edit Property
                    </Link>

                    <Link href={`/properties/${propertyData.prop_id}/statements`} className={propinf.statements_btn}>
                        Statements
                    </Link>

                    <Link href={`/properties/${propertyData._id}/create_transaction/${propertyData.prop_owner_id}`} className={propinf.newbillstat_btn}>
                        Create transaction History
                    </Link>

                    <Link href={`/properties/${propertyData.prop_id}/new-billing-statement`} className={propinf.newbillstat_btn}>
                        New Billing Statement
                    </Link>

                   
                </div>

                <div className={propinf.main_content_title_div}>
                    <h3 className={propinf.content_title}>{propertyData.prop_owner_lastname} | Residence</h3>
                </div>



                <div className={propinf.main_propinf_container}>

                    <div className={propinf.main_propinf_info_div}>
                        <div className={propinf.propinf_info_img_div}>
                            <Image className={"max-h-[500px] object-contain"} 
                            src={propertyData.prop_image_url} 
                            alt="House Photo"
                            layout="responsive"
                            width={500}
                            height={280} 
                            
                            
                            />
                        </div>

                        <div className={propinf.propinf_info_div}>
                            {/* ROW */}
                            <div className={propinf.propinf_info_row}>
                                <div className={propinf.propinf_info_cont}>
                                    <p className={propinf.propinf_info_paystat_label}>PAYMENT STATUS</p>
                                    {payStatElement}
                                </div>
                            </div>

                            {/* ROW */}
                            <div className={propinf.propinf_info_row}>
                                <div className={propinf.propinf_info_cont}>
                                    <p className={propinf.propinf_info_owner_label}>OWNER</p>
                                    <p className={propinf.propinf_info_owner}>{propertyData.prop_owner}</p>
                                </div>
                            </div>

                            {/* ROW */}
                            <div className={propinf.propinf_info_row}>
                                <div className={propinf.propinf_info_cont}>
                                    <p className={propinf.propinf_info_address_label}>ADDRESS</p>
                                    <p className={propinf.propinf_info_address}>{propertyData.prop_lot_num} {propertyData.prop_street}</p>
                                </div>
                            </div>

                            {/* ROW */}
                            <div className={propinf.propinf_info_row}>
                                <div className={propinf.propinf_info_cont}>
                                    <p className={propinf.propinf_info_email_label}>EMAIL</p>
                                    <p className={propinf.propinf_info_email}>{propertyData.prop_owner_email}</p>
                                </div>

                                <div className={propinf.propinf_info_cont}>
                                    <p className={propinf.propinf_info_phone_label}>PHONE</p>
                                    <p className={propinf.propinf_info_phone}>{propertyData.prop_owner_phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className={propinf.main_propinf_coll_div}>

                        <div className={propinf.propinf_coll_data_container}>

                            <div className={propinf.propinf_coll_data_curr_div}>
                                <div className={propinf.propinf_coll_title_div}>
                                    <h6 className={propinf.propinf_coll_title}>{`Collectibles (Current)`}</h6>
                                </div>

                                <div className={propinf.propinf_coll_data_div}>
                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>WATER CHARGES</p>
                                        </div>
                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            {currWaterBill}
                                        </div>
                                    </div>

                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>HOA FEES</p>
                                        </div>

                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}>PHP {propertyData.prop_curr_hoamaint_fee}</p>
                                        </div>
                                    </div>

                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>GARBAGE COLLECTION FEES</p>
                                        </div>

                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}>PHP {propertyData.prop_curr_garb_fee}</p>
                                        </div>
                                    </div>

                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>CURRENT CHARGES</p>
                                        </div>

                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}>PHP </p>
                                        </div>
                                    </div>
                                </div>

                                <div className={propinf.propinf_coll_data_div}>
                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>OTHERS</p>
                                        </div>

                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}></p>
                                        </div>
                                    </div>

                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>OTHER ITEM</p>
                                        </div>

                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}></p>
                                        </div>
                                    </div>
                                </div>

                                <div className={propinf.propinf_coll_data_div}>
                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>ADVANCED WATER PAYMENTS</p>
                                        </div>
                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}>PHP {propertyData.prop_tot_adv_water_pay}</p>
                                        </div>
                                    </div>

                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>ADVANCED HOA PAYMENTS</p>
                                        </div>
                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}>PHP {propertyData.prop_tot_adv_hoa_pay}</p>
                                        </div>
                                    </div>

                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>ADVANCED GARBAGE PAYMENTS</p>
                                        </div>
                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}>PHP {propertyData.prop_tot_adv_garb_pay}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={propinf.propinf_coll_data_div}>
                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>TOTAL AMOUNT DUE</p>
                                        </div>

                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}>PHP {propertyData.prop_curr_amt_due}</p>
                                        </div>
                                    </div>

                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>WALLET BALANCE</p>
                                        </div>

                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}>PHP {propertyData.prop_wall_bal}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>



                            {/* COLUMN */}
                            <div className={propinf.propinf_coll_data_tot_div}>
                            <div className={propinf.propinf_coll_title_div}>
                                    <h6 className={propinf.propinf_coll_title}>{`Collectibles (Total)`}</h6>
                                </div>

                                <div className={propinf.propinf_coll_data_div}>
                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>WATER CHARGES</p>
                                        </div>
                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            {totWaterBill}
                                        </div>
                                    </div>

                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>HOA FEES</p>
                                        </div>

                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}>PHP {prop_tot_hoamaint_fee}</p>
                                        </div>
                                    </div>

                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>GARBAGE COLLECTION FEES</p>
                                        </div>

                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}>PHP {prop_tot_garb_fee}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={propinf.propinf_coll_data_div}>
                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>OTHERS</p>
                                        </div>

                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}>PHP </p>
                                        </div>
                                    </div>

                                </div>

                                <div className={propinf.propinf_coll_data_div}>
                                    <div className={propinf.propinf_coll_data_row}>
                                        <div className={propinf.propinf_coll_data_label_div}>
                                            <p className={propinf.propinf_coll_data_label}>TOTAL AMOUNT DUE</p>
                                        </div>

                                        <div className={propinf.propinf_coll_data_cont_div}>
                                            <p className={propinf.propinf_coll_data_cont}>PHP {prop_tot_amt_due}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>


            </div>
        </div>
    )
}