import React from 'react';
import { createUseStyles } from 'react-jss';
import { useParams } from 'react-router-dom';
import { PokemonDetail } from '../components';

export const ListDetailPage = () => {
  const classes = useStyles();
  const { pokemonId, pokemonName } = useParams();
  console.log('pathParam => ', { pokemonId, pokemonName });
  return (
    <div className={classes.root}>
      <PokemonDetail pokemonId={pokemonId} pokemonName={pokemonName} />
    </div>
  );
};

const useStyles = createUseStyles(
  {
    root: {
      width: '100%',
      height: '100%',
      overflowY: 'scroll',
    },
  },
  { name: 'ListPage' }
);

export default ListDetailPage;
