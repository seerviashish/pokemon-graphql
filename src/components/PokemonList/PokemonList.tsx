import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Pokemon, useGetPokemons } from '../../hooks/useGetPokemons';
import { useNavigate } from 'react-router-dom';
import 'material-icons/iconfont/material-icons.css';

type FilteredPokemon = {
  data: Pokemon;
  isNameMatched: boolean;
  isTypeMatched: boolean;
  nameMatchToken: string[];
  typeMatchToken: string[];
};

export const PokemonList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [filteredData, setFilteredData] = useState<{
    result: FilteredPokemon[];
    nameMatched: number;
    typeMatched: number;
  }>({
    result: [],
    nameMatched: 1,
    typeMatched: 1,
  });
  const [fieldForFilter, setFieldForFilter] = useState<{
    nameFilter: boolean;
    typeFilter: boolean;
    noFilter: boolean;
  }>({ nameFilter: false, typeFilter: false, noFilter: true });
  const { pokemons, loading } = useGetPokemons();

  useEffect(() => {
    const result: FilteredPokemon[] = pokemons.map((pokemon) => ({
      data: pokemon,
      nameMatchToken: [],
      typeMatchToken: [],
      isNameMatched: false,
      isTypeMatched: false,
    }));
    setFilteredData({
      result,
      nameMatched: 0,
      typeMatched: 0,
    });
    setFieldForFilter({ nameFilter: false, typeFilter: false, noFilter: true });
    setSearchInput('');
  }, [pokemons]);

  useEffect(() => {
    if (pokemons.length && searchInput.trim().length > 0) {
      let nameMatchCount = 0,
        typeMatchCount = 0;
      const result: {
        data: Pokemon;
        isNameMatched: boolean;
        isTypeMatched: boolean;
        nameMatchToken: string[];
        typeMatchToken: string[];
      }[] = [];
      pokemons.forEach((pokemon) => {
        const searchTokens: string[] = searchInput
          .trim()
          .split(' ')
          .map((token) => token.toLowerCase());
        let nameMatch = false,
          typesMatch = false,
          nameMatchToken: string[] = [],
          typeMatchToken: string[] = [];
        if (searchTokens.length) {
          searchTokens
            .filter((item, index) => searchTokens.indexOf(item) === index)
            .forEach((token: string) => {
              const isTokenMatchedToName = pokemon.name
                .toLowerCase()
                .includes(token);
              if (isTokenMatchedToName) {
                nameMatchCount++;
                nameMatchToken.push(token);
              }
              const tokenMatchedToTypes = pokemon.types.filter((type) =>
                type.toLowerCase().includes(token)
              ).length;
              const isTokenMatchedToTypes = tokenMatchedToTypes > 0;
              if (isTokenMatchedToTypes) {
                typeMatchCount += tokenMatchedToTypes;
                typeMatchToken.push(token);
              }
              nameMatch = nameMatch || isTokenMatchedToName;
              typesMatch = typesMatch || isTokenMatchedToTypes;
            });
        }
        if (nameMatch || typesMatch) {
          result.push({
            data: pokemon,
            isNameMatched: nameMatch,
            isTypeMatched: typesMatch,
            nameMatchToken: nameMatchToken,
            typeMatchToken: typeMatchToken,
          });
        }
      });
      setFilteredData({
        result,
        nameMatched: nameMatchCount,
        typeMatched: typeMatchCount,
      });
      setFieldForFilter({
        nameFilter: nameMatchCount > 0,
        typeFilter: typeMatchCount > 0,
        noFilter: false,
      });
    } else if (searchInput.trim().length == 0) {
      const result: FilteredPokemon[] = pokemons.map((pokemon) => ({
        data: pokemon,
        nameMatchToken: [],
        typeMatchToken: [],
        isNameMatched: false,
        isTypeMatched: false,
      }));

      setFilteredData({
        result,
        nameMatched: 0,
        typeMatched: 0,
      });
      setFieldForFilter({
        nameFilter: false,
        typeFilter: false,
        noFilter: true,
      });
    }
  }, [searchInput]);

  const onClickListItem = (pokemonId: string, pokemonName: string) => () => {
    navigate(`/pokemon/${pokemonId}/${pokemonName}`);
  };

  const removeMatch = (filter: 'types' | 'names' | 'all') => () => {
    const filterData = { ...fieldForFilter };
    if (filter === 'names') {
      filterData.nameFilter = false;
    }
    if (filter === 'types') {
      filterData.typeFilter = false;
    }
    if (filter === 'all') {
      filterData.typeFilter = false;
      filterData.nameFilter = false;
    }
    if (!filterData.nameFilter && !filterData.typeFilter) {
      filterData.noFilter = true;
    }
    if (filterData.noFilter) {
      const result: FilteredPokemon[] = pokemons.map((pokemon) => ({
        data: pokemon,
        nameMatchToken: [],
        typeMatchToken: [],
        isNameMatched: false,
        isTypeMatched: false,
      }));
      setFilteredData({
        result,
        nameMatched: 0,
        typeMatched: 0,
      });
      setSearchInput('');
    }
    setFieldForFilter(filterData);
  };

  const List = (
    <ul className={classes.list}>
      {filteredData.result
        .filter((pokemonInfoData) => {
          if (fieldForFilter.noFilter) {
            return true;
          } else {
            let isMatched = false;
            if (fieldForFilter.nameFilter) {
              isMatched = isMatched || pokemonInfoData.isNameMatched;
            }
            if (fieldForFilter.typeFilter) {
              isMatched = isMatched || pokemonInfoData.isTypeMatched;
            }
            return isMatched;
          }
        })
        .map((pokemonInfoObject) => {
          const pokemonInfo = pokemonInfoObject.data;
          return (
            <li
              className={classes.listItem}
              key={pokemonInfo.id}
              onClick={onClickListItem(pokemonInfo.id, pokemonInfo.name)}
            >
              <img
                className={classes.image}
                src={pokemonInfo.image}
                loading="lazy"
              />
              <span className={classes.info}>
                <span className={classes.title}>
                  {pokemonInfo.name}
                  {fieldForFilter.nameFilter &&
                    pokemonInfoObject.isNameMatched && (
                      <span className="token-count">
                        {pokemonInfoObject.nameMatchToken.length}
                      </span>
                    )}
                </span>
                <span className={classes.number}>{pokemonInfo.number}</span>
                <span className={classes.typesContainer}>
                  {pokemonInfo.types?.map((type, index) => {
                    const typeCount =
                      pokemonInfoObject.isTypeMatched &&
                      fieldForFilter.typeFilter
                        ? pokemonInfoObject.typeMatchToken.filter(
                            (typeString) =>
                              type
                                .toLowerCase()
                                .includes(typeString.toLowerCase())
                          ).length
                        : 0;

                    return (
                      <span key={`${pokemonInfo.id}-type-${index}`}>
                        {type}
                        {typeCount > 0 && (
                          <span className="token-count">{typeCount}</span>
                        )}
                      </span>
                    );
                  })}
                </span>
              </span>
            </li>
          );
        })}
    </ul>
  );

  const SearchBar = (
    <div className={classes.searchContainer}>
      <input
        type="text"
        placeholder="Search here..."
        name="search"
        value={searchInput}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchInput(e.target.value);
        }}
      />
      <div className={classes.filterContainer}>
        {fieldForFilter.nameFilter && filteredData.nameMatched > 0 && (
          <div>
            <span className="count">
              <span className="material-icons" onClick={removeMatch('names')}>
                close
              </span>
              {`${filteredData.nameMatched} Names matched`}
            </span>
          </div>
        )}
        {fieldForFilter.typeFilter && filteredData.typeMatched > 0 && (
          <div>
            <span className="count">
              <span className="material-icons" onClick={removeMatch('types')}>
                close
              </span>
              {`${filteredData.typeMatched} Types matched`}
            </span>
          </div>
        )}
        {((fieldForFilter.typeFilter && filteredData.typeMatched > 0) ||
          (fieldForFilter.nameFilter && filteredData.nameMatched > 0)) && (
          <div>
            <span className="clear" onClick={removeMatch('all')}>
              {'Clear All'}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      {loading && <div>Loading...</div>}
      {SearchBar}
      {!loading && List}
    </div>
  );
};

