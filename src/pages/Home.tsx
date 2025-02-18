import { useState, useEffect } from 'react';

export default function Home() {
  interface Pokemon {
    id: string;
    name: string;
    imageUrlHiRes: string;
    nationalPokedexNumber?: number;
    hp?: string;
    type?: string;
    supertype?: string;
    ability?: { name: string; text: string };
    retreatCost?: string[];
    weaknesses?: { type: string; value: string }[];
    resistances?: { type: string; value: string }[];
    attacks?: { name: string; damage: string; text: string }[];
    text?: string[];
    rules?: string[];
  }

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [search, setSearch] = useState<string>(''); // เก็บค่าค้นหา
  const [pokemon, setPokemon] = useState<Pokemon[]>([]); // เก็บข้อมูลโปเกมอนทั้งหมด
  const [favorites, setFavorites] = useState<Pokemon[]>([]); // เก็บโปเกมอนที่ถูกเลือก

  useEffect(() => {
    fetch('/cards.json')
      .then((res) => res.json())
      .then((data) => setPokemon(data.cards));
  }, []);

  const filteredPokemon = pokemon.filter((p) => {
    const pokemonName = p.name?.toLowerCase().trim(); // ใช้ .trim() และ ?. ป้องกันไม่ให้เกิด error ถ้าชื่อเป็น undefined
    const searchText = search.toLowerCase().trim(); // ใช้ .trim() ในการค้นหา
    return pokemonName?.includes(searchText); // ใช้ ?. เพื่อไม่ให้เกิด error ถ้าชื่อเป็น undefined
  });

  const handleAddFavorite = (p: Pokemon) => {
    if (!favorites.some((fav) => fav.id === p.id)) {
      setFavorites([...favorites, p]);
    }
    setShowSearch(false); // ปิดช่องค้นหา
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  return (
    <div className="container mt-15 mb-5 ms-full me-full py-10 px-15 rounded-4xl max-w-7xl h-190 justify-self-center bg-gray-900 text-white">
      <div className="container max-w-6xl h-170 font-bold bg-white flex flex-col justify-center items-center">
        {/* title */}
        <div className="container text-gray-800 text-5xl flex flex-col text-center p-3">
          My Pokedex
        </div>

        {/* details */}
        <div className="container inset-shadow-sm inset-shadow-gray-300 text-gray-400 bg-gray-200 text-4xl   p-3 h-full w-full overflow-scroll">
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
            <p className="text-gray-300 flex flex-col items-center justify-center text-lg lg:text-5xl h-full">Select a Pokémon to add to favorites.</p>
          )}
        </div>

        {/* Search Button */}
        <div className="container text-white bg-blue-950 flex flex-row justify-center text-center">
          <button
            className="bg-amber-500 text-9xl inset-shadow-sm inset-shadow-gray-300 rounded-full flex flex-row items-center text-white justify-center shadow-lg hover:scale-150 transition-transform w-20 h-20 relative cursor-pointer"
            onClick={() => setShowSearch(!showSearch)}
          >
            &bull;
          </button>
        </div>

        {showSearch && (
            <div className="absolute overflow-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs h-130 sm:max-w-sm md:max-w-lg lg:max-w-5xl lg:h-130 text-black p-5 rounded-2xl shadow-2xl aspect-video bg-gray-100 border-l-inherit">
                <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search Pokémon..."
                    className="p-2 w-full border rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={() => setShowSearch(false)} className="text-red-600 text-4xl ml-4">
                    &times;
                </button>
                </div>

                {search && filteredPokemon.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                    {filteredPokemon.map((p) => (
                    <div
                        key={p.id}
                        className="bg-blue-100 shadow-md p-4 rounded-lg text-center flex flex-col md:flex-row cursor-pointer hover:scale-105 transition-transform items-center "
                        onClick={() => handleAddFavorite(p)}
                    >
                        {/* 📌 ส่วนแสดงภาพและชื่อการ์ด */}
                        <div className="w-full md:w-1/3 flex flex-col items-center">
                        <h2 className="text-lg font-bold capitalize">{p?.name}</h2>
                        <img src={p.imageUrlHiRes} alt={p.name} className="mx-auto h-32 sm:h-40" />
                        <p className="text-gray-500 text-lg">#{p?.nationalPokedexNumber || '-'}</p>
                        </div>

                        {/* 📌 เงื่อนไขของการ์ดแต่ละประเภท */}
                        <div className="w-full md:w-2/3 hidden md:block">
                        {p.supertype === 'Pokémon' && (
                            <div className="mt-2">
                            <div className="flex justify-between text-sm">
                                <span className="bg-green-600 text-white px-2 py-1 rounded-lg">HP: {p?.hp || '-'}</span>
                                <span className="bg-blue-500 text-white px-2 py-1 rounded-lg">Type: {p?.type || 'Unknown'}</span>
                            </div>

                            {p.ability && (
                                <div className="mt-2 text-xs">
                                <h3 className="font-semibold">✨ Ability: {p.ability.name}</h3>
                                <p className="text-gray-600 text-justify font-light">{p.ability.text}</p>
                                </div>
                            )}

                            {p.attacks && p.attacks.length > 0 && (
                                <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-700">⚔️ Attacks</h3>
                                <ul className="list-disc pl-5 text-gray-600 text-sm">
                                    {p.attacks.map((attack, index) => (
                                    <p key={index}>
                                        {attack.name}  <span className="font-bold ">{attack.damage || 'N/A'}</span>
                                    </p>
                                    ))}
                                </ul>
                                </div>
                            )}
                            </div>
                        )}

                        {/* 🔹 Trainer Card */}
                        {p.supertype === 'Trainer' && (
                            <div className="ps-4 pe-4 text-gray-600 flex flex-col justify-center text-justify">
                            <h2 className="uppercase text-lg text-center font-bold text-gray-500">Trainer Card</h2>
                            <p className="font-mono text-sm font-light">
                                {Array.isArray(p.text) ? p.text.join(' ') : p.ability?.text || 'No information available'}
                            </p>
                            </div>
                        )}

                        {/* 🔹 Energy Card */}
                        {p.supertype === 'Energy' && (
                            <div className="ps-4 pe-4 text-gray-600 flex flex-col justify-center text-justify">
                            <h2 className="uppercase text-lg text-center font-bold text-yellow-500">Energy Card</h2>
                            <p className="font-mono text-sm font-light">
                                {Array.isArray(p.rules) ? p.rules.join(' ') : p.text || 'No information available'}
                            </p>
                            </div>
                        )}
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <p className="text-gray-500 text-center mt-4">No Pokémon found.</p>
                )}
            </div>
            )}


      </div>
    </div>
  );
}
