import styles from "./Header.module.scss";
import Link from "next/link";
import MusicIcon from "../../public/music-icon.svg";
import SearchIcon from "../../public/search-icon.svg";
import { FormEvent, useEffect, useState } from "react";

export const Header = () => {
  const [search, setSearch] = useState("");

  const handleSearchInput = (e: FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(search);
  };

  return (
    <header className={styles.header}>
      <Link href="/">
        <a className={styles.logoLink}>
          <MusicIcon />
          <span>MusicApp2</span>
        </a>
      </Link>
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <div className={[styles.searchInputWrapper, search ? styles.active : ""].join(" ")}>
          <label className={styles.searchInputLabel} htmlFor="search-songs">
            Search
          </label>
          <input
            className={styles.searchInput}
            type="search"
            name="search-songs"
            id="search-songs"
            onInput={handleSearchInput}
            value={search}
          />
        </div>
        <button className={styles.submitButton} type="submit">
          <span className="visuallyhidden">Szukaj</span>
          <span aria-hidden="true">
            <SearchIcon />
          </span>
        </button>
      </form>
    </header>
  );
};