const useStyles = createUseStyles(
  {
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    list: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      padding: 0,
      margin: 0,
    },
    listItem: {
      display: 'flex',
      flexDirection: 'row',
      height: 100,
      minWidth: 500,
      backgroundColor: '#2C3E50',
      margin: 2,
      width: 'fit-content',
      alignItems: 'center',
      '&:hover': {
        boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
        backgroundColor: '#5D6D7E',
      },
    },
    info: {
      display: 'flex',
      flexDirection: 'column',
    },
    image: {
      height: 80,
      width: 80,
      margin: 10,
    },
    title: {
      fontSize: 'medium',
      fontWeight: 'bold',
      color: 'white',
      '& .token-count': {
        borderRadius: 25,
        marginLeft: 7,
        display: 'inline-block',
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: 'yellow',
        padding: '0px 8px',
      },
    },
    number: {
      fontSize: 'medium',
      color: 'white',
    },
    typesContainer: {
      marginTop: 4,
      '& > span': {
        borderRadius: 25,
        backgroundColor: '#EB984E',
        color: 'black',
        padding: '0 10px',
        marginRight: 4,
        display: 'inline-block',
        '& .token-count': {
          borderRadius: 25,
          marginLeft: 7,
          padding: '0px 8px',
          display: 'inline-block',
          color: 'black',
          fontWeight: 'bold',
          backgroundColor: 'yellow',
        },
      },
    },
    searchContainer: {
      minWidth: 500,
      '& input': {
        height: 40,
        color: 'black',
        fontSize: 'medium',
        fontWeight: 'bold',
        width: '100%',
        opacity: 0.8,
        '&:focus': {
          outline: 'none',
          opacity: 1,
        },
      },
    },
    filterContainer: {
      display: 'flex',
      flexDirection: 'row',
      margin: '10px 0',
      '& > div': {
        '& .clear': {
          backgroundColor: '#EC7063',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#E74C3C',
          },
        },
        '& > span': {
          padding: '2px 10px',
          color: 'black',
          backgroundColor: '#D0D3D4',
          borderRadius: 25,
          display: 'flex',
          marginRight: 10,
          '&:hover': {
            backgroundColor: '#ECF0F1',
          },
          '& .material-icons': {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#E74C3C',
            cursor: 'pointer',
            marginRight: 4,
          },
        },
      },
    },
  },
  { name: 'PokemonList' }
);
