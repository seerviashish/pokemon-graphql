import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import {
  PokemonDetail as PokemonDetailType,
  useGetPokemonDetail,
} from '../../hooks/useGetPokemonDetail';
import 'material-icons/iconfont/material-icons.css';

type Props = {
  pokemonId?: string;
  pokemonName?: string;
};

export const PokemonDetail: React.FC<Props> = ({ pokemonId, pokemonName }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  if (!pokemonId || !pokemonName) {
    return <div>{'PokemonId or PokemonName is not found'}</div>;
  }
  const { pokemonDetail, loading } = useGetPokemonDetail(
    pokemonId,
    pokemonName
  );

  const onClose = () => {
    navigate('/pokemon');
  };

  return (
    <div className={classes.root}>
      {loading && <div>Loading...</div>}
      {!loading && pokemonDetail && (
        <div className={classes.detail}>
          <div className="navbar">
            <span className="material-icons" onClick={onClose}>
              arrow_back
            </span>
            <p className="title">{pokemonDetail.name}</p>
          </div>
          <div className="detail-section">
            <img className={'image'} src={pokemonDetail.image} loading="lazy" />
            <span
              key={'height'}
            >{`height: [${pokemonDetail.height.minimum}, ${pokemonDetail.height.maximum}]`}</span>
            <span
              key={'fleeRate'}
            >{`fleeRate: ${pokemonDetail.fleeRate}`}</span>
            <span key={'maxHP'}>{`maxHP: ${pokemonDetail.maxHP}`}</span>
            <span key={'maxCP'}>{`maxCP: ${pokemonDetail.maxCP}`}</span>
            <span
              key={'weaknesses'}
            >{`weaknesses: ${pokemonDetail.weaknesses.join(',')}`}</span>
            <span
              key={'classification'}
            >{`classification: ${pokemonDetail.classification}`}</span>
            <span key={'resistant'}>{`resistant: ${pokemonDetail.resistant.join(
              ','
            )}`}</span>
            <span
              key={'weight'}
            >{`weight: [${pokemonDetail.weight.minimum}, ${pokemonDetail.weight.maximum}]`}</span>
          </div>
        </div>
      )}
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
    detail: {
      display: 'flex',
      flexDirection: 'column',
      '& .navbar': {
        display: 'flex',
        width: 500,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        '& .title': {
          color: 'white',
          fontWeight: 'bold',
          fontSize: 'x-large',
        },
        '& span': {
          position: 'absolute',
          cursor: 'pointer',
          left: 0,
        },
      },
      '& .detail-section': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& img': {
          width: 300,
          height: 300,
        },
        '& > span': {
          color: 'white',
          fontWeight: 'normal',
        },
      },
    },
  },
  { name: 'PokemonDetail' }
);
