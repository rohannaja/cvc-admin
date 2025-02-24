"use client"

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// styles
import votpoll from "./votpoll.module.css";

// assets


export default function VotingPolls() {
  return (
    <div className={votpoll.main_content_container}>

      <div className={votpoll.main_content_div}>
        <h2>LAUNCHING</h2>
        <h2>SOON!</h2>
      </div>

    </div>
  );
}
