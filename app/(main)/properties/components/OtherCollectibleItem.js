// styles
import newbillstat from "../[prop_id]/new-billing-statement/newbillstat.module.css";

export default function OtherCollectibleItem(props) {
    const { bll_other_coll_item, bll_other_coll_itmcharge, bll_other_coll_dur, bll_other_coll_remdur } = props.collInfo;
    const { summaryState } = props;
    return (
        <div className={newbillstat.newbillstat_form_other_coll_item_div}>
            <div className={newbillstat.newbillstat_form_other_coll_item_ITM_div}>
                <p className={newbillstat.newbillstat_form_other_coll_item_ITM}>{bll_other_coll_item}</p>
            </div>
            <div className={newbillstat.newbillstat_form_other_coll_item_RM_div}>
                <p className={newbillstat.newbillstat_form_other_coll_item_RM}>{bll_other_coll_remdur}</p>
            </div>
            <div className={newbillstat.newbillstat_form_other_coll_item_TD_div}>
                <p className={newbillstat.newbillstat_form_other_coll_item_TD}>{bll_other_coll_dur}</p>
            </div>
            <div className={newbillstat.newbillstat_form_other_coll_item_CPM_div}>
                <p className={newbillstat.newbillstat_form_other_coll_item_CPM}>PHP {bll_other_coll_itmcharge}</p>
            </div>
            <div className={newbillstat.newbillstat_form_other_coll_item_cta_div}>
                {!summaryState && (
                    <button className={newbillstat.newbillstat_form_other_coll_item_cta}>DEL</button>
                )}
            </div>
        </div>
    )
}