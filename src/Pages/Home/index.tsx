import { useState,useEffect } from "react";
import { Container } from "../../Components/container";
import { collection,getDocs,query,orderBy,where } from "firebase/firestore";
import {db} from '../../services/firebaseConection';
import { Link } from "react-router-dom";


interface CarsProps{
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string|number;
  city: string;
  km: string;
  images:CarImageProps[]
}

interface CarImageProps{
  name:string;
  uid:string;
  url: string;
}


function Home() {

const [carros,setCarros] = useState<CarsProps[]>([])
const [loadImages,setLoadImages] = useState<string[]>([])
const [input,setInput] = useState("")

useEffect(()=>{
 

  loadCars()
},[])

function loadCars(){
  const carsRef = collection(db, "cars");
  const queryRef = query(carsRef, orderBy("created", "desc"))

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

function handleImageLoad(id: string){
setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
}

async function handleSeachCar(){
  if(input == ""){
    loadCars();
    return;
  }

  setCarros([]);
  setLoadImages([]);
    const q = query(collection(db, "cars"), 
    where("name", ">=", input.toUpperCase()),
    where("name", "<=", input.toUpperCase() + "\uf8ff")
    )

    const querySnapshot = await getDocs(q)

    let listCars = [] as CarsProps[];

    querySnapshot.forEach((doc)=>{
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

   setCarros(listCars)
  
}

 return (
  <Container>
<section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
  <input 
  className="w-full border-2 rounded-lg h-9 px-3 outline-none" 
  placeholder="Digite o nome do carro..."
  value={input}
  onChange={(e)=>setInput(e.target.value)}
  
  />
  <button 
  className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
  
  onClick={handleSeachCar}
  >Buscar</button>
</section>


<h1 className="font-bold text-center mt-6 text-2xl mb-4">Carros novos e usados</h1>

<main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

{carros.map(caros => (
 <Link  key={caros.id} to={`/details/${caros.id}`}>
        <section className="w-full bg-white rounded-lg">

          <div 
          className="w-full h-72 rounded-lg bg-slate-200"
          style={{display: loadImages.includes(caros.id) ? "none" : "block"}}
          ></div>

    <img 
    className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all" 
    src={caros.images[0].url}
    alt="carro"
    onLoad={() => handleImageLoad(caros.id)}
    style={{display: loadImages.includes(caros.id) ? "block" : "none"}}


    />

    <p className="font-bold mt-l mb-2 px-2">{caros.name}</p>

    <div className="flex flex-col px-2">
      <span className="text-zinc-700 mb-6">Ano {caros.year} {caros.km} KM</span>
      <strong className="text-black font-medium text-xl">R$ {caros.price}</strong>
    </div>

    <div className="w-full h-px bg-slate-200 my-2"></div>

    <div className="px-2 pb-2">
      <span className="text-black">
      {caros.city}
      </span>
    </div>

    </section>
</Link>
 
))
}

  
</main>


  </Container>
 

 
 );
}

export default Home;