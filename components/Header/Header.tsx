import Image from "next/image";
import styles from "./Header.module.scss";
import logo from "@assets/logo-horizontal.png";
import mobileLogo from "@assets/logo-vertical.png";
import Link from "next/link";
import { NavLink } from "@/types";
import { NavLinks } from "../NavLinks";

const BASE_URL = "";
const links: NavLink[] = [{ displayName: "Design Decisions", url: "/decisions" }];

export const Header = () => (
  <header className={styles.header}>
    <Link className={styles.logoLink} href={BASE_URL}>
      <Image className={styles.logo} src={logo} alt="Food finder Logo" />
    </Link>
    <Link className={styles.mobileLogoLink} href={BASE_URL}>
      <Image className={styles.logo} src={mobileLogo} alt="Food finder Logo" />
    </Link>
    <div className={styles.linkContainer}>
      <NavLinks links={links} />
    </div>
  </header>
);
