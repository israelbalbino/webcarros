import {useEffect} from "react";
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.svg'
import { Container } from '../../Components/container';
import Input from '../../Components/Input';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver}  from '@hookform/resolvers/zod';
import {auth} from "../../services/firebaseConection";
import { signInWithEmailAndPassword,signOut }  from "firebase/auth";
import toast from 'react-hot-toast';


const schema = z.object({
  email: z.string().email("Insira um email válido").nonempty("o campo email é obrigatório"),
  password: z.string().nonempty("o campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>

export default function Login() {

  const navigate = useNavigate();

  const { register, handleSubmit, formState: {errors}} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  useEffect(()=>{
    async function handleSignOut(){
      await signOut(auth)
    }
    handleSignOut()
  },[])


  async function onSubmit(data: FormData){
 signInWithEmailAndPassword(auth, data.email,data.password)
 .then((user)=>{
  console.log("login feito com sucesso!")
  console.log(user)
  toast.success("Logado com sucesso!")
  navigate("/dashboard", {replace:true})

 }).catch(()=>{
  toast.error("Erro ao logar!")
 })
}
    return (

   <Container>


<div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
<Link to="/" className="mb-6 max-w-sm w-full">
<img 
className="w-full" 
src={Logo}
alt="logo do site"
/>
</Link>


<form

className="bg-white max-w-xl w-full rounded-lg p-4"
onSubmit={handleSubmit(onSubmit)}

>

<div className="mb-3">
<Input 
type="email"
placeholder="Digite seu email..."
name="email"
error={errors.email?.message}
register={register}

/>
</div>


<div className="mb-3">
<Input 
type="password"
placeholder="Digite sua senha..."
name="password"
error={errors.password?.message}
register={register}

/>
</div>

<button type="submit" className="items-center w-full bg-zinc-900 rounded-md text-white h-10 font-medium">Acessar</button>
</form>

<Link  to="/register">
Não possui uma conta? Cadastre-se
</Link>

</div>

   </Container>
  

    );
   }