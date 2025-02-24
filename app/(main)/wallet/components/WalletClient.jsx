"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// styles
import wallet from "../wallet.module.css";

// assets
import walletIcon from "@/public/svg/cvwallet_icon.svg";
import depositIcon from "@/public/svg/deposit_icon.svg";
import spendIcon from "@/public/svg/spend_icon.svg";

// components
import backBtn from '@/public/svg/backbtn.svg';
import WalletTransactionItem from "./WalletTransactionItem.js";

export default function WalletClient({userId}) {

  const [walletData, setWalletData] = useState([]); // State to store the user data
  const [wallHist, setWallHist] = useState([]);
  
  const [description, setDescription] = useState('');

  const [depositAmt, setDepositAmt] = useState('');
  const [spendAmt, setSpendAmt] = useState('');

  const [showDeposit, setShowDeposit] = useState(false);
  const [showSpend, setShowSpend] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch data when the component is mounted
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        // Determine the API URL based on the environment
          // Default to localhost if no environment variable is set

        

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/wallet`); // Call your API
        const data = await response.json(); // Parse the JSON response
        setWalletData(data); // Store the data in state
        setWallHist(data.villwall_trn_hist);
      } catch (error) {
        console.error('Error fetching data:', error); // Handle any errors
      }
    };

    fetchWallet(); // Trigger the fetch when the component mounts
  }, [showDeposit, showSpend]); // The empty dependency array ensures this only runs on initial render


  const handleShowDeposit = () => {
    setShowDeposit(true);
    setShowSpend(false);
  };

  const handleShowSpend = () => {
    setShowSpend(true);
    setShowDeposit(false);
  };

  const handleCloseModal = () => {
    setShowDeposit(false);
    setShowSpend(false);
    setDepositAmt("")
    setSpendAmt("")
    setDescription("")
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
       
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/wallet/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: depositAmt, description, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to process deposit");
      }

      // Refetch wallet data
      const updatedData = await response.json();
      setWalletData(updatedData);
      setWallHist(updatedData.villwall_trn_hist);
      handleCloseModal();
    } catch (error) {
      console.error("Error processing deposit:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpendSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
       

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/wallet/spend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: spendAmt, description, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to process spend");
      }

      // Refetch wallet data
      const updatedData = await response.json();
      setWalletData(updatedData);
      setWallHist(updatedData.villwall_trn_hist);
      handleCloseModal();
    } catch (error) {
      console.error("Error processing spend:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={wallet.main_content_container}>
      <div className={wallet.main_content_div}>
        <div className={wallet.main_walletinfo_row}>
          <div className={wallet.main_walletbal_container}>
            <div className={wallet.walletbal_photo_div}>
              <Image className={wallet.walletbal_photo} src={walletIcon} alt="Wallet Icon" width={150} height={150} />
            </div>
            <div className={wallet.walletbal_info_div}>
              <p className={wallet.walletbal_info}>PHP {walletData.villwall_tot_bal}</p> 
            </div>
          </div>

          <div className={wallet.main_walletact_container}>
            <p className={wallet.walletact_title}>Wallet Actions</p>
            <div className={wallet.walletact_cta_div}>
              <button className={wallet.walletact_cta_deposit_btn} onClick={handleShowDeposit}>
                <div className={wallet.walletact_cta_deposit_btn_cont}>
                  <Image className={wallet.walletact_cta_deposit_btn_icon} src={depositIcon} alt="Deposit Icon" width={30} height={30} />
                  <p className={wallet.walletact_cta_deposit_btn_cont_label}>DEPOSIT</p>
                </div>
              </button>
              <button className={wallet.walletact_cta_spend_btn} onClick={handleShowSpend}>
                <div className={wallet.walletact_cta_spend_btn_cont}>
                  <Image className={wallet.walletact_cta_spend_btn_icon} src={spendIcon} alt="Spend Icon" width={30} height={30} />
                  <p className={wallet.walletact_cta_spend_btn_cont_label}>SPEND</p>
                </div>
              </button>
            </div>
          </div>
        </div>



        {/* MAIN WALLET CONTENT */}
        {!showDeposit && !showSpend && (
          <>
            <div className={ `${wallet.main_wallettrans_row} overflow-auto`}>
              <div className={`${wallet.main_wallettrans_cta_div}`}>
                <p className={wallet.wallettrans_title}>Recent Wallet Transactions</p>
              </div>

              <div className={wallet.main_wallettrans_list_container}>
                <div className={wallet.wallettrans_list_label_div}>
                  <div className={wallet.wallettrans_list_date_label_div}>
                    <p className={wallet.wallettrans_list_date_label}>DATE</p>
                  </div>
                  <div className={wallet.wallettrans_list_trnid_label_div}>
                    <p className={wallet.wallettrans_list_trnid_label}>TRN. ID</p>
                  </div>
                  <div className={wallet.wallettrans_list_type_label_div}>
                    <p className={wallet.wallettrans_list_type_label}>TYPE</p>
                  </div>
                  <div className={wallet.wallettrans_list_type_label_div}>
                    <p className={wallet.wallettrans_list_type_label}>DESCRIPTION</p>
                  </div>
                  <div className={wallet.wallettrans_list_cta_label_div}>
                    <p className={wallet.wallettrans_list_cta_label}>ACTION</p>
                  </div>
                </div>

                {wallHist?.length > 0 ? (
                  wallHist?.slice(0)?.reverse()?.map((walletHist, index) => (
                    <WalletTransactionItem key={index} wallTrans={walletHist} />
                  ))
                ) : (
                  <p>No wallet history yet</p> // Fallback message
                )}
              </div>
            </div>
          </>
        )}

        {/* WALLET DEPOSIT MODAL */}
        {showDeposit && (
          <>
            <div className={wallet.main_modal_content_div}>
              <div className={wallet.main_modal_back_btn_div}>
                <button className={wallet.backbtn_cont} onClick={handleCloseModal}>
                  <div className={wallet.backbtn_img_div}>
                    <Image src={backBtn} alt="Back Icon" height={25} width={25}/>
                  </div>
                  <p>Back</p>
                </button>
              </div>

              <div className={wallet.main_modal_form_row}>

                <p className={wallet.walletact_title}>Deposit</p>

                <div className={wallet.main_modal_form_div}>
                  <form className={wallet.modal_form}>
                    <div className={wallet.modal_formgroup_row}>
                      <div className={wallet.modal_formgroup_div}>
                        <p className={wallet.modal_formgroup_label}>Deposit Amount</p>
                        <input className={wallet.modal_formgroup_input}
                        type="number" step="0.01"
                        value={depositAmt}
                        onChange={(e) => setDepositAmt(e.target.value)}
                        required />
                      </div>

                      <div className={wallet.modal_formgroup_div}>
                        <p className={wallet.modal_formgroup_label}>Description</p>
                        <input className={wallet.modal_formgroup_input}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required />
                      </div>
                    </div>

                    <div className={wallet.main_modal_cta_row}>
                      <button className={wallet.main_modal_submit}
                      onClick={handleDepositSubmit}
                      disabled={isProcessing}>Submit</button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </>
        )}

        {/* WALLET SPEND MODAL */}
        {showSpend && (
          <>
            <div className={wallet.main_modal_content_div}>
              <div className={wallet.main_modal_back_btn_div}>
                <button className={wallet.backbtn_cont} onClick={handleCloseModal}>
                  <div className={wallet.backbtn_img_div}>
                    <Image src={backBtn} alt="Back Icon" height={25} width={25}/>
                  </div>
                  <p>Back</p>
                </button>
              </div>

              <div className={wallet.main_modal_form_row}>
                <p className={wallet.walletact_title}>Spend</p>
                <div className={wallet.main_modal_form_div}>
                  <form className={wallet.modal_form}>
                  <div className={wallet.modal_formgroup_row}>
                      <div className={wallet.modal_formgroup_div}>
                        <p className={wallet.modal_formgroup_label}>Spend Amount</p>
                        <input className={wallet.modal_formgroup_input}
                        type="number" step="0.01"
                        value={spendAmt}
                        onChange={(e) => setSpendAmt(e.target.value)}
                        required />
                      </div>
                      <div className={wallet.modal_formgroup_div}>
                        <p className={wallet.modal_formgroup_label}>Description</p>
                        <input className={wallet.modal_formgroup_input}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required />
                      </div>
                    </div>

                    <div className={wallet.main_modal_cta_row}>
                      <button className={wallet.main_modal_submit}
                      onClick={handleSpendSubmit}
                      disabled={isProcessing}>Submit</button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </>
        )}
        
      </div>

    </div>
  );
}
