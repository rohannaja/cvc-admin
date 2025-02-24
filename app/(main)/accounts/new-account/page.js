"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// styles
import accounts from "../accounts.module.css";
import newacc from "./newacc.module.css"

// assets
import backBtn from '@/public/svg/backbtn.svg';
import { defProfPic } from "../../../api/services/constants.js";

export default function NewAccount() {
  // State to track input values
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // To display validation errors
  const [successStat, setSuccessStat] = useState(""); // To display success status
  const [showSummaryModal, setShowSummaryModal] = useState(false); // Modal visibility
  const [isProcessing, setIsProcessing] = useState(false); // Track whether backend is processing

  // Validate form
  const validateForm = () => {
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    
    if (!firstName || !lastName || !age || !dob || !phone || !email || !role || !username || !password || !confirmPassword) {
      setError("*All fields are required.");
      return false;
    }
    if (!validateEmail(email)) {
      setError("*Enter a valid email address.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("*Passwords do not match.");
      return false;
    }
    if (password.length < 8 && confirmPassword.length < 8) {
      setError("*Password should be at least 8 characters")
      return false;
    }
    return true;
  };

  // Handle form submission (after confirmation)
  const handleConfirm = async () => {
    // Set processing state to true
    setIsProcessing(true);
    setError("");

    const newAccountData = {
      username: username,
      password: password,
      first_name: firstName,
      last_name: lastName,
      age: age,
      date_of_birth: dob, // Format date if necessary
      phone: phone,
      email: email,
      role: role,
    };

    try {
      // Determine the API URL based on the environment
       

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/create_account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccountData),
      });

      if (response.ok) {
        setShowSummaryModal(false); // Close modal after successful submission
        // Optionally reset the form
        setFirstName("");
        setLastName("");
        setAge("");
        setDob("");
        setPhone("");
        setEmail("");
        setRole("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        setSuccessStat("Account created successfully! Check the user's email.");
      } else {
        const data = await response.json();
        if (data.error === 'Username already exists') {
          setShowSummaryModal(false);
          setError("*Username already exists. Please choose another one.");
        } else {
          setShowSummaryModal(false);
          setError("*Failed to create account.");
        }
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setShowSummaryModal(false);
      setError("*Error creating account. Please try again later.");
    } finally {
      // Set processing state to false
      setIsProcessing(false);
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
    <div className={accounts.main_content_container}>

      <div className={newacc.main_content_div}>
        {/* Account Processing UI */}
        {isProcessing ? (
          <div className={newacc.main_modal_overlay}>
            <div className={newacc.main_modal_content}>
              <h2>Account Processing...</h2> {/* Display processing message */}
            </div>
          </div>
        ) : (
          <>
            {/* Account Creation Summary Modal */}
            {showSummaryModal && (
              <div className={newacc.main_modal_overlay}>
                <div className={newacc.main_modal_content}>
                  <h4>Account Creation Summary</h4>
                  <p><strong>First Name:</strong> {firstName}</p>
                  <p><strong>Last Name:</strong> {lastName}</p>
                  <p><strong>Age:</strong> {age}</p>
                  <p><strong>Date of Birth:</strong> {dob}</p>
                  <p><strong>Phone:</strong> {phone}</p>
                  <p><strong>Email:</strong> {email}</p>
                  <p><strong>Role:</strong> {role}</p>
                  <p><strong>Username:</strong> {username}</p>

                  <div className={newacc.main_modal_buttons}>
                    <button className={newacc.modal_formsubmit_secbtn} onClick={() => setShowSummaryModal(false)}>
                      Edit
                    </button>
                    <button className={newacc.modal_formsubmit_btn} onClick={handleConfirm}>
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!showSummaryModal && !isProcessing && (
          <>
            <div className={newacc.content_div_cta_row}>
              <Link href="/accounts" className={newacc.backbtn_cont}>
                <div className={newacc.backbtn_img_div}>
                  <Image src={backBtn} alt="Back Icon" height={25} width={25}/>
                </div>
                <p>Back</p>
              </Link>
            </div>

            <div className={newacc.main_content_title_div}>
              <h3 className={newacc.content_title}>New Account</h3>
            </div>

            <div className={newacc.main_newacc_div}>
              <div className={newacc.newacc_avatar_div}>
                <Image className={newacc.newacc_avatar} src={defProfPic} alt="Default Profile Photo" width={150} height={150} />
                <p className={newacc.newacc_avatar_disc}>*You can add the user's photo after user creation.</p>
              </div>

              <div className={newacc.newacc_form_div}>

                <form className={newacc.newacc_form} onSubmit={(e) => e.preventDefault()}>
                  {/* Success message */}
                  {successStat && <p className={newacc.newacc_form_successmess}>{successStat}</p>}
                  {/* Error message */}
                  {error && <p className={newacc.newacc_form_errormess}>{error}</p>}

                  <div className={newacc.newacc_formsec_title}>
                    <p className={newacc.formsec_title}>Personal Details</p>
                  </div>

                  {/* ROW */}
                  <div className={newacc.newacc_formrow}>
                    {/* COLUMN */}
                    <div className={newacc.newacc_formcol}>
                      <div className={newacc.newacc_formgroup}>
                        <div className={newacc.newacc_formgroup_label_div}>
                          <p className={newacc.newacc_formgroup_label}>First Name</p>
                        </div>
                        <div className={newacc.newacc_formgroup_input_div}>
                          <input 
                          className={newacc.newacc_formgroup_firstname_input}
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={showSummaryModal}></input>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN */}
                    <div className={newacc.newacc_formcol}>
                      <div className={newacc.newacc_formgroup}>
                        <div className={newacc.newacc_formgroup_label_div}>
                          <p className={newacc.newacc_formgroup_label}>Last Name</p>
                        </div>
                        <div className={newacc.newacc_formgroup_input_div}>
                          <input 
                          className={newacc.newacc_formgroup_lastname_input}
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={showSummaryModal}></input>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ROW */}
                  <div className={newacc.newacc_formrow}>
                    {/* COLUMN */}
                    <div className={newacc.newacc_formcol}>
                      <div className={newacc.newacc_formgroup_AGE}>
                        <div className={newacc.newacc_formgroup_label_div}>
                          <p className={newacc.newacc_formgroup_label}>Age</p>
                        </div>
                        <div className={newacc.newacc_formgroup_input_div}>
                          <input 
                          className={newacc.newacc_formgroup_age_input}
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          disabled={showSummaryModal}></input>
                        </div>
                      </div>

                      <div className={newacc.newacc_formgroup_DOB}>
                        <div className={newacc.newacc_formgroup_label_div}>
                          <p className={newacc.newacc_formgroup_label}>Date of Birth</p>
                        </div>
                        <div className={newacc.newacc_formgroup_input_div}>
                          <input 
                          className={newacc.newacc_formgroup_dateob_input}
                          type="text"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          disabled={showSummaryModal}
                          placeholder="January 1, 2024"></input>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN */}
                    <div className={newacc.newacc_formcol}>
                      <div className={newacc.newacc_formgroup}>
                        <div className={newacc.newacc_formgroup_label_div}>
                          <p className={newacc.newacc_formgroup_label}>Phone</p>
                        </div>
                        <div className={newacc.newacc_formgroup_input_div}>
                          <input 
                          className={newacc.newacc_formgroup_phone_input}
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={showSummaryModal}
                          placeholder="9123456789"></input>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ROW */}
                  <div className={newacc.newacc_formrow}>
                    {/* COLUMN */}
                    <div className={newacc.newacc_formcol}>
                      <div className={newacc.newacc_formgroup}>
                        <div className={newacc.newacc_formgroup_label_div}>
                          <p className={newacc.newacc_formgroup_label}>Email</p>
                        </div>
                        <div className={newacc.newacc_formgroup_input_div}>
                          <input 
                          className={newacc.newacc_formgroup_email_input}
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={showSummaryModal}></input>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN */}

                    <div className={newacc.newacc_formcol}>
                      <div className={newacc.newacc_formgroup}>
                        <div className={newacc.newacc_formgroup_label_div}>
                          <p className={newacc.newacc_formgroup_label}>Role</p>
                        </div>
                        <div className={newacc.newacc_formgroup_input_div}>
                          <select 
                            className={newacc.newacc_formgroup_role_input}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled={showSummaryModal}
                          >
                            <option value="" disabled>Select Role</option> {/* Placeholder */}
                            <option value="admin">admin</option>
                            <option value="officer">officer</option>
                            <option value="homeowner">homeowner</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className={newacc.newacc_formsec_title}>
                    <p className={newacc.formsec_title}>Account Credentials</p>
                  </div>

                  {/* ROW */}
                  <div className={newacc.newacc_formrow}>
                    {/* COLUMN */}
                    <div className={newacc.newacc_formcol}>
                      <div className={newacc.newacc_formgroup}>
                        <div className={newacc.newacc_formgroup_label_div}>
                          <p className={newacc.newacc_formgroup_label}>Username</p>
                        </div>
                        <div className={newacc.newacc_formgroup_input_div}>
                          <input 
                          className={newacc.newacc_formgroup_username_input}
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={showSummaryModal}></input>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ROW */}
                  <div className={newacc.newacc_formrow}>
                    {/* COLUMN */}
                    <div className={newacc.newacc_formcol}>
                      <div className={newacc.newacc_formgroup}>
                        <div className={newacc.newacc_formgroup_label_div}>
                          <p className={newacc.newacc_formgroup_label}>Password</p>
                        </div>
                        <div className={newacc.newacc_formgroup_input_div}>
                          <input 
                          className={newacc.newacc_formgroup_password_input}
                          type="text"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={showSummaryModal}></input>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN */}
                    <div className={newacc.newacc_formcol}>
                      <div className={newacc.newacc_formgroup}>
                        <div className={newacc.newacc_formgroup_label_div}>
                          <p className={newacc.newacc_formgroup_label}>Confirm Password</p>
                        </div>
                        <div className={newacc.newacc_formgroup_input_div}>
                          <input 
                          className={newacc.newacc_formgroup_confpassword_input}
                          type="text"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={showSummaryModal}></input>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ROW */}
                  <div className={newacc.newacc_formrow}>
                    {/* COLUMN */}
                    <div className={newacc.newacc_formcol}>
                      <button className={newacc.newacc_formsubmit_btn}
                      type="button" onClick={handleSave}>Save</button>
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
