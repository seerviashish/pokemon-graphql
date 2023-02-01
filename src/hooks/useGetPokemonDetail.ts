import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export type PokemonDetail = {
  id: string;
  name: string;
  number: string;
  types: string[];
  image: string;
  weight: {
    minimum: string;
    maximum: string;
  };
  height: {
    minimum: string;
    maximum: string;
  };
  classification: string;
  resistant: string[];
  weaknesses: string[];
  fleeRate: number;
  maxCP: number;
  maxHP: number;
};

export const GET_POKEMON_DETAIL = gql`
  query pokemon($id: String, $name: String) {
    pokemon(id: $id, name: $name) {
      id
      number
      name
      weight {
        minimum
        maximum
      }
      height {
        minimum
        maximum
      }
      classification
      types
      resistant
      weaknesses
      fleeRate
      maxCP
      maxHP
      image
    }
  }
`;

export const useGetPokemonDetail = (id: string, name: string) => {
  const { data, ...queryRes } = useQuery(GET_POKEMON_DETAIL, {
    variables: {
      id,
      name,
    },
  });

  const pokemonDetail: PokemonDetail | undefined = useMemo(
    () => data?.pokemon || null,
    [data]
  );

  return {
    pokemonDetail,
    ...queryRes,
  };
};
