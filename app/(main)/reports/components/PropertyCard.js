import Image from "next/image";
import Link from "next/link";

// styles
import properties from "../properties.module.css";

export default function PropertyCard(props) {
    const { propertyInfo } = props;    

    return (
        <div className={properties.main_grid_item_container}>
            <div className={properties.grid_item_photo_div}>
                <Image className={properties.grid_item_photo} src={propertyInfo.prop_image_url} alt="House Photo" width={324} height={182}/>
            </div>

            <div className={properties.grid_item_residence_div}>
                <h6 className={properties.grid_item_residence}>{propertyInfo.prop_owner_lastname} | Residence</h6>
            </div>

            <div className={properties.grid_item_owner_div}>
                <p className={properties.grid_item_owner_label}>OWNER</p>
                <p className={properties.grid_item_owner}>{propertyInfo.prop_owner}</p>
            </div>
            
            <div className={properties.grid_item_address_div}>
                <p className={properties.grid_item_address_label}>ADDRESS</p>
                <p className={properties.grid_item_address}>{propertyInfo.prop_lot_num} {propertyInfo.prop_street}</p>
            </div>

            <div className={properties.grid_item_cta_div}>
                <Link className={properties.grid_item_cta} href={`/properties/${propertyInfo.prop_id}`}>View Property</Link>
            </div>
        </div>
    )
}