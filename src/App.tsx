import { useEffect, useState } from "react";
import "./App.css";
import { axiosClient } from "./api/axios";
import { PageableCharacterType } from "./types/character.type";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [characters, setCharacters] = useState<PageableCharacterType>();
  const [nameFilter, setNameFilter] = useState("");

  async function getAllCharacters() {
    setIsLoading(true);
    await axiosClient
      .get<PageableCharacterType>(`/character`)
      .then((request) => {
        setCharacters(request.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    getAllCharacters();
  }, []);

  async function handlePaginateCharacters(url: string) {
    setIsLoading(true);
    await axiosClient
      .get<PageableCharacterType>(url)
      .then((request) => {
        setCharacters(request.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  async function handleFilterCharacters() {
    setIsLoading(true);
    await axiosClient
      .get<PageableCharacterType>(`https://rickandmortyapi.com/api/character/?name=${nameFilter}`)
      .then((request) => {
        setCharacters(request.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="container">
      {isLoading ? (
        <span className="message">Carregando...</span>
      ) : !characters ? (
        <span className="message">Não há itens a mostrar...</span>
      ) : (
        <>
          <form className="filters" onSubmit={handleFilterCharacters}>
            <span>Nome:</span>
            <input type="text" onChange={(event) => setNameFilter(event.target.value)} />
            <button type="submit" disabled={!nameFilter}>Filtrar</button>
          </form>

          <div className="characters">
            {characters.results.map((character) => (
              <div className="character" key={character.id}>
                <img
                  className="characterImage"
                  src={character.image}
                  alt={character.name}
                />
                <span className="characterName">{character.name}</span>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => handlePaginateCharacters(characters.info.prev)}
              disabled={!characters.info.prev}
            >
              Anterior
            </button>
            <button
              onClick={() => handlePaginateCharacters(characters.info.next)}
              disabled={!characters.info.next}
            >
              Próximo
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
