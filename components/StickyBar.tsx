import React from "react";
import styles from "./StickyBar.module.css";

export function StickyBar() {
  return (
    <div className={styles.stickyBar}>
      <button className={styles.donateButton}>Faire un don</button>
    </div>
  );
}
