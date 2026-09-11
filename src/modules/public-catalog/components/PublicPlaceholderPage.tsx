import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { PublicShell } from "./PublicShell";
import styles from "./public-catalog.module.css";

type PublicPlaceholderPageProps = { title: string; description: string };

export function PublicPlaceholderPage({ title, description }: PublicPlaceholderPageProps) {
  return <PublicShell><main className={styles.placeholder}><div><Construction size={42} /><h1>{title}</h1><p>{description}</p><Link className={styles.primaryButton} href="/"><ArrowLeft size={17} />Volver al inicio</Link></div></main></PublicShell>;
}
