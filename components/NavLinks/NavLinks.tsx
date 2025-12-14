"use client";
import { NavLink } from "@/types";
import Link from "next/link";
import styles from "./NavLinks.module.scss";
import menuIcon from "@assets/menu-icon.svg";
import closeIcon from "@assets/close-icon.svg";
import Image from "next/image";
import { useCallback, useState } from "react";
import cx from "classnames";

type NavLinksProps = {
  links: readonly NavLink[];
};

export const NavLinks = ({ links }: NavLinksProps) => {
  const [sideNavActive, setSideNavActive] = useState(false);
  const toggleSideNav = useCallback(
    (e: React.MouseEvent<HTMLButtonElement | Element, MouseEvent>) => {
      e.stopPropagation();
      console.info("set side nav");
      setSideNavActive((prevState) => !prevState);
    },
    []
  );
  return (
    <>
      {links.map(({ displayName, url }) => (
        <Link key={url} href={url} className={styles.link}>
          {displayName}
        </Link>
      ))}
      <button className={styles.sideNavMenu} onClick={toggleSideNav}>
        <Image src={menuIcon} alt="Side bar menu icon"></Image>
      </button>
      <div
        className={cx(styles.sideNavOverlayContainer, {
          [styles.sideNavOverlayContainerActive]: sideNavActive,
          [styles.sideNavOverlayContainerExit]: !sideNavActive,
        })}
      >
        <div className={styles.sideNavOverlay} onClick={toggleSideNav} />
        <div className={cx(styles.sideNav, { [styles.sideNavActive]: sideNavActive })}>
          <div className={styles.sideNavHeader}>
            <button className={styles.sideNavClose} onClick={toggleSideNav}>
              <Image src={closeIcon} alt="Close sidebar icon"></Image>
            </button>
          </div>
          {links.map(({ displayName, url }) => (
            <Link key={url} href={url} className={styles.mobileLink}>
              {displayName}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
