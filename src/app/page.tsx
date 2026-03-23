import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className=" flex flex-col text-5xl text-white font-bold items-center justify-center h-screen gap-10">
        <h1>Boton para logearse</h1>
        <Link href="/sign-in">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-3xl">
            Sign In
          </button>
        </Link>
      </div>
      
    </>
    
  );
}
