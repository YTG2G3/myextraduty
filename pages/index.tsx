import { signIn } from "next-auth/react";

export default function Home() {
    return (
        <div>
            <button onClick={() => signIn("google")}>dadsa</button>
        </div>
    );
}