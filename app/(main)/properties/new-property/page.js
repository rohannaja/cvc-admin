"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// styles
import properties from "../properties.module.css";
import newprop from "./newprop.module.css";

// assets
import backBtn from "@/public/svg/backbtn.svg";
import { defHousePic } from "../../../api/services/constants.js";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
export default function NewProperty() {
  const [homeownerID, setHomeownerID] = useState("");
  const [propertyLot, setPropertyLot] = useState("");
  const [propertyStreet, setPropertyStreet] = useState("");
  const [error, setError] = useState(""); // To display validation errors
  const [successStat, setSuccessStat] = useState(""); // To display success status
  const [showSummaryModal, setShowSummaryModal] = useState(false); // Modal visibility
  const [isProcessing, setIsProcessing] = useState(false); // Track whether backend is processing

  const { data: users, status } = useQueryProcessor({
    url: "/user",
    queryParams: {
      role: "homeowner",
    },
    key: ["users", "homeowner"],
  });

  // Validate form
  const validateForm = () => {
    if (!homeownerID || !propertyLot || !propertyStreet) {
      setError("*All fields are required.");
      return false;
    }

    // Add more validation rules if needed (for example, format checking for IDs)
    return true;
  };

  // Handle Confirm Button Click
  const handleConfirm = async () => {
    setIsProcessing(true); // Set processing state to true to show a loading indicator
    setError(""); // Reset any previous error

    // Prepare the data to send to the backend
    const newPropertyData = {
      homeownerID: homeownerID, // usr_id of the user (homeownerID from the input field)
      propertyLot: propertyLot, // Lot number from the input field
      propertyStreet: propertyStreet, // Street number from the input field
    };

    try {
      // Determine the API URL based on the environment
       

      // Send POST request to create the new property
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/create_property`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPropertyData), // Send the form data to the backend
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessStat(result.message); // Display success message

        // Optionally reset the form fields after successful submission
        setHomeownerID("");
        setPropertyLot("");
        setPropertyStreet("");
        setShowSummaryModal(false); // Close modal
      } else {
        const errorData = await response.json();
        setError(errorData.error || "*Failed to create property");
        setShowSummaryModal(false);
      }
    } catch (error) {
      console.error("Error creating property:", error);
      setError("*Error creating property. Please try again later.");
    } finally {
      setIsProcessing(false); // Reset processing state
    }
  };

  // Handle Save Button Click (show modal)
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    setShowSummaryModal(true); // Show the summary modal
  };

  return (
    <div className={properties.main_content_container}>
      <div className={newprop.main_content_div}>
        {/* Account Processing UI */}
        {isProcessing ? (
          <div className={newprop.main_modal_overlay}>
            <div className={newprop.main_modal_content}>
              <h2>Processing...</h2> {/* Display processing message */}
            </div>
          </div>
        ) : (
          <>
            {/* Account Creation Summary Modal */}
            {showSummaryModal && (
              <div className={"flex justify-center items-center h-full"}>
                <div className={"flex flex-col space-y-5"}>
                  <h4>Property Creation Summary</h4>
                  <p>
                    <strong>Homeowner ID:</strong> {homeownerID}
                  </p>
                  <p>
                    <strong>Lot Number:</strong> {propertyLot}
                  </p>
                  <p>
                    <strong>Street:</strong> {propertyStreet}
                  </p>

                  <div className={"flex space-x-5 mt-5"}>
                    <Button
                    variant="outline"
                      onClick={() => setShowSummaryModal(false)}
                    >
                      Edit
                    </Button>
                    <Button className={"bg-green-600"} onClick={handleConfirm}>
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!showSummaryModal && !isProcessing && (
          <>
            <div className={newprop.content_div_cta_row}>
              <Link href="/properties" className={newprop.backbtn_cont}>
                <div className={newprop.backbtn_img_div}>
                  <Image src={backBtn} alt="Back Icon" height={25} width={25} />
                </div>
                <p>Back</p>
              </Link>
            </div>

            <div className={newprop.main_content_title_div}>
              <h3 className={newprop.content_title}>New Property</h3>
            </div>

            <div className={newprop.main_newprop_div}>
              <div className={newprop.newprop_photo_div}>
                <Image
                  className={newprop.newprop_photo}
                  src={defHousePic}
                  alt="Default House Pic"
                  width={500}
                  height={280}
                />
                <p className={newprop.newprop_photo_disc}>
                  *You can add a photo of the house after property creation.
                </p>
              </div>

              <div className={newprop.newprop_form_div}>
                <form className={newprop.newprop_form}>
                  {/* Success message */}
                  {successStat && (
                    <p className={newprop.newprop_form_successmess}>
                      {successStat}
                    </p>
                  )}
                  {/* Error message */}
                  {error && (
                    <p className={newprop.newprop_form_errormess}>{error}</p>
                  )}

                  <div className={newprop.newprop_formsec_title}>
                    <p className={newprop.formsec_title}>Homeowner Details</p>
                  </div>

                  {/* ROW */}
                  <div className={newprop.newprop_formrow}>
                    {/* COLUMN */}
                    <div className={newprop.newprop_formcol}>
                      <div className={newprop.newprop_formgroup_HOWID}>
                        <div className={newprop.newprop_formgroup_label_div}>
                          <p className={newprop.newprop_formgroup_label}>
                            Homeowner ID
                          </p>
                        </div>
                        <div className={newprop.newprop_formgroup_input_div}>
                          <Select
                            onValueChange={(value) => setHomeownerID(value)}
                          >
                            <SelectTrigger className="rounded-xl border-black">
                              <SelectValue placeholder="Select a home owner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {users?.map((user) => (
                                  <SelectItem value={user?.usr_id}>
                                    {user?.usr_first_name} {user?.usr_last_name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className={newprop.newprop_formgroup_LOTNUM}>
                        <div className={newprop.newprop_formgroup_label_div}>
                          <p className={newprop.newprop_formgroup_label}>Lot</p>
                        </div>
                        <div className={newprop.newprop_formgroup_input_div}>
                          <input
                            className={newprop.newprop_formgroup_propnum_input}
                            type="text"
                            value={propertyLot}
                            onChange={(e) => setPropertyLot(e.target.value)}
                            disabled={showSummaryModal}
                          ></input>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN */}
                    <div className={newprop.newprop_formcol}>
                      <div className={newprop.newprop_formgroup}>
                        <div className={newprop.newprop_formgroup_label_div}>
                          <p className={newprop.newprop_formgroup_label}>
                            Street
                          </p>
                        </div>
                        <div className={newprop.newprop_formgroup_input_div}>
                          <input
                            className={
                              newprop.newprop_formgroup_propstreet_input
                            }
                            type="text"
                            value={propertyStreet}
                            onChange={(e) => setPropertyStreet(e.target.value)}
                            disabled={showSummaryModal}
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ROW */}
                  <div className={newprop.newprop_formrow}>
                    {/* COLUMN */}
                    <div className={newprop.newprop_formcol}>
                      <button
                        className={newprop.newprop_formsubmit_btn}
                        type="button"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
