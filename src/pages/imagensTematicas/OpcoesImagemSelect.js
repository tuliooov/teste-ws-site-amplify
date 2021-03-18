import React from 'react'
import NativeSelect from '@material-ui/core/NativeSelect';
import {Card,  Row, Col } from 'react-bootstrap';


import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

const BootstrapInput = withStyles((theme) => ({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }))(InputBase);

export default function OpcoesImagemSelect(props){
    const {
        criarFeed,
        criarStories,
    } = props

    return (
        <span id="notLoadingOpcoes" style={{"display": "none"}}>
            <NativeSelect
                fullWidth
                defaultValue={`LINK`}
                onChange={() => {
                criarFeed()
                criarStories()
                }}
                id="opcoes"
                input={<BootstrapInput />}
            >
                <option value={`LINK`}>LINK DO SITE</option>
                <option value={'CUPOM_ANONOVO10%'}>CUPOM 10% DE DESCONTO</option>
                <option value={'CUPOM_ANONOVO10REAIS'}>CUPOM R$ 10,00 DE DESCONTO</option>
                <option value={'CUPOM_ANONOVOFRETE'}>CUPOM FRETE GRÁTIS</option>
                <option value={`FRASEPEQUENA`}>FRASE PEQUENA</option>
            </NativeSelect>
        </span>
    )
}