import { useState, useEffect } from 'react';


export default function Home() {
    
    // botton+
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [search, setSearch] = useState<string>(""); // เก็บค่าค้นหา
    const [pokemon, setPokemon] = useState<Pokemon[]>([]); // เก็บข้อมูลโปเกมอนทั้งหมด
    const [favorites, setFavorites] = useState<Pokemon[]>([]); // เก็บโปเกมอนที่ถูกเลือก
    
    

    // โหลดข้อมูลจาก JSON
    useEffect(()=>{
        fetch('/cards.json')
            .then((res)=>res.json())
            .then((data)=>setPokemon(data.cards))
    },[]);

        // ฟิลเตอร์โปเกมอนตามชื่อ โดยการใช้ trim() เพื่อลบช่องว่างหรือตัวอักษรพิเศษที่ไม่ต้องการ
        const filteredPokemon = pokemon.filter((p) => {
            const pokemonName = p.name?.toLowerCase().trim();  // ใช้ .trim() และ ?. ป้องกันไม่ให้เกิด error ถ้าชื่อเป็น undefined
            const searchText = search.toLowerCase().trim();   // ใช้ .trim() ในการค้นหา
            console.log(`Checking: ${pokemonName}, Search: ${searchText}`);
            return pokemonName?.includes(searchText);  // ใช้ ?. เพื่อไม่ให้เกิด error ถ้าชื่อเป็น undefined
        });

     // ฟังก์ชันเพิ่มโปเกมอนลงใน Favorites
        const handleAddFavorite = (p) => {
            if (!favorites.some((fav) => fav.id === p.id)) {
                setFavorites([...favorites, p]);
            }
            setShowSearch(false); // ปิดช่องค้นหา
        };

        //ฟังก์ชันลบโปเกมอนจาก Favorites
        const handleRemoveFavorite = (id) => {
            setFavorites(favorites.filter((fav) => fav.id !== id));
        };

    
  return (
    <div className="container mt-10 mb-5 py-10 px-15 rounded-4xl max-w-7xl h-190 justify-self-center bg-gray-900 text-white " >
        <div className="container max-w-6xl h-170 font-bold bg-white flex flex-col justify-center items-center">
            {/* title */}
            <div className="container text-gray-800 text-5xl flex flex-col text-center p-3">
                My Pokedex
            </div>



            {/* detal */}
            <div className="container inset-shadow-sm inset-shadow-gray-300 text-gray-400 bg-gray-200 text-4xl flex flex-col  items-center p-3 h-full overflow-y-auto ">
            {favorites.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                            {favorites.map((p) => (
                                <div key={p.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center relative">
                                    <h2 className="text-xl font-bold capitalize text-center">{p.name}</h2>
                                    <img src={p.imageUrlHiRes} alt={p.name} className="h-40 mx-auto" />
                                    <button 
                                        onClick={() => handleRemoveFavorite(p.id)}
                                        className="absolute top-2 right-2 bg-red-600 text-white text-lg px-2 py-.5 rounded-full shadow-md hover:bg-red-700 transition cursor-pointer"
                                    >
                                        ✖
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-300 flex justify-center items-center h-full">Select a Pokémon to add to favorites.</p>
                    )}
            </div>
            
            -----------------



            {/* button */}
            <div className="container  text-white bg-blue-950 flex flex-row justify-center text-center">
                <button className="bg-amber-500 text-9xl inset-shadow-sm inset-shadow-gray-300 rounded-full flex flex-row items-center text-white justify-center shadow-lg
                 hover:scale-150 transition-transform w-20 h-20 relative cursor-pointer"
                 onClick={() => setShowSearch(!showSearch)}>
                    &bull;
                </button>
            </div>
            {showSearch && (
                <div className="absolute overflow-scroll top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4xl h-150 lg:w-5xl text-black p-5 rounded-md shadow-2xl aspect-video bg-gray-50 border-l-inherit">
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            placeholder="Search Pokémon..."
                            className="p-2 w-full border rounded"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            onClick={() => setShowSearch(false)}
                            className="text-red-600 text-4xl ml-4"
                        >
                            &times;
                        </button>
                    </div>
                    {search && filteredPokemon.length > 0 ? (
                        <div className="grid  grid-rows  justify-center gap-2 ">
                            {filteredPokemon.map((p) => (
                                <div key={p.id} 
                                    className="container bg-blue-100  inset-shadow- inset-shadow-gray-600 w-4xl pt-5 pb-5 rounded-lg 
                                    text-center flex flex-row
                                    cursor-pointer hover:scale-110 transition-transform"
                                    onClick={() => handleAddFavorite(p)} // เมื่อคลิกโปเกมอน
                                >   
                                    <div className='ps-10 pe-10 space-y-1 '>
                                        <h2 className="text-xl font-bold capitalize ">{p?.name}</h2>
                                        <img  src={p.imageUrlHiRes} alt={p.name} className="mx-auto h-40" />                                                
                                        <p className="text-lg text-gray-500">#{p?.nationalPokedexNumber || '-'}</p>
                                    </div>
                                    {/* เช็คประเภทการ์ด */}
                                    {p.supertype === "Pokémon" ? (
                                        <div className='ps-10 pe-10 w-full  p-2'>
                                            {/* HP & Type */}
                                            <div className="flex justify-between items-center mb-5">
                                                <span className="bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-semibold shadow-md">
                                                    HP: {p?.hp || '-'}
                                                </span>
                                                <span className="bg-blue-500 text-white px-4 py-2 rounded-lg text-lg font-semibold shadow-md">
                                                    Type: {p?.type || 'Unknown'}
                                                </span>
                                                
                                            </div>
                                            {/* ความสามารถพิเศษ */}
                                            {p.ability && (
                                                    <div className=" pb-4 flex flex-col items-start ">
                                                        <h3 className="text-md font-semibold text-gray-700 mb-1">✨ Ability: {p.ability.name}</h3>
                                                        <p className="text-gray-600 text-xs   font-mono text-justify">{p.ability.text}</p>
                                                    </div>
                                                )}

                                            {/* Grid Layout สำหรับความสามารถและข้อมูลอื่น ๆ */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* ความสามารถพิเศษ */}

                                                {/* ค่าถอย */}
                                                {p.retreatCost && (
                                                    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                                                        <h3 className="text-md font-semibold text-gray-700 mb-1">🏃 Retreat Cost</h3>
                                                        <p className="text-gray-600 text-sm">{p.retreatCost.join(', ') || '-'}</p>
                                                    </div>
                                                )}

                                                {/* จุดอ่อน */}
                                                {p.weaknesses && p.weaknesses.length > 0 && (
                                                    <div className="bg-red-100 p-4 rounded-lg shadow-md">
                                                        <h3 className="text-md font-semibold text-red-500 mb-1">❌ Weaknesses</h3>
                                                        <ul className="list-disc pl-5 text-gray-700 text-sm">
                                                            {p.weaknesses.map((weakness, index) => (
                                                                <li key={index}>{weakness.type} ({weakness.value})</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* ความต้านทาน */}
                                                {p.resistances && p.resistances.length > 0 && (
                                                    <div className="bg-green-100 p-4 rounded-lg shadow-md">
                                                        <h3 className="text-md font-semibold text-green-500 mb-1">🛡 Resistances:</h3>
                                                        <ul className="list-disc pl-5 text-gray-700 text-sm">
                                                            {p.resistances.map((resistance, index) => (
                                                                <li key={index}>{resistance.type} ({resistance.value})</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                            {/* ท่าต่อสู้ (Attacks) */}
                                                {p.attacks && p.attacks.length > 0 && (
                                                    <div className="mt-4">
                                                        <h3 className="text-lg font-semibold text-gray-700">⚔️ Attacks</h3>
                                                        <div className="md:grid-cols-2 gap-4 mt-2">
                                                            {p.attacks.map((attack, index) => (
                                                                <div key={index} className="p-4 rounded-lg inset-shadow-sm ">
                                                                    <div className='flex flex-row space-x-5'>
                                                                        <h4 className="text-md font-semibold">{attack.name}</h4>
                                                                        <span className="block text-gray-800 font-bold">💥 Damage: {attack.damage || 'N/A'}</span>
                                                                    </div>
                                                                    <p className="text-gray-600 text-xs   font-mono text-justify">{attack.text}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        ) : p.supertype === "Trainer" ? (
                                            <div className='ps-10 pe-10 text-gray-600 space-y-5 flex flex-col justify-center text-justify w-2xl'>
                                                <h2 className='uppercase text-lg'>Trainer Card</h2>
                                                <p className='font-mono'>{p.text ? p.text.join(" ") : "Trainer Card"}</p>
                                            </div>
                                        ) : p.supertype === "Energy" ? (
                                            
                                            <div className='ps-10 pe-10 text-gray-600 space-y-5 flex flex-col justify-center text-justify w-2xl'>
                                                <h2 className='uppercase text-lg'>Energy Card</h2>
                                                <p className='font-mono'>{p.text ? p.text.join(" ") : "Trainer Card"}</p>
                                            </div>
                                        ) : null}

                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 flex flex-row justify-center mt-25 text-center">No Pokémon found.</p>
                    )}
                </div>
                        
            )}
        </div>
        
    </div>
    
  )
}
