"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// styles
import accounts from "../../accounts.module.css";
import editprof from "./editprof.module.css";

// assets
import backBtn from '@/public/svg/backbtn.svg';

export default function EditProfile() {
    const [userData, setUserData] = useState(null);
    const params = useParams();  // Use useParams to get dynamic route params
    const usr_id = params.usr_id; // Get usr_id from the URL (assuming your route is /accounts/[usr_id])

    // Base API URL based on environment
    
     
    // Fetch user data, properties, and transactions when usr_id is available
    useEffect(() => {
        if (usr_id) {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${usr_id}`)
                .then((res) => res.json())
                .then((data) => setUserData(data))
                .catch((error) => console.error('Error fetching user data:', error));
        }
    }, [usr_id]);

    if (!userData) {
        return <div>No user data retrieved.</div>;
    }

    const { usr_username, usr_first_name, usr_last_name, usr_age,
        usr_date_of_birth, usr_email, usr_phone, usr_role } = userData;    

    return (
        <div className={accounts.main_content_container}>
            <div className={editprof.main_content_div}>
                <div className={editprof.content_div_cta_row}>
                    <Link href={`/accounts/${userData.usr_id}`} className={editprof.backbtn_cont}>
                        <div className={editprof.backbtn_img_div}>
                            <Image src={backBtn} alt="Back Icon" height={25} width={25}/>
                        </div>
                        <p>Back</p>
                    </Link>
                </div>

                <div className={editprof.main_content_title_div}>
                    <h3 className={editprof.content_title}>{`Edit ${userData.usr_first_name}'s Profile`}</h3>
                </div>

                <div className={editprof.main_editprof_container}>

                    <div className={editprof.main_editprof_currdata_div}>
                        <div className={editprof.editprof_currdata_row}>
                            <h6>Current Details</h6>
                        </div>

                        <div className={editprof.editprof_currdata_row}>
                            <div className={editprof.editprof_currdata_label_div}>
                                <p className={editprof.editprof_currdata_label}>USER ID</p>
                            </div>
                            <div className={editprof.editprof_currdata_data_div}>
                                <p className={editprof.editprof_currdata_data}>{usr_id}</p>
                            </div>
                        </div>

                        <div className={editprof.editprof_currdata_row}>
                            <div className={editprof.editprof_currdata_label_div}>
                                <p className={editprof.editprof_currdata_label}>USERNAME</p>
                            </div>
                            <div className={editprof.editprof_currdata_data_div}>
                                <p className={editprof.editprof_currdata_data}>{usr_username}</p>
                            </div>
                        </div>

                        <div className={editprof.editprof_currdata_row}>
                            <div className={editprof.editprof_currdata_label_div}>
                                <p className={editprof.editprof_currdata_label}>FIRST NAME</p>
                            </div>
                            <div className={editprof.editprof_currdata_data_div}>
                                <p className={editprof.editprof_currdata_data}>{usr_first_name}</p>
                            </div>
                        </div>

                        <div className={editprof.editprof_currdata_row}>
                            <div className={editprof.editprof_currdata_label_div}>
                                <p className={editprof.editprof_currdata_label}>LAST NAME</p>
                            </div>
                            <div className={editprof.editprof_currdata_data_div}>
                                <p className={editprof.editprof_currdata_data}>{usr_last_name}</p>
                            </div>
                        </div>

                        <div className={editprof.editprof_currdata_row}>
                            <div className={editprof.editprof_currdata_label_div}>
                                <p className={editprof.editprof_currdata_label}>AGE</p>
                            </div>
                            <div className={editprof.editprof_currdata_data_div}>
                                <p className={editprof.editprof_currdata_data}>{usr_age}</p>
                            </div>
                        </div>

                        <div className={editprof.editprof_currdata_row}>
                            <div className={editprof.editprof_currdata_label_div}>
                                <p className={editprof.editprof_currdata_label}>BIRTHDAY</p>
                            </div>
                            <div className={editprof.editprof_currdata_data_div}>
                                <p className={editprof.editprof_currdata_data}>{usr_date_of_birth}</p>
                            </div>
                        </div>

                        <div className={editprof.editprof_currdata_row}>
                            <div className={editprof.editprof_currdata_label_div}>
                                <p className={editprof.editprof_currdata_label}>EMAIL</p>
                            </div>
                            <div className={editprof.editprof_currdata_data_div}>
                                <p className={editprof.editprof_currdata_data}>{usr_email}</p>
                            </div>
                        </div>

                        <div className={editprof.editprof_currdata_row}>
                            <div className={editprof.editprof_currdata_label_div}>
                                <p className={editprof.editprof_currdata_label}>PHONE</p>
                            </div>
                            <div className={editprof.editprof_currdata_data_div}>
                                <p className={editprof.editprof_currdata_data}>{usr_phone}</p>
                            </div>
                        </div>

                        <div className={editprof.editprof_currdata_row}>
                            <div className={editprof.editprof_currdata_label_div}>
                                <p className={editprof.editprof_currdata_label}>ROLE</p>
                            </div>
                            <div className={editprof.editprof_currdata_data_div}>
                                <p className={editprof.editprof_currdata_data}>{usr_role}</p>
                            </div>
                        </div>
                    </div>

                    <div className={editprof.main_editprof_form_div}>
                        <h6>Edit Details Coming Soon!</h6>
                        <form className={editprof.main_editprof_form}>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}