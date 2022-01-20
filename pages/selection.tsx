import Link from "next/link";

export default function selection() {
  return (
    <>
      <div>WELCOME TO SELECTION</div>
      <Link href="/place">Go to Place</Link>
      <Link href='/otsukare'>Go to Otsukare</Link>
    </>
  );
}
