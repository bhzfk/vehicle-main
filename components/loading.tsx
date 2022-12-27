import Image from "next/image";

export function Loading() {
  return (
    <main className="flex items-center justify-center w-screen h-screen">
      <Image
        src="/logo/niese2-min.gif"
        width={640}
        height={360}
        alt="niese logo"
      />
    </main>
  );
}

export default Loading;
