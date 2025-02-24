import Image from "next/image";
import Link from "next/link";

// styles
import accounts from "../accounts.module.css";

export default function AccountListItem(props) {
    const { userInfo } = props;    

    return (
        <div className={accounts.main_list_item_container}>
            <div className={accounts.list_item_photo_div}>
                <Image className={accounts.list_item_photo} src={userInfo.usr_profile_photo} alt="Account Photo" width={50} height={50}/>
            </div>
            <div className={accounts.list_item_name_div}>
                <p className={accounts.list_item_name}>{userInfo.usr_first_name} {userInfo.usr_last_name}</p>
            </div>
            <div className={accounts.list_item_role_div}>
                <p className={accounts.list_item_role}>{userInfo.usr_role}</p>
            </div>
            <div className={accounts.list_item_cta_div}>
                <Link className={accounts.list_item_cta} href={`/accounts/${userInfo.usr_id}`}>View Profile</Link>
            </div>
        </div>
    )
}
