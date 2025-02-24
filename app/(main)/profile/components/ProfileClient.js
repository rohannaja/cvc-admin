"use client";

import styles from '../page.module.css';
import Image from 'next/image';
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Sidebar from '../components/sidebar.js';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import { isFile, uploadPhoto } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ProfileClient({ userId }) {
    console.log(userId)
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [userData, setUserData] = useState(null);
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [usr_username, setUserName] = useState("");
    const [usr_phone, setUserPhone] = useState("");
    const [usr_email, setUserEmail] = useState("");
    const [error, setError] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [profileToDisplay, setProfileToDisplay] = useState(null);
    const router = useRouter();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const {toast} = useToast()
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
    const {update, data:sessionData} = useSession()
    console.log("session", sessionData)
    // Fetch user data
    useEffect(() => {
        if (userId) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/profile/${userId}`);
                    if (response.status != 200) throw new Error('Failed to fetch user data');

                    const data = response.data;
                    console.log("Fetched User Data:", data);


                    // Populate all the fields with the fetched user data
                    setUserData(data);
                    setUserFirstName(data.userFirstName || "");
                    setUserLastName(data.userLastName || "");
                    setUserName(data.userUsername || "");
                    setUserPhone(data.userPhone || "");
                    setUserEmail(data.userEmail || "");
                    setProfileToDisplay(data.userProfile)
                    setNewProfilePic(data.userProfile)
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setError(error.message);
                }
            };

            fetchUserData();
        }
    }, [userId]);

    // Logout function
    const handleLogout = () => {
        signOut()
        router.push("/")
    };

    // Handle profile picture change
    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileToDisplay(URL.createObjectURL(file)); // Preview the selected profile picture
            setNewProfilePic(file)
        }
    };

    // Handle profile update
    const handleProfileUpdate = async () => {

        let imageUrl = newProfilePic;
        if(newProfilePic && isFile(newProfilePic)) {
            const {url} =  await uploadPhoto(newProfilePic)
            imageUrl = url
        }
        const updatedData = {
            usr_first_name: userFirstName,
            usr_last_name: userLastName,
            usr_username: usr_username,
            usr_phone: usr_phone,
            usr_email: usr_email,
            new_password: newPassword,
            new_imageUrl: imageUrl
        };

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/profile/${userId}`, updatedData);
            const responseData =  response.data;
          
            // Re-fetch updated data
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/profile/${userId}`);
                    if (response.status != 200) throw new Error('Failed to fetch updated user data');
                    
                    const data = response.data
                    setUserData(data);
                    setUserFirstName(data.userFirstName || "");
                    setUserLastName(data.userLastName || "");
                    setUserName(data.userUsername || "");
                    setUserPhone(data.userPhone || "");
                    setUserEmail(data.userEmail || "");
                    setProfileToDisplay(data.userProfile)
                    setNewProfilePic(data.userProfile)

                    return data
                } catch (error) {
                    console.error('Error fetching updated user data:', error);
                    toast({title: "Status Error", description: error.message?.response?.data?.message, variant: "destructive"});
                }
            };

            const data = await fetchUserData();
            toast({title: "Status Success", description: "Profile updated successfully!"});
            await update({ ...sessionData, user: {...sessionData?.user, profile_photo: data.userProfile, username: data?.userUsername, email: data?.userEmail} })
            router.refresh()
            // await signIn("credentials", { redirect: false, username: data.userUsername, password: newPassword  });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({title: "Status Error", description: error?.response?.data?.message, variant: "destructive"});
        }
    };

    return (
        <div className={"flex justify-center items-center"}>
                    <div className={"w-[80%]"}>
                        <div className={styles.left_column}>
                            <Image
                                src={profileToDisplay || "/profile-pic.png"}
                                alt="Profile"
                                className={styles.profile_image}
                                width={150}
                                height={150}
                            />
                            <button className={styles.change_profile_button}>
                                <input 
                                    type="file" 
                                    style={{ display: 'none' }} 
                                    onChange={handleProfilePicChange} 
                                    id="fileInput" 
                                />
                                <label htmlFor="fileInput" className={styles.change_profile_button_label}>
                                    CHANGE PROFILE
                                </label>
                            </button>
                        </div>
                        <div className={styles.right_column}>
                            <div className={styles.profile_field}>
                                <label>Name:</label>
                                <input type="text" value={`${userFirstName} ${userLastName}`} readOnly />
                            </div>
                            <div className={styles.profile_field}>
                                <label>Username:</label>
                                <input 
                                    type="text" 
                                    value={usr_username} 
                                    onChange={(e) => setUserName(e.target.value)} 
                                />
                            </div>
                            <div className={styles.profile_field}>
                                <label>Contact No.:</label>
                                <input 
                                    type="numeric" 
                                    value={usr_phone} 
                                    onChange={(e) => setUserPhone(e.target.value)}
                                    maxlength="11"
                                    min="0"
                                />
                            </div>
                            <div className={styles.profile_field}>
                                <label>Email Address:</label>
                                <input 
                                type="text" 
                                value={usr_email} 
                                onChange={(e) => setUserEmail(e.target.value)} 
                            />

                            </div>
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
                    {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}
