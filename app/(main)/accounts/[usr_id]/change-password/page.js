"use client";

import styles from './page.module.css';
import Image from 'next/image';
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import { isFile, uploadPhoto } from '@/lib/utils';

export default function ProfileClient({ params }) {
    const userId = params.usr_id
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [error, setError] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [profileToDisplay, setProfileToDisplay] = useState(null);
    const router = useRouter();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        if (userId) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/profile/${userId}`);
                    if (response.status != 200) throw new Error('Failed to fetch user data');

                    const data = response.data;
                    setProfileToDisplay(data.userProfile)
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setError(error.message);
                }
            };

            fetchUserData();
        }
    }, [userId]);


    // Handle profile update
    const handleProfileUpdate = async () => {

        const updatedData = {
            new_password: newPassword,
        };

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home-owner/profile/${userId}/password`, updatedData);
            const responseData =  response.data;
          
            // Re-fetch updated data
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home-owner/profile/${userId}`);
                    if (response.status != 200) throw new Error('Failed to fetch updated user data');
                    
                    const data = response.data
                    setProfileToDisplay(data.userProfile)

                    return data
                } catch (error) {
                    console.error('Error fetching updated user data:', error);
                         alert("Something went wrong")

                }
            };

            const data = await fetchUserData();
            alert("Profile update successful")
            // await update({ ...sessionData, user: {...sessionData?.user, profile_photo: data.userProfile, username: data?.userUsername, email: data?.userEmail} })
            router.refresh()
            // await signIn("credentials", { redirect: false, username: data.userUsername, password: newPassword  });
        } catch (error) {
            console.error('Error updating profile:', error);
            alert("Something went wrong")

        }
    };

    return (
        <div className={"flex justify-center items-center w-full h-full"}>
                    <div className={"w-[60%] bg-white px-10 py-10"}>
                        <div className={styles.left_column}>
                            <Image
                                src={profileToDisplay || "/profile-pic.png"}
                                alt="Profile"
                                className={styles.profile_image}
                                width={150}
                                height={150}
                            />

                        </div>
                        <div className={styles.right_column}>
                           <div className={styles.profile_field}>
                                <label>Change Password:</label>
                                <input 
                                    type="password" 
                                    placeholder="New Password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                />
                            </div>
                            <button 
                                className={styles.update_profile_button}
                                onClick={handleProfileUpdate}
                            >
                                UPDATE PROFILE
                            </button>
                        </div>
                    </div>
        </div>
    );
}
