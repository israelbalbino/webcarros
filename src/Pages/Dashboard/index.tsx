import { useState,useEffect,useContext } from "react";
import { Container } from "../../Components/container";
import DashboardHeader from '../../Components/panelHeader';
import { FiTrash2 } from "react-icons/fi";
import { collection,getDocs,query,where,doc,deleteDoc } from "firebase/firestore";
import { db, storage } from '../../services/firebaseConection';
import { ref, deleteObject } from 'firebase/storage'
import { AuthContext } from "../../contexts/AuthContexts";
import toast from 'react-hot-toast';

interface CarsProps{
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string |number;
  city: string;
  km: string;
  images:CarImageProps[]
}

interface CarImageProps{
  name:string;
  uid:string;
  url: string;
}

export default function Dashboard() {
  const {user} = useContext(AuthContext);
  const [carros,setCarros] = useState<CarsProps[]>([])


useEffect(()=>{

  function loadCars(){
    if(!user?.uid){
      return;
    }
    const carsRef = collection(db, "cars");
    const queryRef = query(carsRef, where("uid", "==", user.uid))

    getDocs(queryRef)
    .then((snapshot)=>{
    let listCars = [] as CarsProps[];

    snapshot.forEach( doc => {
      listCars.push({
        id: doc.id,
        name:doc.data().name,
        year:doc.data().year,
        km: doc.data().km,
        city:doc.data().city,
        price:doc.data().price,
        images: doc.data().images,
        uid:doc.data().uid


      })
    })
console.log(listCars)
    setCarros(listCars)

    })

  }

  loadCars()
},[user])


async function handleDeleteCar(car: CarsProps){
  const itemCar = car;

  const docRef = doc(db, "cars", itemCar.id)
  await deleteDoc(docRef);
  
  car.images.map( async (image) => {
    const imagePath = `image/${image.uid}/${image.name}`
    const imageRef = ref(storage, imagePath)

    try{
      await deleteObject(imageRef)
      toast.success("Carro excluido!")
      setCarros(carros.filter(car => car.id !== itemCar.id))
      
    }catch(err){
      console.log("ERRO AO EXCLUIR ESSA IMAGEM")
    }

  })
}

    return (
      
      <Container>
 <DashboardHeader/>

 <main className="grid grid-cols-l gap-6 md:grid-cols-2 lg:grid-cols-3">
      {
        carros.map(car=>(
          <section className="w-full bg-white rounded-lg relative">
        <button 
        onClick={()=>handleDeleteCar(car)}
        className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow">
          <FiTrash2 size={26} color="#000" />
        </button>
        <img
        className="w-full rounded-lg mb-2 max-h-70"
        src={car.images[0].url}
        />
        <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>

        <div className="flex flex-col px-2">
          <span className="text-zinc-700">
            Ano {car.year} | {car.km} km
          </span>
          <strong className="text-black font-bold mt-4">
            R$ {car.price}
          </strong>

        </div>

        <div className="w-full h-px bg-slate-200 my-2"></div>
        <div className="px-2 pb-2">
          <span className="text-black">
            Arapiraca-Al
          </span>
        </div>

      </section>
        ))
      }
 </main>
      </Container>
     
    );
   }