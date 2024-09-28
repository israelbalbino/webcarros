import { Link } from "react-router-dom";
import { auth } from "../../services/firebaseConection";
import { signOut } from "firebase/auth";

export default function DasboardHeader(){

    async function handleLogout(){
        await signOut(auth)
    }
    return(
        <div className="w-full items-center flex h-10 bg-red-500 rounded-lg text-white font-medium gap-4 px-4 mb-4">
            <Link to="/dashboard">
            Dashboard
            </Link>
            <Link to="/dashboard/new" >
            Cadastrar novo produto
            </Link>

            <button className="ml-auto" onClick={handleLogout}>
                Sair
            </button>
        </div>
    )
}