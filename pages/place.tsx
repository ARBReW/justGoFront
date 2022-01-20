import Link from "next/link";

export default function place() {
  return (
    <>
      <div>WELCOME TO PLACE</div>
      <Link href='/selection'>Go to Selection</Link>
      <Link href='/navigation'>Go to Navigation</Link>
    </>
  );
}
