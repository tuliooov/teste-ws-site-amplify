import React from 'react';
import './styles.css';
import Cabecalho from '../Global/cabecalho';
import Rodape from '../Global/rodape';
import Cardapio from './cardapio';
import Estabelecimento from './estabelecimento';



export default function Delivery(props) {

  const search = props.location.search;
  const params = new URLSearchParams(search); 
  const visualizacaoParams = params.get('view')

  const usuarioPedidoMesa = JSON.parse(localStorage.getItem("usuarioPedidoMesaCF"))
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"))
  const aplicativoDados = JSON.parse(localStorage.getItem('aplicativoCF'))

  return (
    <>
      {
        !visualizacaoParams
          ? (usuarioPedidoMesa?.logado
              ? <Cabecalho  mesa={usuarioLogado.cliente.nome} ></Cabecalho>
              : (aplicativoDados.clienteFielStart 
                ? <Cabecalho clienteFielStart={true}></Cabecalho>
                : <Cabecalho nomeEstabelecimentoCardapio={true} statusEstabelecimento={true}></Cabecalho>))
          : <Cabecalho visualizacao={true}></Cabecalho>
      }
      
      <div className="container container-delivery">
        <Estabelecimento visualizacao={visualizacaoParams ? true : false}></Estabelecimento>
        <Cardapio visualizacao={visualizacaoParams ? true : false}></Cardapio>        
      </div>

      {
        aplicativoDados.clienteFielStart || visualizacaoParams
          ? null 
          :<Rodape valor="Delivery"></Rodape>
      }
      
    </>
  );
}