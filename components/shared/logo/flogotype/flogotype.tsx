/* eslint-disable-next-line */
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
export interface FLogotypeProps {
  scaleFactor: number;
  classes?: string;
  setSelected: any;
}

export function Logotype({
  scaleFactor,
  classes = "",
  setSelected,
}: FLogotypeProps) {
  const router = useRouter();

  return (
    <div
      className={classes}
      onClick={() => {
        setSelected([]);
        router.push("/");
      }}
    >
      <Image
        alt="Niese Caravan logo"
        layout="fixed"
        width={410 / scaleFactor}
        height={109 / scaleFactor}
        src="/logo/logo.png"
      />
    </div>
  );
}

export default Logotype;
