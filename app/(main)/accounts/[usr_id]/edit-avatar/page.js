"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// styles
import accounts from "../../accounts.module.css";
import editavat from "./editavat.module.css";

// assets
import backBtn from '@/public/svg/backbtn.svg';

export default function EditAvatar() {
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

    return (
        <div className={accounts.main_content_container}>
            <div className={editavat.main_content_div}>
                <div className={editavat.content_div_cta_row}>
                    <Link href={`/accounts/${userData.usr_id}`} className={editavat.backbtn_cont}>
                        <div className={editavat.backbtn_img_div}>
                            <Image src={backBtn} alt="Back Icon" height={25} width={25}/>
                        </div>
                        <p>Back</p>
                    </Link>
                </div>

                <div className={editavat.main_content_title_div}>
                    <h3 className={editavat.content_title}>{`Edit ${userData.usr_first_name}'s Avatar`}</h3>
                </div>

                <div className={editavat.main_avatar_container}>

                    <div className={editavat.main_avatar_old_div}>
                        <div className={editavat.avatar_old_title_div}>
                            <p className={editavat.avatar_old_title}>Current Avatar</p>
                        </div>

                        <div className={editavat.avatar_old_img_div}>
                            <Image src={userData.usr_profile_photo}
                            alt="Current Avatar" width={200} height={200}/>
                        </div>
                    </div>



                    <div className={editavat.main_avatar_new_div}>
                        <div className={editavat.avatar_new_title_div}>
                            <p className={editavat.avatar_new_title}>New Avatar</p>
                        </div>

                        <div className={editavat.avatar_new_img_div}>
                            <h6>Image Uploads Coming Soon!</h6>
                        </div>
                    </div>

                </div>
                
            </div>
        </div>
    )
}