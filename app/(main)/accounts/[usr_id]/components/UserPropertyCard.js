import Image from "next/image";
import Link from "next/link";

// styles
import usrprof from "../usrprof.module.css";


export default function UserPropertyCard(props) {
    const { propertyInfo } = props;

    return (
        <div className={usrprof.userprop_list_item_container}>
            <div className={usrprof.list_item_photo_div}>
                <Image className={usrprof.list_item_photo} src={propertyInfo.prop_image_url} alt="House Photo" width={324} height={182}/>
            </div>

            <div className={usrprof.list_item_residence_div}>
                <h6 className={usrprof.list_item_residence}>Lot #{propertyInfo.prop_lot_num}</h6>
            </div>

            <div className={usrprof.list_item_owner_div}>
                <p className={usrprof.list_item_owner_label}>OWNER</p>
                <p className={usrprof.list_item_owner}>{propertyInfo.prop_owner}</p>
            </div>
                            
            <div className={usrprof.list_item_address_div}>
                <p className={usrprof.list_item_address_label}>ADDRESS</p>
                <p className={usrprof.list_item_address}>{propertyInfo.prop_lot_num} {propertyInfo.prop_street}</p>
            </div>

            <div className={usrprof.list_item_cta_div}>
                <Link className={usrprof.list_item_cta} href={`/properties/${propertyInfo.prop_id}`}>View Property</Link>
            </div>
        </div>
    )
}