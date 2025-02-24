"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// styles
import properties from "../../properties.module.css";
import newbillstat from "./newbillstat.module.css";

// assets
import backBtn from '@/public/svg/backbtn.svg';

// components
import OtherCollectibleItem from "../../components/OtherCollectibleItem.js";
import { uploadPhoto } from "@/lib/utils";

export default function NewBillingStatement() {
    const [propertyData, setPropertyData] = useState(null);
    const [ownerData, setOwnerData] = useState(null);

    const [hoaRates, setHoaRates] = useState([]);
    const [waterRates, setWaterRates] = useState([]);
    const [garbRates, setGarbRates] = useState([]);
    const [latestStatement, setLatestStatement] = useState(null);
    const [prevCollTotal, setPrevCollTotal] = useState(0);

    const [waterProof, setWaterProof] = useState(null)
    const [waterConsump, setWaterConsump] = useState(0);
    const [waterCharges, setWaterCharges] = useState(0);
    const [waterRtApplied, setWaterRtApplied] = useState(0);
    const [garbCharges, setGarbCharges] = useState(null);
    const [hoaFee, setHoaFee] = useState(null);
    
    const [prevWaterRead, setPrevWaterRead] = useState(0);
    const [waterRead, setWaterRead] = useState(0);
    const [billCovPeriod, setBillCovPeriod] = useState("");
    const [otherColl, setOtherColl] = useState([]);

    const [itemName, setItemName] = useState("");
    const [itemCost, setItemCost] = useState(0);
    const [itemDuration, setItemDuration] = useState(0);

    const [otherCollTotal, setOtherCollTotal] = useState(0);
    const [totalBill, setTotalBill] = useState(0);

    const [otherCollModal, setOtherCollModal] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const params = useParams();  // Use useParams to get dynamic route params
    const prop_id = params.prop_id; // Get prop_id from the URL  
    
    // Base API URL based on environment
    
     
    // Fetch property data, owner data, rates, and latest billing statement
    useEffect(() => {
        if (prop_id) {
            // Fetch property data
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/properties/${prop_id}`)
                .then((res) => res.json())
                .then((data) => {
                    setPropertyData(data);
                    // Fetch owner data if available
                    if (data.prop_owner_id) {
                        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${data.prop_owner_id}`)
                            .then((res) => res.json())
                            .then((userData) => setOwnerData(userData))
                            .catch((error) => console.error('Error fetching owner data:', error));
                    }
                })
                .catch((error) => console.error('Error fetching property data:', error));

            // Fetch rates data from /settings/misc
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/settings/misc/hoa_rate`)
                .then((res) => res.json())
                .then((data) => setHoaRates(data))
                .catch((error) => console.error('Error fetching rates data:', error));

                // Fetch rates data from /settings/misc
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/settings/misc/water_rate`)
                .then((res) => res.json())
                .then((data) => setWaterRates(data))
                .catch((error) => console.error('Error fetching rates data:', error));

            // Fetch rates data from /settings/misc
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/settings/misc/garb_rate`)
                .then((res) => res.json())
                .then((data) => setGarbRates(data))
                .catch((error) => console.error('Error fetching rates data:', error));

            // Fetch latest billing statement for the property
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/properties/${prop_id}/latest_statement_water_consump`)
                .then((res) => res.json())
                .then((data) => setPrevWaterRead(data))
                .catch((error) => console.error('Error fetching latest billing statement:', error));

            // Fetch total billing statement for the property
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/properties/${prop_id}/statement_total`)
            .then((res) => res.json())
            .then((data) => setPrevCollTotal(data))
            .catch((error) => console.error('Error fetching latest billing statement:', error));
        }
    }, [prop_id]);    

    useEffect(() => {
        if (garbRates) {
            setGarbCharges(garbRates.misc_unit_amt);
        }

        if (hoaRates) {
            setHoaFee(hoaRates.misc_unit_amt);
        }        
    }, [garbRates, hoaRates])

    const parsedWaterRead = parseFloat(waterRead) || 0;
    const parsedPrevWaterRead = parseFloat(prevWaterRead.bll_water_consump) || 0;

    // Effect to compute water rate when `waterRead`, `prevWaterRead`, or `waterRates` updates
    useEffect(() => {

        const consumption = parsedWaterRead - parsedPrevWaterRead;
        setWaterConsump(consumption > 0 ? consumption : 0); // Ensure no negative consumption

        if (waterRates.length > 0 && consumption > 0) {
            // Compute the water rate based on water consumption
            let computedWaterRate = 330; // Base rate for 1-10 m³
            let appliedRate = 0;

            if (consumption > 10) {
                let remainingConsumption = consumption - 10;
                const sortedRates = waterRates.sort((a, b) => a.misc_unit_range_min - b.misc_unit_range_min);

                for (let rate of sortedRates) {
                    if (rate.misc_unit_range_min > 10) {
                        const rangeStart = rate.misc_unit_range_min;
                        const rangeEnd = rate.misc_unit_range_max;

                        if (remainingConsumption > 0) {
                            const rangeConsumption = Math.min(remainingConsumption, rangeEnd - rangeStart + 1);
                            computedWaterRate += rangeConsumption * parseFloat(rate.misc_unit_amt);
                            appliedRate = parseFloat(rate.misc_unit_amt); // Update appliedRate
                            remainingConsumption -= rangeConsumption;
                        } else {
                            break;
                        }
                    }
                }
            }
            setWaterCharges(computedWaterRate);
            setWaterRtApplied(appliedRate); // Ensure the base rate is applied if no additional rate is used
        }        
    }, [waterRead, prevWaterRead, waterRates]);    

    // Effect to calculate total for otherColl
    useEffect(() => {
        // Calculate the sum of all bll_other_coll_itmcharge in otherColl
        const total = otherColl.reduce((sum, item) => {
            return sum + parseFloat(item.bll_other_coll_itmcharge || 0);
        }, 0);

        // Update otherCollTotal
        setOtherCollTotal(total);
    }, [otherColl]); // Recalculate when otherColl changes

    // Effect to calculate the total bill
    useEffect(() => {
        // Calculate the total bill by adding hoaFee, waterCharges, garbCharges, and otherCollTotal
        const total = 
            parseFloat(hoaFee || 0) +
            parseFloat(waterCharges || 0) +
            parseFloat(garbCharges || 0) +
            parseFloat(otherCollTotal || 0);

        // Update the total bill state
        setTotalBill(total);
    }, [hoaFee, waterCharges, garbCharges, otherCollTotal]); // Recalculate when any dependency changes

    const handleAddCollectible = async (e) => {
        e.preventDefault();
    
        try {
            let uniqueId;
            const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/properties/get_collectible_id`;
    
            // Retry fetching until a valid unique ID is returned
            do {
                console.log("Fetching from URL:", fullUrl);
                const response = await fetch(fullUrl);
                if (!response.ok) {
                    console.error(`Server returned status: ${response.status}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const data = await response.json();
                uniqueId = data.uniqueId;
    
                if (!uniqueId) {
                    console.warn("Unique ID is undefined. Retrying...");
                }
            } while (!uniqueId);
    
            console.log("Fetched Unique ID:", uniqueId);
    
            // Create a new collectible object
            const newCollectible = {
                bll_other_coll_id: uniqueId,
                bll_other_coll_item: itemName,
                bll_other_coll_itmcharge: parseFloat(itemCost),
                bll_other_coll_dur: parseInt(itemDuration),
                bll_other_coll_remdur: parseInt(itemDuration),
                bll_other_coll_status: "unpaid",
            };
    
            // Add the new collectible to the array
            setOtherColl((prevOtherColl) => [...prevOtherColl, newCollectible]);
    
            // Clear input fields and close modal
            setItemName("");
            setItemCost(0);
            setItemDuration(0);
            closeOtherCollModal();
        } catch (error) {
            console.error("Failed to add collectible due to an error:", error);
        }
    };

    const handleBillSubmit = async () => {
        try {
            setShowSummaryModal(false);
            // Set processing state
            setIsProcessing(true);

            if (!waterProof) {
                alert("Please upload a proof.");
                return;
            }
                let imageUrl;
                const {url} = await uploadPhoto(waterProof)
    
            // Prepare the data for the POST request
            const postData = {
                waterConsump,
                waterCharges,
                waterRead,
                garbCharges,
                hoaFee,
                billCovPeriod,
                bll_water_cons_img: null, // Replace with file upload handling logic
                otherColl,
                totalBill,
                imageUrl:url
            };
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/properties/${prop_id}/new_billing_statement`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit the billing statement');
            }
    
            console.log('Billing statement created successfully:', result);
    
            // Reset the form or redirect after successful submission
            setIsProcessing(false);
            alert('Billing statement created successfully.');
            // Optionally redirect or reset states
        } catch (error) {
            console.error('Error submitting billing statement:', error);
            alert('Error submitting billing statement. Please try again.');
            setIsProcessing(false);
        }
    };

    // Function to open the Other Collectibles Modal
    const openOtherCollModal = () => {
        setOtherCollModal(true);
    };

    const closeOtherCollModal = () => {
        setOtherCollModal(false);
    };

    // Function to open the Summary Modal
    const openSummaryModal = () => {
        setShowSummaryModal(true);
    };

    const closeSummaryModal = () => {
        setShowSummaryModal(false);
    };

    if (!propertyData) {
        return <div>No property data retrieved.</div>;
    }

    if (!ownerData) {
        return <div>No owner data retrieved.</div>;
    }
  
    return (
        <div className={properties.main_content_container}>
            <div className={newbillstat.main_content_div}>
                {/* ADD OTHER COLLECTIBLES MODAL */}
                {otherCollModal && (
                    <>
                        <div className={newbillstat.content_div_cta_row}>
                            <button className={newbillstat.backbtn_cont} onClick={closeOtherCollModal}>
                                <div className={newbillstat.backbtn_img_div}>
                                    <Image src={backBtn} alt="Back Icon" height={25} width={25}/>
                                </div>
                                <p>Back</p>
                            </button>
                        </div>

                        <div className={newbillstat.main_content_title_div}>
                            <h3 className={newbillstat.content_title}>{propertyData.prop_owner_lastname} | Residence - Add Collectibles</h3>
                        </div>

                        <div className={newbillstat.main_othercoll_form_div}>
                            <form className={newbillstat.main_othercoll_form} onSubmit={handleAddCollectible}>
                                <div className={newbillstat.othercoll_formgroup_div}>
                                    <p className={newbillstat.othercoll_formgroup_label}>Item Name</p>
                                    <input className={newbillstat.othercoll_formgroup_input_ITM} type="text"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    required />
                                </div>
                                <div className={newbillstat.othercoll_formgroup_div}>
                                    <p className={newbillstat.othercoll_formgroup_label}>Item Cost</p>
                                    <input className={newbillstat.othercoll_formgroup_input_ITMCST} type="number" step="0.01" 
                                    value={itemCost}
                                    onChange={(e) => setItemCost(e.target.value)}
                                    required/>
                                </div>
                                <div className={newbillstat.othercoll_formgroup_div}>
                                    <p className={newbillstat.othercoll_formgroup_label}>Collection Duration</p>
                                    <input className={newbillstat.othercoll_formgroup_input_DUR} type="number" placeholder="Number of Months"
                                    value={itemDuration}
                                    onChange={(e) => setItemDuration(e.target.value)}
                                    required/>
                                </div>
                                <div className={newbillstat.othercoll_formgroup_cta_div}>
                                    <button className={newbillstat.othercoll_formgroup_cta} type="submit">Save</button>
                                </div>
                            </form>
                        </div>
                    </>
                )}




                {/* SUMMARY MODAL HERE*/}
                {showSummaryModal && (
                    <div className={newbillstat.newbillstat_summary_modal}>
                        <div className={newbillstat.newbillstat_form_row}>
                            <div className={newbillstat.newbillstat_formgroup_info_div}>
                                <h6 className={newbillstat.newbillstat_formgroup_title}>Current Collectibles</h6>
                            </div>
                        </div>

                        <div className={newbillstat.newbillstat_form_row}>
                            <div className={newbillstat.newbillstat_formgroup_item_container}>
                                <div className={newbillstat.newbillstat_formgroup_item_div}>
                                    <p className={newbillstat.newbillstat_formgroup_item_label_FR}>FIXED RATE</p>
                                </div>

                                <div className={newbillstat.newbillstat_formgroup_item_div}>
                                    <p className={newbillstat.newbillstat_formgroup_item_label}>HOMEOWNER'S ASSOCIATION</p>
                                    <p className={newbillstat.newbillstat_formgroup_item_cont}>PHP {hoaFee}</p>
                                </div>

                                <div className={newbillstat.newbillstat_formgroup_item_div}>
                                    <p className={newbillstat.newbillstat_formgroup_item_label}>GARBAGE COLLECTION</p>
                                    <p className={newbillstat.newbillstat_formgroup_item_cont}>PHP {garbCharges}</p>
                                </div>

                                <div className={newbillstat.newbillstat_formgroup_item_div}>
                                    <p className={newbillstat.newbillstat_formgroup_item_label}>WATER CHARGES</p>
                                    <p className={newbillstat.newbillstat_formgroup_item_cont}>PHP {waterCharges}</p>
                                </div>

                                <div className={newbillstat.newbillstat_formgroup_item_div}>
                                    <p className={newbillstat.newbillstat_formgroup_item_label}>WATER CONSUMPTION</p>
                                    <p className={newbillstat.newbillstat_formgroup_item_cont}>PHP {waterConsump}</p>
                                </div>

                                <div className={newbillstat.newbillstat_formgroup_item_div}>
                                    <p className={newbillstat.newbillstat_formgroup_item_label}>WATER RATE</p>
                                    <p className={newbillstat.newbillstat_formgroup_item_cont}>PHP {waterRtApplied}</p>
                                </div>

                                <div className={newbillstat.newbillstat_formgroup_item_div}>
                                    <p className={newbillstat.newbillstat_formgroup_item_label}>COVERAGE PERIOD</p>
                                    <p className={newbillstat.newbillstat_formgroup_item_cont}>{billCovPeriod}</p>
                                </div>
                            </div>
                        </div>

                        <div className={newbillstat.newbillstat_form_row}>
                            <div className={newbillstat.newbillstat_form_divider}></div>
                        </div>

                        <div className={newbillstat.newbillstat_form_row}>
                            <div className={newbillstat.newbillstat_form_other_coll_container}>
                                <div className={newbillstat.newbillstat_form_other_coll_title_div}>
                                    <h6 className={newbillstat.newbillstat_form_other_coll_title}>OTHERS</h6>
                                </div>

                                <div className={newbillstat.newbillstat_form_other_coll_itemheader_div}>
                                    <div className={newbillstat.newbillstat_form_other_coll_itemheader_ITM_div}>
                                        <p className={newbillstat.newbillstat_form_other_coll_itemheader_ITM}>ITEM</p>
                                    </div>
                                    <div className={newbillstat.newbillstat_form_other_coll_itemheader_RM_div}>
                                        <p className={newbillstat.newbillstat_form_other_coll_itemheader_RM}>REMAINING MONTHS</p>
                                    </div>
                                    <div className={newbillstat.newbillstat_form_other_coll_itemheader_TD_div}>
                                        <p className={newbillstat.newbillstat_form_other_coll_itemheader_TD}>TOTAL DURATION</p>
                                    </div>
                                    <div className={newbillstat.newbillstat_form_other_coll_itemheader_CPM_div}>
                                        <p className={newbillstat.newbillstat_form_other_coll_itemheader_CPM}>CHARGE PER MONTH</p>
                                    </div>
                                    <div className={newbillstat.newbillstat_form_other_coll_itemheader_cta_div}>
                                        {!showSummaryModal && (
                                            <p className={newbillstat.newbillstat_form_other_coll_itemheader_cta}>ACTION</p>
                                        )}
                                    </div>
                                </div>
                                {otherColl.length > 0 ? (
                                    otherColl.map((collectible) => (
                                        <OtherCollectibleItem key={collectible.bll_other_coll_id} collInfo={collectible} summaryState={showSummaryModal}/>
                                    ))
                                ) : (
                                    <p>No additional collectibles</p> // Fallback message if no properties are found
                                )}
                            </div>
                        </div>

                        <div className={newbillstat.newbillstat_form_row}>
                            <div className={newbillstat.newbillstat_form_divider}></div>
                        </div>

                        <div className={newbillstat.newbillstat_form_submit_row}>
                            <div className={newbillstat.newbillstat_form_total_div}>
                                <p className={newbillstat.newbillstat_form_total}>PHP {totalBill}</p>
                            </div>

                            <div className={newbillstat.newbillstat_form_summary_cta}>
                                <button className={newbillstat.newbillstat_form_cancel_btn} onClick={closeSummaryModal}>Cancel</button>
                                <button className={newbillstat.newbillstat_form_submitsum_btn}
                                onClick={handleBillSubmit}
                                disabled={isProcessing}
                                >Submit</button>
                            </div>
                        </div>
                                
                    </div>
                )}



                {/* PROCESSING STATUS MODAL HERE */}
                {isProcessing && (
                    <h1>Saving Billing Statement...</h1>
                )}




                {/* NEW BILLING STATEMENT PAGE */}
                {!(otherCollModal || showSummaryModal || isProcessing) && (
                <>
                    <div className={newbillstat.content_div_cta_row}>
                        <Link href={`/properties/${prop_id}`} className={newbillstat.backbtn_cont}>
                            <div className={newbillstat.backbtn_img_div}>
                                <Image src={backBtn} alt="Back Icon" height={25} width={25}/>
                            </div>
                            <p>Back</p>
                        </Link>
                    </div>

                    <div className={newbillstat.main_content_title_div}>
                        <h3 className={newbillstat.content_title}>{propertyData.prop_owner_lastname} | Residence - New Billing Statement</h3>
                    </div>

                    <div className={newbillstat.main_newbillstat_container}>
                        <div className={newbillstat.main_propinf_info_div}>
                            <div className={newbillstat.propinf_info_img_div}>
                                <Image className={newbillstat.propinf_info_img} 
                                src={propertyData.prop_image_url} 
                                alt="House Photo"
                                layout="responsive"
                                width={500}
                                height={280} />
                            </div>

                            <div className={newbillstat.propinf_info_div}>
                                {/* ROW */}
                                <div className={newbillstat.propinf_info_row}>
                                    <div className={newbillstat.propinf_info_cont}>
                                        <p className={newbillstat.propinf_info_owner_label}>OWNER</p>
                                        <p className={newbillstat.propinf_info_owner}>{propertyData.prop_owner}</p>
                                    </div>
                                </div>

                                {/* ROW */}
                                <div className={newbillstat.propinf_info_row}>
                                    <div className={newbillstat.propinf_info_cont}>
                                        <p className={newbillstat.propinf_info_address_label}>ADDRESS</p>
                                        <p className={newbillstat.propinf_info_address}>{propertyData.prop_lot_num} {propertyData.prop_street}</p>
                                    </div>
                                </div>

                                {/* ROW */}
                                <div className={newbillstat.propinf_info_row}>
                                    <div className={newbillstat.propinf_info_cont}>
                                        <p className={newbillstat.propinf_info_email_label}>EMAIL</p>
                                        <p className={newbillstat.propinf_info_email}>{propertyData.prop_owner_email}</p>
                                    </div>

                                    <div className={newbillstat.propinf_info_cont}>
                                        <p className={newbillstat.propinf_info_phone_label}>PHONE</p>
                                        <p className={newbillstat.propinf_info_phone}>{propertyData.prop_owner_phone}</p>
                                    </div>
                                </div>
                            </div>   
                        </div>



                        <div className={newbillstat.main_newbillstat_form_div}>
                            <form className={newbillstat.newbillstat_form}>

                                <div className={newbillstat.newbillstat_form_row}>
                                    <div className={newbillstat.newbillstat_formgroup_item_div}>
                                        <p className={newbillstat.newbillstat_formgroup_item_label_TPC}>TOTAL PREVIOUS COLLECTIBLES</p>
                                        <p className={newbillstat.newbillstat_formgroup_item_cont_TPC}>PHP {prevCollTotal.totalDue}</p>
                                    </div>
                                </div>
                                

                                
                                <div className={newbillstat.newbillstat_form_row}>
                                    <div className={newbillstat.newbillstat_formgroup_info_div}>
                                        <h6 className={newbillstat.newbillstat_formgroup_title}>Current Collectibles</h6>
                                    </div>
                                </div>



                                <div className={newbillstat.newbillstat_form_row}>
                                    <div className={newbillstat.newbillstat_formgroup_item_container}>
                                        <div className={newbillstat.newbillstat_formgroup_item_div}>
                                            <p className={newbillstat.newbillstat_formgroup_item_label_FR}>FIXED RATE</p>
                                        </div>

                                        <div className={newbillstat.newbillstat_formgroup_item_div}>
                                            <p className={newbillstat.newbillstat_formgroup_item_label}>HOMEOWNER'S ASSOCIATION</p>
                                            <p className={newbillstat.newbillstat_formgroup_item_cont}>PHP {hoaFee}</p>
                                        </div>

                                        <div className={newbillstat.newbillstat_formgroup_item_div}>
                                            <p className={newbillstat.newbillstat_formgroup_item_label}>GARBAGE COLLECTION</p>
                                            <p className={newbillstat.newbillstat_formgroup_item_cont}>PHP {garbCharges}</p>
                                        </div>
                                    </div>
                                </div>



                                <div className={newbillstat.newbillstat_form_row}>
                                    <div className={newbillstat.newbillstat_form_divider}></div>
                                </div>



                                <div className={newbillstat.newbillstat_form_row}>
                                    <div className={newbillstat.newbillstat_form_col}>
                                        <div className={newbillstat.newbillstat_formgroup_input_div}>
                                            <p className={newbillstat.newbillstat_formgroup_input_label}>Current Water Reading</p>
                                            <input className={newbillstat.newbillstat_formgroup_input} 
                                            value={waterRead}
                                            onChange={(e) => setWaterRead(e.target.value)}/>
                                        </div>
                                    </div>

                                    <div className={newbillstat.newbillstat_form_col}>
                                        <div className={newbillstat.newbillstat_formgroup_vertitem_div}>
                                            <p className={newbillstat.newbillstat_formgroup_vertitem_label}>PREVIOUS WATER READING</p>
                                            <p className={newbillstat.newbillstat_formgroup_vertitem_cont}>{prevWaterRead.bll_water_consump} cu.m.</p>
                                        </div>
                                    </div>
                                </div>



                                <div className={newbillstat.newbillstat_form_row}>
                                    <div className={newbillstat.newbillstat_form_col}>
                                        <div className={newbillstat.newbillstat_formgroup_vertitem_div}>
                                            <p className={newbillstat.newbillstat_formgroup_vertitem_label}>TOTAL CONSUMPTION</p>
                                            <p className={newbillstat.newbillstat_formgroup_vertitem_cont}>{waterConsump} cu.m.</p>
                                        </div>

                                        <div className={newbillstat.newbillstat_formgroup_vertitem_div}>
                                            <p className={newbillstat.newbillstat_formgroup_vertitem_label}>WATER RATE APPLIED</p>
                                            <p className={newbillstat.newbillstat_formgroup_vertitem_cont}>PHP {waterRtApplied}</p>
                                        </div>
                                    </div>

                                    <div className={newbillstat.newbillstat_form_col}>
                                        <div className={newbillstat.newbillstat_formgroup_vertitem_div}>
                                            <p className={newbillstat.newbillstat_formgroup_vertitem_label_WTR}>WATER CHARGES</p>
                                            <p className={newbillstat.newbillstat_formgroup_vertitem_cont}>PHP {waterCharges}</p>
                                        </div>
                                    </div>
                                </div>



                                <div className={newbillstat.newbillstat_form_row}>
                                    <div className={newbillstat.newbillstat_form_col}>
                                        <div className={newbillstat.newbillstat_formgroup_input_div}>
                                            <p className={newbillstat.newbillstat_formgroup_input_label}>Billing Coverage Period</p>
                                            <input className={newbillstat.newbillstat_formgroup_input}
                                            placeholder="January 2024"
                                            value={billCovPeriod}
                                            onChange={(e) => setBillCovPeriod(e.target.value)}/>
                                        </div>
                                    </div>

                                    <div className={newbillstat.newbillstat_form_col}>
                                        <div className={newbillstat.newbillstat_formgroup_uploadinp_div}>
                                            <p className={newbillstat.newbillstat_formgroup_uploadinp_label}>Upload Proof of Water Billing</p>
                                            <input className={newbillstat.newbillstat_formgroup_uploadinp} type="file" onChange={(e) => setWaterProof(e.target.files[0])} accept="image/*" />
                                        </div>
                                    </div>
                                </div>



                                <div className={newbillstat.newbillstat_form_row}>
                                    <div className={newbillstat.newbillstat_form_divider}></div>
                                </div>



                                <div className={newbillstat.newbillstat_form_row}>
                                    <div className={newbillstat.newbillstat_form_other_coll_container}>
                                        <div className={newbillstat.newbillstat_form_other_coll_title_div}>
                                            <h6 className={newbillstat.newbillstat_form_other_coll_title}>OTHERS</h6>
                                            <div className={newbillstat.newbillstat_form_other_coll_cta_div}>
                                                <button className={newbillstat.newbillstat_form_other_coll_cta} onClick={openOtherCollModal}>Add</button>
                                            </div>
                                        </div>

                                        <div className={newbillstat.newbillstat_form_other_coll_itemheader_div}>
                                            <div className={newbillstat.newbillstat_form_other_coll_itemheader_ITM_div}>
                                                <p className={newbillstat.newbillstat_form_other_coll_itemheader_ITM}>ITEM</p>
                                            </div>
                                            <div className={newbillstat.newbillstat_form_other_coll_itemheader_RM_div}>
                                                <p className={newbillstat.newbillstat_form_other_coll_itemheader_RM}>REMAINING MONTHS</p>
                                            </div>
                                            <div className={newbillstat.newbillstat_form_other_coll_itemheader_TD_div}>
                                                <p className={newbillstat.newbillstat_form_other_coll_itemheader_TD}>TOTAL DURATION</p>
                                            </div>
                                            <div className={newbillstat.newbillstat_form_other_coll_itemheader_CPM_div}>
                                                <p className={newbillstat.newbillstat_form_other_coll_itemheader_CPM}>CHARGE PER MONTH</p>
                                            </div>
                                            <div className={newbillstat.newbillstat_form_other_coll_itemheader_cta_div}>
                                                <p className={newbillstat.newbillstat_form_other_coll_itemheader_cta}>ACTION</p>
                                            </div>
                                        </div>
                                        {otherColl.length > 0 ? (
                                            otherColl.map((collectible) => (
                                                <OtherCollectibleItem key={collectible.bll_other_coll_id} collInfo={collectible} summaryState={showSummaryModal}/>
                                            ))
                                        ) : (
                                            <p>No additional collectibles</p> // Fallback message if no properties are found
                                        )}
                                    </div>
                                </div>



                                <div className={newbillstat.newbillstat_form_row}>
                                    <div className={newbillstat.newbillstat_form_divider}></div>
                                </div>



                                <div className={newbillstat.newbillstat_form_submit_row}>
                                    <div className={newbillstat.newbillstat_form_total_div}>
                                        <p className={newbillstat.newbillstat_form_total}>PHP {totalBill}</p>
                                    </div>

                                    <button className={newbillstat.newbillstat_form_submit_btn} onClick={openSummaryModal}>Submit</button>
                                </div>


                            </form>
                        </div>
                    </div>
                </>
                )}
            </div>
        </div>
    )
}