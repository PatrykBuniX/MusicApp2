import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { Header } from "../components/Header/Header";

export default function Home() {
  return (
    <div>
      <div className={styles.appWrapper}>
        <Header />
        <main>musicapp2</main>
      </div>
    </div>
  );
}
