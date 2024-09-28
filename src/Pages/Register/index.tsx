import {useEffect,useContext} from "react";
import { Link,useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.svg'
import { Container } from '../../Components/container';
import Input from '../../Components/Input';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver}  from '@hookform/resolvers/zod';
import {auth}  from "../../services/firebaseConection";
import { createUserWithEmailAndPassword,  updateProfile,signOut }  from "firebase/auth";
import { AuthContext } from "../../contexts/AuthContexts";

const schema = z.object({
  name:  z.string().nonempty("o campo nome é obrigatório"),
  email: z.string().email("Insira um email válido").nonempty("o campo email é obrigatório"),
  password: z.string().min(6).nonempty("o campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>

export default function Register() {
  const navigate = useNavigate();
  const { handleInfoUser } = useContext(AuthContext);

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


  function onSubmit(data: FormData){
    createUserWithEmailAndPassword(auth,  data.email,  data.password)
    .then(async (user) => {
      await updateProfile(user.user,{
        displayName: data.name
      })
      handleInfoUser({
        name: data.name,
        email: data.email,
        uid: user.user.uid
      })
      navigate("/dashboard", {replace:true})
      console.log("CADASTRADO COM SUCESSO!")
  
    })
    .catch((error)=>{
      console.log("erro ao cadastrar esse usuario")
      console.log(error)
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
type="name"
placeholder="Digite seu nome completo..."
name="name"
error={errors.name?.message}
register={register}

/>
</div>

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

<button type="submit" className="items-center w-full bg-zinc-900 rounded-md text-white h-10 font-medium">Cadastrar</button>
</form>

<Link  to="/login">
Já possui uma conta? Faça o login!
</Link>

</div>

   </Container>
  

    );
   }