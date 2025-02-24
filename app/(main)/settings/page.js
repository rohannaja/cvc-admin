import Link from "next/link";

// styles
import settings from "./settings.module.css";

// assets

// components

export default function Settings() {
    return (
        <div className={settings.main_content_container}>
            <div className={settings.main_content_div}>
                <div className={settings.main_settings_sidebar_div}>
                    <div className={settings.settings_sidebar_nav_div}>
                        <nav className={settings.sidebar_navlist_div}>
                            <ul className={settings.sidebar_navlist}>
                                <li className={`${settings.sidebar_navlist_item}`}>
                                    <Link href="/settings/hoa-rates">
                                        HOA Rates
                                    </Link>
                                </li>

                                <li className={`${settings.sidebar_navlist_item}`}>
                                    <Link href="/settings/water-rates">
                                        Water Rates
                                    </Link>
                                </li>

                                <li className={`${settings.sidebar_navlist_item}`}>
                                    <Link href="/settings/garbage-collection">
                                        Garbage Collection
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className={settings.main_settings_content_div}>
                    <div className={settings.main_settings_content}>
                        <p className={settings.settings_content_ins}>Adjust your system settings instantly. These settings should only be modified upon approval of all officers.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}