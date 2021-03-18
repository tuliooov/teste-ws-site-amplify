import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import flatLoading from '../../assets/loading-flat.gif';
import flatErro from '../../assets/fail-flat.svg';
import setaErro from '../../assets/source.gif';
import * as Sentry from "@sentry/react";
import {
  ObterCardapio,
  AplicativoDadosUrl,
  identificarEstabelecimentoSelecionado
} from '../../services/functions';

//alert
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export default function Filter(props) {
  const [estabelecimentoAtual, setEstabelecimentoAtual] = useState(JSON.parse(localStorage.getItem("estabelecimentoAtualCF")));
  const history = useHistory();
  //let qtdTest = 3;
  
  const search = props.location.search;
  const params = new URLSearchParams(search); 
  //console.log('filter params', params)

  const pedidoMesaParams = params.get('pedidoMesa')
  const loginIzzaParams = params.get('loginIzza')
  const cadastroParams = params.get('cadastro')
  const mesaParams = params.get('mesa')
  const comandaParams = params.get('comanda')
  const lojaParams = params.get('loja')
  const visualizacaoParams = params.get('visualizacao')

  const direcionarParaLoja = (lojaParams && (!mesaParams && !comandaParams && !loginIzzaParams))

  const avaliacaoParams = params.get('avaliacao')
  const imagensParams = params.get('downloadImagens')
  const downloadParams = params.get('download')
  const downloadEscolhaParams = params.get('downloadEscolha')
  const avaliacaoParamsCliente = params.get('Cliente')
  const avaliacaoParamsPedido = params.get('Pedido')
  const paramsChaveIzza = params.get('chave')
  
  const android = navigator.userAgent.includes('Android')

  
  var tentouSemWWW = false
  const [textoErro, setTextoErro] = useState('')
  const [naoEncontrou, setNaoEncontrou] = useState(false)
  
  const [alert, setAlert] = useState({"status": false, "tipo": "success", "mesangem": ""});
    
  function Alert(props) {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  
  const alertStart = (msg, tipo) => {
      setAlert({"status": true, "tipo": tipo, "mesangem": msg});
  };

  const alertClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setAlert({"status": false, "tipo": alert.tipo, "mesangem": alert.mesangem});
  };

  async function buscarAppDados(site){
    console.log('filter buscarAppDados ' + site)
    try {
      
      const response = await AplicativoDadosUrl(site, window.location.hostname)
      

      if(response.retornoErro){
        console.log('retornoErro')
        //algum erro
        alertStart(response.mensagem, "error")
      }else if( !(response && typeof response !== 'string') ){
        console.log('!(response && typeof response !== "string") ')

        setTextoErro(site + " - " + response)
        setNaoEncontrou(true)
        alertStart(`Erro ao procurar aplicativo`, "error")
        setTimeout(() => {
          window.location.reload()
        }, 10000); 

      }else if(response.codErro > 0){
        console.log('response.codErro > 0')
        
        console.log('tentouSemWWW', tentouSemWWW)
        if(tentouSemWWW == false){
          var siteSemWWW = site.includes('www.') ? site.replace('www.','') : 'www.'+site
          tentouSemWWW = true
          await buscarAppDados(siteSemWWW)
          return false
        }
        setNaoEncontrou(true)
        Sentry.captureMessage(localStorage.getItem('versao')+`${window.location.hostname} Não encontrou o aplicativo`);
        alertStart(response.mensagem, "error")  
        setTimeout(() => {
          window.location.reload()
        }, 10000);
      }else{
        console.log('else')

        // response.tagManager = 'GTM-M4J3JK4'
        localStorage.setItem('aplicativoCF', JSON.stringify(response));      
        localStorage.setItem('dateAplicativoDadosCF', new Date())  
        telaInicial()
      }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions buscarAppDados ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
    }
  }

  async function verificarAppDados(){ 

    if (navigator.onLine){   
      if(window.location.hostname == "www.clientefiel.app"){
        window.location.href = "https://appclientefiel.com.br/?utm_source=clienteFiel.App"
        return true;
      }else if(window.location.hostname == "www.pedidosite.com.br"){
        window.location.href = "https://appclientefiel.com.br/?utm_source=pedidosite.Com.Br"
        return true;
      }
      else if(window.location.protocol == "http:" && !(window.location.hostname).includes('localhost') && !(window.location.hostname).includes('192.168')){
        console.log('replace location ', window.location.href, ((window.location.href).replace("http:", "https:")).replace('www.',''))
        window.location.href = ((window.location.href).replace("http:", "https:")).replace('www.','')
        return true
      }
      
      try {

          if(!localStorage.getItem('aplicativoCF') || params.get('estabelecimento')){
            localStorage.clear()
            await buscarAppDados(params.get('estabelecimento') ? params.get('estabelecimento') : window.location.hostname)
          }else{
              telaInicial()
          }
      } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`${window.location.hostname} - ${error} - BuscarAplicativoDados`);
        alertStart("Erro nao identificado ao buscar aplicativo", "error") 
        //console.log("Erro nao identificado ao buscar aplicativo", err)
        setTimeout(() => {
          window.location.reload()
        }, 3000);
      }   
    }else{
      alertStart("Sem Internet!", "error") 

      setTimeout(() => {
        window.location.reload()
      }, 3000);
      // history.push('/offline');
    } 
  }
  
  async function iniciarClienteFielStart(aplicativoDados){
    if(aplicativoDados.estabelecimentos.length > 0){
      await buscarCardapioOffline(aplicativoDados.estabelecimentos[0], aplicativoDados)
    }else{
      alertStart("Esse aplicativo não tem estabelecimento cadastrado", "error") 
    }
  }


  async function telaInicial() {
    const aplicativoDados = JSON.parse(localStorage.getItem('aplicativoCF'))
    console.log('telaInicial', aplicativoDados)
    //verifica se é ferramenta gratuita ClienteFielStart
    if(aplicativoDados.clienteFielStart){
      iniciarClienteFielStart(aplicativoDados)
    }else if(cadastroParams){
      history.push(`/cadastro${search}`)
    }else if(direcionarParaLoja){//console.log('pedidoMesaParams,', pedidoMesaParams)
      await buscarCardapioOffline(buscarLojaId(lojaParams), aplicativoDados, visualizacaoParams ? true : false)
    }else if(avaliacaoParams){ //ir para avaliar pedido
      history.push(`/delivery/avaliacaoPedido?Cliente=${avaliacaoParamsCliente}&Pedido=${avaliacaoParamsPedido}`);
      return true
    }else if(imagensParams){ //ir para gerador de imagens
      history.push(`/downloads/imagensTematicas`);
      return true
    }else if(downloadEscolhaParams){ //ir para downloads
      history.push(`/downloads/escolha`);
      return true
    }else if(downloadParams){ //ir para downloads
      history.push(`/downloads`);
      return true
    }else if(loginIzzaParams){ //login izza
      history.push(`/login${search}${identificarEstabelecimentoSelecionado(aplicativoDados)}`);      
      return true
    }else if(JSON.parse(localStorage.getItem('usuarioPedidoMesaCF'))?.logado){
      //desconectar automaticamente usuario de mesa
      if(new Date() - new Date(localStorage.getItem('usuarioPedidoMesaCF_Date')) > 5400000  ){
        localStorage.removeItem('usuarioPedidoMesaCF')
      }else{
        history.push(`/delivery${identificarEstabelecimentoSelecionado(aplicativoDados)}`);
        return true
      }    
    }else if( (aplicativoDados.possuiDelivery === false || loginIzzaParams || paramsChaveIzza || pedidoMesaParams || comandaParams || lojaParams || mesaParams) ){
      //apenas fidelidade, login mesa ou login izza
      history.push(`/login${search}${identificarEstabelecimentoSelecionado(aplicativoDados)}`);
      return true
    }else if(aplicativoDados.inicioTelaLogin){ //iniciar na tela de login 
      history.push(`/login${search}${identificarEstabelecimentoSelecionado(aplicativoDados)}`);      
    }else{ //iniciar tela de cardapio
      if(aplicativoDados?.estabelecimentos?.length === 1){ 
        await buscarCardapioOffline(aplicativoDados.estabelecimentos[0], aplicativoDados)
      }else{
        history.push('/lojas')
      }
    }
  }

  const buscarLojaId = (codigo) => {
    const aplicativoDados = JSON.parse(localStorage.getItem('aplicativoCF'))
    var loja = aplicativoDados.estabelecimentos[0]

    for(var i = 0; i < aplicativoDados.estabelecimentos.length; i++){
      if(codigo == aplicativoDados.estabelecimentos[i].id || codigo == aplicativoDados.estabelecimentos[i].codigo){
        loja = aplicativoDados.estabelecimentos[i]
        break;
      }
    }

    return loja;
  }

  const buscarCardapioOffline = async (estabelecimento, aplicativoDados, view = false) => {   
    try {
      localStorage.setItem('estabelecimentoAtualCF', JSON.stringify(estabelecimento));
      estabelecimento.token = process.env.REACT_APP_CLIENTEFIEL_TOKEN
      const response = await ObterCardapio(estabelecimento, aplicativoDados)

      if(response.retornoErro){
        alertStart(response.mensagem, "error")
        // setLoading(false)
      }else{
        const retorno = response
        //console.log("ObterCardapio", retorno)  
        const carrinhoRetorno = {}
        carrinhoRetorno.valorMinimoPedido = retorno.valorMinimoPedido
        carrinhoRetorno.valorDesconto = retorno.valorDesconto
        carrinhoRetorno.percentualDesconto = retorno.percentualDesconto
        carrinhoRetorno.minimoEntregaGratis = retorno.minimoEntregaGratis
        carrinhoRetorno.maximoPedidoComDesconto = retorno.maximoPedidoComDesconto
        carrinhoRetorno.maximoDesconto = retorno.maximoDesconto
        carrinhoRetorno.cupomDesconto = retorno.cupomDesconto
  
        carrinhoRetorno.pedido = {
          "entregaImediata": false,
          "formaPagamento": {},
          "itens": [],
          "taxaEntrega": null,
          "tokenCartaoCredito": null,
          "troco": null,
          "valorDesconto": null,
          "valorEntrega": null,
          "valorTotal": 0,
          "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
        }
        
        localStorage.setItem("carrinhoCF", JSON.stringify(carrinhoRetorno)) 


        const dataRetorno = {}
        dataRetorno.categorias = retorno
        dataRetorno.id = "usuarioDeslogado"
        localStorage.setItem("cardapioCF", JSON.stringify(dataRetorno))                      

        if(!localStorage.getItem('usuarioCF')){
          localStorage.setItem("usuarioCF", JSON.stringify({}))    

        }

        if(!localStorage.getItem('enderecoAtualCF')){
          localStorage.setItem("enderecoAtualCF", JSON.stringify({}))  
        }
  
        if(view){
          history.push(`/delivery?view=true${identificarEstabelecimentoSelecionado(aplicativoDados)}`);      
          
        }else{
          history.push(`/delivery${identificarEstabelecimentoSelecionado(aplicativoDados)}`);      
        }
        
      }
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions buscarCardapioOffline ${window.location.hostname} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
    }
  }

  
  useEffect(() => {
    if(naoEncontrou === false){
      verificarAppDados()
    }else{
      setTimeout(() => {
        window.location.reload()
      }, 3000);
    }
  }, []);
  
  


  return (
    
    
    ((navigator.userAgent).includes("Instagram") && android)
     ? <div className="divImageCentroErro" >
          <><img src={setaErro} alt={"erro instagram android"} className="pretoEBranco" style={{"width": "150px","float":"right", "marginRight": "1em", "transform": "rotate(25deg)"}}/>
            <h6 style={{"fontWeight": "100", "float": "right"}}>Por favor, clique nos 3 (três) pontinhos e depois em Abrir</h6></>
      </div>
    : <div className="divImageCentro" >
        <Snackbar open={alert.status} autoHideDuration={6000} onClose={alertClose}>
            <Alert onClose={alertClose} severity={alert.tipo}>
            {alert.mesangem}
            </Alert>
        </Snackbar>

        { naoEncontrou === false
          ? <><img src={flatLoading}  alt={"loading foguete"} className="pretoEBranco" style={{"width": '350px'}}/>
            <h6 style={{"fontWeight": "100"}}>Carregando Aplicativo...</h6></>

          : <><img src={flatErro} alt={"loading erro"} className="pretoEBranco" style={{"width": '350px'}}/>
            <h6 style={{"fontWeight": "100"}}>Não Encontramos Esse Aplicativo... [{window.location.hostname}] ou o Sistema está fora do ar temporariamente. {textoErro}</h6></>
        }                          
      </div>
  );
}
