import {useState,useEffect} from 'react';
import { Container } from '../../Components/container';
import {FaWhatsapp} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import {getDoc, doc} from 'firebase/firestore';
import { db } from '../../services/firebaseConection';
import { Swiper, SwiperSlide } from 'swiper/react';


interface Carprops{
  id:string;
  name:string;
  model:string;
  city:string;
  year:string;
  km:string;
  description:string;
  created: string;
  price: string | number;
  owner: string;
  uid: string;
  whatsapp:string;
  images:ImageCarProps[]
}

interface ImageCarProps{
  uid:string;
  name:string;
  url:string
}
export default function Details() {
  const [car,setCar] = useState<Carprops>()
  const {id} = useParams();
  const [sliderPerview,setSliderPreview] = useState<number>(2)
  const Navigate = useNavigate();

  useEffect(()=>{

    async function loadCar(){
      if(!id){
        return
      }
      const docRef = doc(db,"cars", id)
      getDoc(docRef)
      .then((snapshot)=>{
        if(!snapshot.data()){
          Navigate('/')
        }
        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          city:snapshot.data()?.city,
          description:snapshot.data()?.description,
          km:snapshot.data()?.km,
          owner:snapshot.data()?.owner,
          price:snapshot.data()?.price,
          whatsapp:snapshot.data()?.whatsapp,
          model:snapshot.data()?.model,
          year:snapshot.data()?.year,
          uid:snapshot.data()?.uid,
          created:snapshot.data()?.created,
          images:snapshot.data()?.images

        })
      })
    }

    loadCar()

  }, [id])

  useEffect(()=>{
function handleResize(){
  if(window.innerWidth < 720){
    setSliderPreview(1);
  }else{
    setSliderPreview(2)
  }
}

handleResize()

window.addEventListener("resize", handleResize)

return() => {
  window.removeEventListener("resize", handleResize)
}
  },[])

    return (
   <Container>
   
{
  car && (
    <Swiper
slidesPerView={sliderPerview}
pagination={{ clickable: true}}
navigation
>

  {car?.images.map( image => (
    <SwiperSlide key={image.name}>
      <img
      src={image.url}
      className="w-full h-96 object-cover"
      />
    </SwiperSlide>
  ))}

</Swiper>
  )
}
   {
    car && (
      <main className="w-full bg-white rounded-lg p-6 my-4">
        <div className="flex flex-col sm:flex-row mb-4 item-center justify-between">
          <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
          <h1 className="font-bold text-3xl text-black">R${car?.price}</h1>
        </div>
        <p>{car?.model}</p>

        <div className="flex w-full gap-6 my-4">
       <div className="flex flex-col gap-4">

       <div>
        <p>Cidade</p>
        <strong>{car?.city}</strong>
        </div>

        <div>
        <p>Ano</p>
        <strong>{car?.year}</strong>
        </div>

        

       </div>

       <div className="flex flex-col gap-4">

<div>
 <p>KM</p>
 <strong>{car?.km}</strong>
 </div>


 

</div>

        </div>

        <strong>Descrição:</strong>
        <p className="mb-4">{car?.description}</p>

        <strong>Telefone / whatsapp</strong>
        <p className="mb-4">{car?.whatsapp}</p>

        <a
        target='_blank'
        href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}`}
        className="cursor-pointer bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium"
        >
          Conversar com vendedor
          <FaWhatsapp size={26} color='white'/>

        </a>

      

      </main>
    )
   }
 
   </Container>
    );
   }