import { use, useContext } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";

export function Header() {
  const { signOut } = useContext(AuthContext);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContet}>
        <Link href="/dashboard">
          <Image src="/logo.svg" width={190} height={60} alt="Home" />
        </Link>
        <nav className={styles.menuNav}>
          <Link href="/category">Categoria</Link>
          <Link href="/product">Cardapio</Link>

          <button onClick={signOut}>
            <FiLogOut color="#FFF" size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
}
