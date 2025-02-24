import Link from "next/link";
import { DateTime } from "luxon";

// styles
import transactions from "../transactions.module.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";

export default function TransactionItem(props) {
  const { trn_id, trn_created_at, trn_type, trn_user_init, trn_status,trn_amount , trn_method, trn_reason, trn_image_url } = props.transInfo;
  const formattedDate = DateTime.fromISO(trn_created_at).toFormat("MMMM dd, yyyy");
    console.log(props.transInfo)
  const {onOpen} = useModal()
    return (
        <div className={transactions.main_list_item_container}>
          <div className={transactions.list_item_trnid_div}>
            <p className={transactions.list_item_trnid}>{trn_id}</p>
          </div>
          <div className={transactions.list_item_date_div}>
            <p className={transactions.list_item_date}>{formattedDate}</p>
          </div>
          <div className={transactions.list_item_type_div}>
            <p className={transactions.list_item_type}>{trn_type}</p>
          </div>
          <div className={transactions.list_item_user_div}>
            <p className={transactions.list_item_user}>{trn_user_init}</p>
          </div>
          <div className={transactions.list_item_status_div}>
            <p className={transactions.list_item_status}> 
              <Badge variant={trn_status} className={"text-white"}>{trn_status}</Badge>
                </p>
          </div>
          <div className={transactions.list_item_cta_div}>
            {
              (() => {
                // if(trn_status === "pending")
                return <Link href={"#"} className={transactions.list_item_cta} onClick={() => onOpen("transaction-modal", { trn_id, trn_created_at, trn_type, trn_user_init, trn_status,trn_amount , trn_method, trn_reason, trn_image_url} )}>
                  View Transaction
                </Link>
                // else {
                //   return <Link className={transactions.list_item_cta} href={`/transactions/${trn_id}`}>View Transaction</Link>
                // }
              })()
            }
          </div>
        </div>
    )
}