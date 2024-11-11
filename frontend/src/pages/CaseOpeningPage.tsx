import { useEffect, useState } from "react";
import { Layout } from "../components/layout/Layout"
import { motion } from 'framer-motion';
import axios from "axios";


export const CaseOpeningPage = () => {
        
    useEffect(() => {
        handleFetchItems();
    }
    ,[]);

 

    //CASE ID POBRANE Z LINKU JA TU NA SZTYWNO WPISALEM
    const caseId = "33a7150f-3f90-409b-a21b-83a3593c63ae";

    const [isAnimating, setIsAnimating] = useState(false);
    const [itemCase, setItemCase] = useState<any>([]);
    const [items, setItems] = useState<any>([])
    const [winningItemIndex, setWinningItemIndex] = useState<String>("");
    const winningItemId = 70;


    useEffect(() => {
        if(items.length > 0){
            generateCase();
        }
    }
    ,[items]);

    const handleFetchItems = async() => {
        // TUTAJ BIORE ITEMY Z BAZY DANYCH PODANEJ SKRZYNKI
        const response = await axios.get(`http://localhost:8080/cases/${caseId}/items`);
        console.log(response.data);

        setItems(response.data);

        // TUTAJ FETCH INDEXU ITEMU KTORY JEST WYLOSOWANY JA DLA PRZYKLADU WEZME MOJ Z MOJEJ BAZY INDEX ITEMU
        //const response = await axios.get("/get_winningItemIndex/caseId"); TEN ROUTE TRZEBA NAPISAC GO JESZCZE NIE MA
        setWinningItemIndex("44c2f1e6-5d4b-4e20-8e90-07a916cbb150")
    }
    

    const generateCase = async () => {

        const itemCase = [];
        for(let i = 0; i < 100; i++){
            const random = Math.floor(Math.random() * items.length);

            if(i==winningItemId){
                const winningItem = items.find((item:any) => item.id === winningItemIndex);
                itemCase.push({id:i, name:winningItem.name, image:winningItem.imageData});
                continue
            }
            itemCase.push({id:i, name:items[random].name, image:items[random].imageData});
        }
        setItemCase(itemCase);
    }
    
    const itemWidth = 100; // np. 100px na przedmiot

    const distance = -((winningItemId * itemWidth) - (window.innerWidth / 2 - itemWidth / 2));

    
    return(
<Layout>
    <section className="bg-black h-[80vh] relative">
        {
            itemCase.length === 0 ?
            <p>Loading...</p>
            :
            <div className="relative w-full h-full overflow-hidden">
                {/* Pionowa kreska */}
                <div 
                    className="absolute z-50 left-1/2 transform -translate-x-1/2 border-l border-red-500"
                    style={{ height: '120px' }} // Wysokość dopasowana do zdjęć
                ></div>

                <motion.div
                    className="flex"
                    animate={{ x: distance }}
                    transition={{ type: 'tween', duration: 5, ease: 'easeOut' }}
                    onAnimationComplete={() => setIsAnimating(false)}
                >
                    {itemCase.map((item: any) => (
                        <div key={item.id} className="w-[100px] flex-shrink-0 flex flex-col items-center">
                            <img 
                                src={`data:image/jpeg;base64,${item?.image}`} 
                                alt={item?.name} 
                                className="w-64 h-auto object-cover"
                            />
                            <p className="text-white">{item.name}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        }
    </section>
</Layout>

    )
}