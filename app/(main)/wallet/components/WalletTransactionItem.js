import Link from "next/link";
import { DateTime } from "luxon";

// styles
import wallet from "../wallet.module.css";
import { useModal } from "@/hooks/useModalStore";

export default function WalletTransactionItem(props) {
    const { wallTrans } = props;
    const { villwall_trn_created_at, villwall_trn_id, villwall_trn_type, villwall_trn_description } = wallTrans;
    
    const formattedDate = DateTime.fromISO(villwall_trn_created_at).toFormat("MMMM dd, yyyy");
    const {onOpen} = useModal()
    return (
        <div className={wallet.wallettrans_list_item_container}>
            <div className={wallet.wallettrans_list_item_date_div}>
                <p className={wallet.wallettrans_list_item_date}>{formattedDate}</p>
            </div>
            <div className={wallet.wallettrans_list_item_trnid_div}>
                <p className={wallet.wallettrans_list_item_trnid}>{villwall_trn_id}</p>
            </div>
            <div className={wallet.wallettrans_list_item_type_div}>
                <p className={wallet.wallettrans_list_item_type}>{villwall_trn_type}</p>
            </div>

            <div className={wallet.wallettrans_list_item_type_div}>
                <p className={`${wallet.wallettrans_list_item_type} line-clamp-1` }>{villwall_trn_description} </p>
            </div>
            <div className={wallet.wallettrans_list_item_cta_div}>
                <Link className={wallet.wallettrans_list_item_cta} href={`#`} onClick={() => onOpen("wallet-modal", wallTrans)}>View Info</Link>
            </div>
        </div>
    )
}