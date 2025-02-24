import Link from "next/link";
import { DateTime } from "luxon";

// styles
import statements from "../statements.module.css";
import { useModal } from "@/hooks/useModalStore";


export default function StatementListItem(props) {
    const { propId, statement } = props;
    const { bll_bill_cov_period, bll_id, bll_pay_stat, transactions_status } = statement;

    const status = bll_pay_stat === "paid" && transactions_status === "completed" ? "Paid" : "Pending"
    // Format the bll_bill_cov_period using Luxon
    const formattedPeriod = DateTime.fromFormat(bll_bill_cov_period, "yyyy-MM")
        .toFormat("MMMM yyyy");

        const {onOpen} = useModal()
    return (
        <div className={statements.statements_list_item_div}>
            <div className={statements.statements_list_item_date_div}>
                <p className={statements.statements_list_item_date}>{formattedPeriod}</p>
            </div>
            <div className={statements.statements_list_item_id_div}>
                <p className={statements.statements_list_item_id}>{bll_id}</p>
            </div>
            <div className={statements.statements_list_item_status_div}>
                <p className={statements.statements_list_item_status}>{status}</p>
            </div>
            <div className={statements.statements_list_item_cta_div}>
                <Link className={statements.statements_list_item_cta} href={`#`} onClick={() => onOpen('statement-modal', props)}>View Info</Link>
            </div>
        </div>
    )
}