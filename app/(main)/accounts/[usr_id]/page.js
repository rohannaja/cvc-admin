"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// styles
import accounts from "../accounts.module.css";
import usrprof from "./usrprof.module.css";

// assets
import backBtn from '@/public/svg/backbtn.svg';

// components
import UserPropertyCard from "./components/UserPropertyCard.js";
import UserTransItem from "./components/UserTransItem.js";

export default function UserProfile() {
    const [userData, setUserData] = useState(null);
    const [propData, setPropData] = useState([]);
    const [transData, setTransData] = useState([]);
    const params = useParams();  // Use useParams to get dynamic route params
    const usr_id = params.usr_id; // Get usr_id from the URL (assuming your route is /accounts/[usr_id])

    // Base API URL based on environment
     ;

    // Fetch user data, properties, and transactions when usr_id is available
    useEffect(() => {
        if (usr_id) {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${usr_id}`)
                .then((res) => res.json())
                .then((data) => setUserData(data))
                .catch((error) => console.error('Error fetching user data:', error));

            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${usr_id}/properties`)
                .then((res) => res.json())
                .then((data) => setPropData(data))
                .catch((error) => console.error('Error fetching properties:', error));

            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${usr_id}/transactions`)
                .then((res) => res.json())
                .then((data) => setTransData(data))
                .catch((error) => console.error('Error fetching transactions:', error));
        }
    }, [usr_id]);

    if (!userData) {
        return <div>No user data retrieved.</div>;
    }
    
    console.log(userData)
    return (
        <div className={accounts.main_content_container}>
            <div className={accounts.main_cta_row}>
                <Link href="/accounts" className={usrprof.backbtn_cont}>
                    <div className={usrprof.backbtn_img_div}>
                        <Image src={backBtn} alt="Back Icon" height={25} width={25}/>
                    </div>
                    <p>Back</p>
                </Link>

                <Link href={`/accounts/${userData.usr_id}/edit-profile`} className={usrprof.editbtn_cont}>Edit Profile</Link>

                {
                    userData?.usr_role === "homeowner" && <Link href={`/accounts/${userData.usr_id}/change-password`} className={usrprof.editbtn_cont}>Change Password</Link>
                }
               
            </div>

            <div className={usrprof.main_userinfo_container}>
                <div className={usrprof.main_userinfo_div}>

                    <div className={usrprof.userinfo_avatar_div}>
                        <Image className={usrprof.userinfo_avatar} src={userData.usr_profile_photo} alt="Profile Photo" width={150} height={150} />

                        <div className={usrprof.userinfo_cta_div}>
                            <Link href={`/accounts/${userData.usr_id}/edit-avatar`} className={usrprof.userinfo_edit_btn}>Change Photo</Link>
                        </div>
                    </div>

                    <div className={usrprof.userinfo_content_div}>
                        <div className={usrprof.userinfo_info_div}>
                            <p className={usrprof.info_label}>USER ID</p>
                            <p className={usrprof.info_cont}>{userData.usr_id}</p>
                        </div>

                        <div className={usrprof.userinfo_info_div}>
                            <p className={usrprof.info_label}>USERNAME</p>
                            <p className={usrprof.info_cont}>{userData.usr_username}</p>
                        </div>

                        <div className={usrprof.userinfo_info_div}>
                            <p className={usrprof.info_label}>PASSWORD</p>
                            <p className={usrprof.info_cont}>-</p>
                        </div>

                        <div className={usrprof.userinfo_info_div}>
                            <p className={usrprof.info_label}>FIRST NAME</p>
                            <p className={usrprof.info_cont}>{userData.usr_first_name}</p>
                        </div>

                        <div className={usrprof.userinfo_info_div}>
                            <p className={usrprof.info_label}>LAST NAME</p>
                            <p className={usrprof.info_cont}>{userData.usr_last_name}</p>
                        </div>

                        <div className={usrprof.userinfo_info_div}>
                            <p className={usrprof.info_label}>AGE</p>
                            <p className={usrprof.info_cont}>{userData.usr_age}</p>
                        </div>

                        <div className={usrprof.userinfo_info_div}>
                            <p className={usrprof.info_label}>BIRTHDAY</p>
                            <p className={usrprof.info_cont}>{userData.usr_date_of_birth}</p>
                        </div>

                        <div className={usrprof.userinfo_info_div}>
                            <p className={usrprof.info_label}>EMAIL</p>
                            <p className={usrprof.info_cont}>{userData.usr_email}</p>
                        </div>

                        <div className={usrprof.userinfo_info_div}>
                            <p className={usrprof.info_label}>PHONE</p>
                            <p className={usrprof.info_cont}>{userData.usr_phone}</p>
                        </div>

                        <div className={usrprof.userinfo_info_div}>
                            <p className={usrprof.info_label}>ROLE</p>
                            <p className={usrprof.info_cont}>{userData.usr_role}</p>
                        </div>
                    </div>

                </div>

                <div className={usrprof.main_userwal_div}>
                    <h6 className={usrprof.main_userwal_title}>Wallet Balance</h6>
                    <h5 className={usrprof.userwal_bal}>PHP {userData.usr_wallet_bal}</h5>
                </div>
            </div>



            <div className={usrprof.main_userinfo_container}>
                <div className={usrprof.main_userprop_container}>
                    <div className={usrprof.main_userprop_cta_row}>
                        <h6 className={usrprof.userprop_title}>Properties</h6>
                        {/* <div className={usrprof.userprop_cta_div}>
                            <Link className={usrprof.userprop_cta} href={`/accounts/${userData.usr_id}/properties`}>See All</Link>
                        </div> */}
                    </div>

                    <div className={usrprof.main_userprop_list_container}>
                        {propData.length > 0 ? (
                            propData.slice(0, 2).map((property) => (
                                <UserPropertyCard key={property._id} propertyInfo={property} />
                            ))                            
                        ) : (
                            <p>No properties available</p>
                        )}
                    </div>
                </div>

                <div className={usrprof.main_usertrans_container}>
                    <div className={usrprof.main_usertrans_cta_row}>
                        <h6 className={usrprof.usertrans_title}>Recent Transactions</h6>
                    </div>

                    <div className={usrprof.main_usertrans_list_container}>
                        {transData.length > 0 ? (
                            transData.slice(0, 10).map((transaction) => (
                                <UserTransItem key={transaction._id} transactionInfo={transaction} />
                            ))                            
                        ) : (
                            <p>No transactions available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}