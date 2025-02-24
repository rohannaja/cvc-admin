"use client"

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// styles
import announce from "./announce.module.css";

// assets


export default function Announcements() {
  return (
    <div className={announce.main_content_container}>

      <div className={announce.main_content_div}>
        <h2>LAUNCHING</h2>
        <h2>SOON!</h2>
      </div>

    </div>
  );
}
