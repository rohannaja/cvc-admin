"use client"

import Image from "next/image";

// styles
import settings from "../settings.module.css";

// assets
import trashIcon from "@/public/svg/trash_icon.svg";

export default function SettingsListItem(props) {
    const { itemData } = props;

    const handleDelete = async () => {
        // Show confirmation prompt
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");
        if (!isConfirmed) return; // If not confirmed, exit the function
        
        try {
             

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/settings/delete-rate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: itemData._id }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete rate");
            }

            onDelete(itemData._id); // Notify parent component to remove item from list
        } catch (error) {
            console.error("Error deleting rate:", error);
        }
    };


    return (
        <div className={settings.settings_content_rate_div}>
            <div className={settings.settings_content_rate_listitem_div}>
                <p className={settings.settings_content_rate_listitem_label}>ANNUAL/FIXED RATE</p>
                <p className={settings.settings_content_rate_listitem}>PHP {itemData.misc_ann_rate}/year</p>
            </div>

            <div className={settings.settings_content_rate_listitem_div}>
                <p className={settings.settings_content_rate_listitem_label}>MONTHLY RATE</p>
                <p className={settings.settings_content_rate_listitem}>PHP {itemData.misc_unit_amt}/month</p>
            </div>

            <div className={settings.settings_content_listitem_cta_div}>
                <button className={settings.settings_content_listitem_cta_trash} onClick={handleDelete}>
                    <div className={settings.settings_content_listitem_cta_img}>
                        <Image src={trashIcon} alt="Trash Icon" width={20} height={20}/>
                    </div>
                </button>
            </div>
        </div>
    )
}