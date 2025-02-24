"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

// styles
import styles from "./page.module.css";

// assets
import cvlogo from "@/public/svg/cvconn_logo.svg";

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const router = useRouter();

    const {status, data} = useSession()

    useEffect(() => {
        if(status === "authenticated" && data?.user.usr_id ) {
            router.push(`/dashboard`);
        }
    }, [status])


  const handleLogin = async (e) => {
    e.preventDefault();

    if (username && password != "") {
      setLoginMessage("Logging you in...")
    } else if (username == "" || password == "") {
      setLoginMessage("Fill in all fields")
    }
  
    const result = await signIn("credentials", {
      redirect: false,
      username,  // Ensure these variables are set correctly
      password,
    });
  
    if (result && result.ok) {
      router.push("/dashboard"); // Redirect to dashboard on successful login
    } else {
      setLoginMessage(result?.error || "Invalid login credentials");
    }
  };

  return (
    <main className={styles.main}>

      <div className={styles.main_container}>

        <div className={styles.main_hero_div}>
          <div className={styles.main_hero_logo_div}>
            <div className={styles.hero_logo}>
              <Image src={cvlogo} alt="CVConnect Logo" height={80}/>
            </div>
          </div>

          <div className={styles.main_hero_info_div}>
            <h2>Welcome to</h2>
            <h2>CV CONNECT!</h2>
          </div>

          <div className={styles.main_hero_ver_div}>
            <p className={styles.hero_ver}>ADMIN PORTAL v1.0.0</p>
          </div>
        </div>



        <div className={styles.main_login_div}>
          <div className={styles.main_login_head_div}>
            <h2>Login</h2>
          </div>

          <div className={styles.main_login_form_container}>

            <div className={styles.main_login_form_div}>
              <form className={styles.login_form}>
                <p className={styles.login_message}>{loginMessage}</p>
                <div className={styles.login_formgroup}>
                  <p className={styles.formgroup_label}>Username</p>
                  <input
                    className={styles.formgroup_input}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className={styles.login_formgroup}>
                  <p className={styles.formgroup_label}>Password</p>
                  <input
                    className={styles.formgroup_input}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className={styles.login_cta_div}>
                  <button className={styles.login_cta_btn} type="submit" onClick={handleLogin}>
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
