import { useState,useEffect } from "react";
import { Container } from "../../Components/container";
import { collection,getDocs,query,orderBy,where } from "firebase/firestore";
import {db} from '../../services/firebaseConection';
import { Link } from "react-router-dom";
import { Carousel,CarouselResponsiveOption  } from 'primereact/carousel';
import {Adsense} from '@ctrl/react-adsense';


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

const responsiveOptions: CarouselResponsiveOption[] = [
  {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1
  },
  {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1
  },
  {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1
  },
  {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1
  }
];


const productTemplate = (car: CarsProps) => {
  return (
    <section className="w-full bg-white rounded-lg">

  <Link to={`/details/${car.id}`}>
  <div 
    className="w-full h-72 rounded-lg bg-slate-200"
    style={{display: loadImages.includes(car.id) ? "none" : "block"}}
    ></div>

<img 
className="w-full rounded-lg mb-2 max-h-100 hover:scale-105 transition-all" 
src={car.images[0].url}
alt="carro"
onLoad={() => handleImageLoad(car.id)}
style={{display: loadImages.includes(car.id) ? "block" : "none"}}


/>

<p className="font-bold mt-l mb-2 px-2">{car.name}</p>

<div className="flex flex-col px-2">
<span className="text-zinc-700 mb-6">Ano {car.year} {car.km} KM</span>
<strong className="text-black font-medium text-xl">R$ {car.price}</strong>
</div>

<div className="w-full h-px bg-slate-200 my-2"></div>

<div className="px-2 pb-2">
<span className="text-black">
{car.city}
</span>
</div>
  
  </Link>

</section>
  );
};



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
    <Adsense
  client="ca-pub-7640562161899788"
  slot="7259870550"
  className="w-full bg-red h-200"
  format=""
/>
<section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
  <input 
  className="w-full border-2 rounded-lg h-9 px-3 outline-none" 
  placeholder="Digite o nome do produto..."
  value={input}
  onChange={(e)=>setInput(e.target.value)}
  
  />
  <button 
  className="bg-violet-600 h-9 px-8 rounded-lg text-white font-medium text-lg"
  
  onClick={handleSeachCar}
  >Buscar</button>
</section>


<h1 className="font-bold text-center mt-6 text-2xl mb-4">Veículos novos e usados</h1>
<main className="card">
            <Carousel value={carros} numVisible={1} numScroll={1} responsiveOptions={responsiveOptions} className="custom-carousel" circular
            autoplayInterval={3000} itemTemplate={productTemplate} />
        </main>



  </Container>
 

 
 );
}

export default Home;