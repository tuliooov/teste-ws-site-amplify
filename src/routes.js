import React from 'react';

import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import api from '../src/services/api';
//DESLOGADO
import Estabelecimento from './pages/Deslogado/estabelecimentos';
import AvaliacaoPedido from './pages/AvaliacaoPedido';
import * as Sentry from "@sentry/react";

import {
  LoginGeral,
  AtualizarDispositivoUsuario,
  AplicativoDadosUrl,
} from './services/functions';

//LOGADO
import Downloads from './pages/Downloads';
import ImagensTematicas from './pages/imagensTematicas';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro/comum';
import Filter from './pages/Filter';
import Delivery from './pages/Delivery';
import Perfil from './pages/Perfil';
import ApenasFidelidade from './pages/ApenasFidelidade'; 
import ApenasFidelidadeCartelas from './pages/ApenasFidelidade/cartelas';  
import ApenasFidelidadeEstabelecimentos from './pages/ApenasFidelidade/estabelecimentos';  
// import Estabelecimento from './pages/Estabelecimento';
import Fidelidade from './pages/Fidelidade';
import Produto from './pages/Delivery/produto';
import Creditcardweb from './pages/Creditcardweb';
import Offline from './pages/Offline';
import Enderecos from './pages/Enderecos';
import StatusPedido from './pages/StatusPedido';
import ConectarMesa from './pages/ConectarMesa';
import HistoricoPedido from './pages/HistoricoPedido';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider  } from '@material-ui/core/styles';
import ReactGA from 'react-ga';
import ReactPixel from 'react-facebook-pixel';
import TagManager from 'react-gtm-module'

let iniciou = false
    

    

const pixelFacebook = (aplicativoDados) => {
  if(aplicativoDados.pixelFacebook){
    ReactPixel.init(aplicativoDados.pixelFacebook, { em: '' }, {autoConfig: true,debug: false,});
    ReactPixel.pageView();
  }
}

const googleAnalytics = (aplicativoDados, rest) => {
  const endereco = rest.location.pathname + rest.location.search
  if(iniciou == false){
    iniciou = true
    console.log('initializeGA')
    ReactGA.initialize('UA-77355682-2');

    if(aplicativoDados.googleAnalytics){
      ReactGA.ga('create', aplicativoDados.googleAnalytics, 'auto', {'name':'estabelecimentoTracker'});
    }
  }
  console.log('pageView')
  ReactGA.set({ page: endereco });
  ReactGA.pageview(endereco);

  if(aplicativoDados.googleAnalytics){
    ReactGA.ga('estabelecimentoTracker.send', 'pageview', {'page': endereco});
  }

  return null;
};


const tagManager = (aplicativoDados) => {

  try {
    
    if(aplicativoDados.tagManager){
      console.log('TagManager.aplicativoDados ', aplicativoDados.tagManager)
      const tagManagerArgs = {
        gtmId: `${aplicativoDados.tagManager}`
      }
      TagManager.initialize(tagManagerArgs)
    } 
    
    if(JSON.parse(localStorage.getItem('estabelecimentoAtualCF')).tagManager){
      const estabelecimento = JSON.parse(localStorage.getItem('estabelecimentoAtualCF'))
      const tagManagerArgs = {
        gtmId: `${estabelecimento.tagManager}`
      }
      TagManager.initialize(tagManagerArgs)
      console.log('TagManager.estabelecimento ', estabelecimento.tagManager)
    }
  } catch (error) {
    
  }

  return null;
};


const Routes = () => {
  

  var deuErro = false
  var aplicativoDados
  
  try {
    aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF")) ;

    if(aplicativoDados.codErro > 0){
      localStorage.clear()
    }

  } catch (error) {
    deuErro = true
  }


  if(!aplicativoDados || deuErro){
    localStorage.clear()
  }

  console.log("Routes", !!aplicativoDados)
  
  //APAGAR ALGUM TIPO DE CACHE
  // try {
  //   if(window.caches && window.caches?.keys()){
  //     window.caches.keys().then(cacheNames => {
  //       console.log('cacheNames?.length', cacheNames?.length)
  //       if(cacheNames?.length){
  //         cacheNames.forEach(cacheName => {
  //           caches.delete(cacheName);
  //         });
  //       }
  //     });
  //   }
  // } catch (error) {
  //   console.log("sem window caches")
  // }



  const versaoLancamento = "V2.3"
  const versaoAjuste = ".5"
  localStorage.setItem('versao', `${versaoLancamento}${versaoAjuste} | `)

  return (
      <div className="global">
        <span id="versao-atual">{versaoLancamento}{versaoAjuste}</span>
          <BrowserRouter>
            <Switch>
              <Route path="/" exact component={Filter} />              
              <Route path="/creditcardweb" component={Creditcardweb} />
              <Route path="/offline" exact component={Offline} /> 
              <RouteDados path="/downloads/googleplay" component={Downloads} />
              <RouteDados path="/downloads/appstore" component={Downloads} />
              <RouteDados path="/downloads/escolha" component={Downloads} />
              <RouteDados path="/downloads/imagensTematicas" component={ImagensTematicas} />
              <RouteDados path="/downloads" component={Downloads} />
              <RouteDados path="/cadastro" component={Cadastro} />
              <RouteDados path={"/login/Acesso"} component={Login} />
              <RouteDados path={"/login/pedidoMesa"} component={Login} />
              <RouteDados path={"/conectar-mesa"} component={ConectarMesa} />
              <RouteDados path={"/mesa"} component={ConectarMesa} />
              <RouteDados path={"/login"} component={Login} />
              <RouteAnonimo path={"/lojas"} component={Estabelecimento} />
              <PrivateRoute path="/delivery/historicoPedidos" component={HistoricoPedido} />
              <PrivateRoute path="/delivery/pedido/:codigoEstabelecimento/:idPedido/:statusInicial" component={StatusPedido} />
              <PrivateRoute path="/delivery/pedido/:idPedido/:statusInicial" component={StatusPedido} />
              <PrivateRoute path="/delivery/enderecos" component={Enderecos} />
              <PrivateRoute path="/delivery/fidelidade" component={Fidelidade} />
              <RouteDados path="/delivery/avaliacaoPedido" component={AvaliacaoPedido} />
              <PrivateRoute path="/delivery" component={Delivery} /> 
              <PrivateRoute path="/fidelidade/cartelas" component={ApenasFidelidadeCartelas} />  
              <PrivateRoute path="/fidelidade/estabelecimentos" component={ApenasFidelidadeEstabelecimentos} />  
              <PrivateRoute path="/fidelidade" component={ApenasFidelidade} /> 
              <PrivateRoute path="/perfil/:param1" component={Perfil} />
              <PrivateRoute path="/perfil" component={Perfil} />
              <PrivateRoute path="/estabelecimento" component={Estabelecimento} />
              <PrivateRoute path="/produto/:idProduto" component={Produto} />
              {/* <Route component={Filter} /> */}
            </Switch>
        </BrowserRouter>
      </div>
  );
}



const RouteAnonimo = ({component: Component, ...rest}) => {

  console.log("Route ANonimo")
  window.scrollTo(0, 0)

  var aplicativoDados
  var deuErro = false
  
  try {
    aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF")) ;
    
    if(aplicativoDados.codErro > 0){
      localStorage.clear()
      return (
          <Redirect to={'/' + rest.location.search} />   
      );
    }

  } catch (error) {
    deuErro = true
  }

 

  if(!aplicativoDados || deuErro){
    return (
        <Redirect to="/" />   
    );
  }else{

    if(new Date() - new Date(localStorage.getItem('dateAplicativoDadosCF')) > 600000){
      atualizarAppDados(aplicativoDados)
    }
  
    
    if(aplicativoDados !== 'string'){
      headAdd(aplicativoDados, rest)
    }  
  
    const theme = createMuiTheme({
        palette: {
          primary: {
            light: `${aplicativoDados.corSitePrimaria}`,
            main: `${aplicativoDados.corSitePrimaria}`,
            // dark: will be calculated from palette.secondary.main,
            contrastText: `#fff`,
          },
          secondary: {
            light: `${aplicativoDados.corSiteSecundaria === aplicativoDados.corSitePrimaria ? '#6c757d' : aplicativoDados.corSiteSecundaria}`, 
            main: `${aplicativoDados.corSiteSecundaria === aplicativoDados.corSitePrimaria ? '#6c757d' : aplicativoDados.corSiteSecundaria}`, 
            contrastText: `#000000`,
          },
          success:{
            light: `#28a745`,
            main: `#28a745`,
            contrastText: `#fff`,
          }
        },
      });
  

    var usuarioLogado
    try {
      usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"));
    } catch (error) {
      localStorage.clear()
      usuarioLogado = null
    }


    if(usuarioLogado?.logado){
      console.log("tem usuario")
      return (
        <ThemeProvider theme={theme}>
          {usuarioLogado.estabelecimentos.length === 1 
          ? aplicativoDados.possuiDelivery === false
            ? <Redirect to="/fidelidade" />
            : <Redirect to="/delivery" />
          : <Redirect to="/estabelecimento" />}        
        </ThemeProvider>
      )
    }else{
      
      return (
        <ThemeProvider  theme={theme}>
          <Route {...rest} render={props => (
            aplicativoDados && navigator.onLine ?
                  <Component {...props} />
              : <Redirect to="/" />
          )} />
        </ThemeProvider>
      );

    }
    
  }
};



const verificarStoragesNecessarios = () => {
  console.log('verificarStoragesNecessarios')
  let cardapio;
  try {
    cardapio = JSON.parse(localStorage.getItem(`cardapioCF`))
  } catch (error) {
    
  }

  let carrinho;
  try {
    carrinho = JSON.parse(localStorage.getItem(`carrinhoCF`))
  } catch (error) {
    
  }

  let enderecoAtual;
  try {
    enderecoAtual = JSON.parse(localStorage.getItem(`enderecoAtualCF`))
  } catch (error) {
    
  }
  
  if(!cardapio){
    localStorage.setItem("cardapioCF", JSON.stringify({})) 
  }

  
  //verificar endereco
  if(!enderecoAtual){
    localStorage.setItem("enderecoAtualCF", JSON.stringify({})) 
  }else if(enderecoAtual.ativo || enderecoAtual.id){
    if(enderecoAtual.bairroEspecifico == null || enderecoAtual.bairroEspecifico == undefined){
      enderecoAtual.bairroEspecifico = 0
      localStorage.setItem("enderecoAtualCF", JSON.stringify(enderecoAtual))     
    }
  }
  //verificar carrinho
  if(!carrinho){
    localStorage.setItem("carrinhoCF", JSON.stringify({}))
  }else if(!carrinho.pedido && cardapio?.id){
    console.log('ajustando carrinho')
    const carrinhoRetorno = {}
    carrinhoRetorno.valorMinimoPedido = cardapio.valorMinimoPedido
    carrinhoRetorno.valorDesconto = cardapio.valorDesconto
    carrinhoRetorno.percentualDesconto = cardapio.percentualDesconto
    carrinhoRetorno.minimoEntregaGratis = cardapio.minimoEntregaGratis
    carrinhoRetorno.maximoPedidoComDesconto = cardapio.maximoPedidoComDesconto
    carrinhoRetorno.maximoDesconto = cardapio.maximoDesconto
    carrinhoRetorno.cupomDesconto = cardapio.cupomDesconto
    carrinhoRetorno.data = new Date()
    carrinhoRetorno.pedido = {
      "entregaImediata": false,
      "formaPagamento": {},
      "itens": [],
      "taxaEntrega": ( cardapio?.endereco != null && cardapio?.endereco.length > 0) ? cardapio.enderecos[0].taxaEntrega : null,
      //"tipoDesconto": null,
      "tokenCartaoCredito": null,
      "troco": null,
      "valorDesconto": carrinhoRetorno.valorDesconto,
      "valorEntrega": null,
      "valorTotal": 0,
      "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
    }
    //console.log('carrino', carrinhoRetorno)
    localStorage.setItem("carrinhoCF", JSON.stringify(carrinhoRetorno))     
  }
}

const PrivateRoute = ({component: Component, ...rest}) => {

  
  console.log("PrivateRoute")

  window.scrollTo(0, 0)
  var deuErro = false
  var usuarioLogado
  var aplicativoDados
  var estabelecimentoAtual
  

  try {
    usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"));
  } catch (error) {
    localStorage.clear()
    usuarioLogado = null
  }

  try {
    aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF")) ;
    estabelecimentoAtual = JSON.parse(localStorage.getItem("estabelecimentoAtualCF")) ;
    if(!estabelecimentoAtual){
      estabelecimentoAtual = {}
    }
    if(aplicativoDados.codErro > 0){
      localStorage.clear()
      return (
          <Redirect to={'/' + rest.location.search} />   
      );
    }

  } catch (error) {
    deuErro = true
  }

  

  
  
  if(!aplicativoDados || deuErro){
    localStorage.clear()
    return (
        <Redirect to={"/" + rest.location.search} />   
    );
  }else{
    verificarStoragesNecessarios()

    const search = rest.location.search;
    const params = new URLSearchParams(search); 
    const lojaParams = params.get('loja')
    if(rest.path.includes("/delivery") && estabelecimentoAtual && lojaParams && !(lojaParams == estabelecimentoAtual.id || lojaParams == estabelecimentoAtual.codigo)){
      const tmp = aplicativoDados.estabelecimentos.filter((est) => (est.id == lojaParams || est.codigo == lojaParams))
      if(tmp.length > 0){
        localStorage.setItem('estabelecimentoAtualCF', JSON.stringify(tmp[0]))
        localStorage.setItem('cardapioCF', '{}')
      }
    }

    else if(rest.path.includes("/delivery") && !JSON.parse(localStorage.getItem(`estabelecimentoAtualCF`))){
      return (
        <Redirect 
        to={'/estabelecimento'} />   
      );
    }


    if(new Date() - new Date(localStorage.getItem('dateAplicativoDadosCF')) > 600000){
      atualizarAppDados(aplicativoDados)
    }

    var retorno = true;
    if(usuarioLogado?.logado && (/*rest.path.includes("/delivery/fidelidade") || */ localStorage.getItem('atualizarUsuarioCF') == "true" || ((new Date() - new Date(localStorage.getItem('dateUsuarioCF'))) > 600000) && !JSON.parse(localStorage.getItem('usuarioPedidoMesaCF'))?.logado && !JSON.parse(localStorage.getItem('usuarioIzzaCF'))?.logado  )){
      localStorage.removeItem('atualizarUsuarioCF')
      console.log('atualizar usuario')
      retorno = atualizarUsuario(aplicativoDados, usuarioLogado)
    }

    if(aplicativoDados !== 'string'){
      headAdd(aplicativoDados, rest)
    }  
  
    const theme = createMuiTheme({
        palette: {
          primary: {
            light: `${aplicativoDados.corSitePrimaria}`,
            main: `${aplicativoDados.corSitePrimaria}`,
            // dark: will be calculated from palette.secondary.main,
            contrastText: `#fff`,
          },
          secondary: {
            light: `${aplicativoDados.corSiteSecundaria === aplicativoDados.corSitePrimaria ? '#6c757d' : aplicativoDados.corSiteSecundaria}`, 
            main: `${aplicativoDados.corSiteSecundaria === aplicativoDados.corSitePrimaria ? '#6c757d' : aplicativoDados.corSiteSecundaria}`, 
            contrastText: `#000000`,
          },
          success:{
            light: `#28a745`,
            main: `#28a745`,
            contrastText: `#fff`,
          }
        },
      });


      

    return (
      <ThemeProvider  theme={theme}>
        <Route {...rest} render={props => (
          (usuarioLogado && aplicativoDados && navigator.onLine && retorno)
            ? 
            <Component {...props} />
            : <Redirect to="/" />
        )} />
      </ThemeProvider>
    );
    
  }
};

const RouteDados = ({component: Component, ...rest}) => {
  
  console.log("routeDados", rest)
  //isso para login com token

  var deuErro = false
  var aplicativoDados
  var izzalogada
  var usuarioLogado

  try {
    izzalogada = JSON.parse(localStorage.getItem("usuarioIzzaCF"));
    aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"));
    usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"));

    if(aplicativoDados.codErro > 0){
      localStorage.clear()
      return (
          <Redirect to={'/' + rest.location.search} />   
      );
    }
  } catch (error) {
    deuErro = true
  }

  // const izzalogada = JSON.parse(localStorage.getItem("usuarioIzzaCF"));
  console.log("RouteDados", aplicativoDados,!!aplicativoDados, typeof aplicativoDados !== 'string', navigator.onLine)

  if(rest.path.includes("/login/Acesso") && !izzalogada?.logado){
    localStorage.clear()
    return (
      <Redirect 
      to={'/'+rest.location.search+'&loginIzza=true'} />   
    );
  }

  if(rest.path.includes("/cadastro") && !rest.location.search.includes('cadastro') && !aplicativoDados){
    localStorage.clear()
    return (
      <Redirect 
      to={'/'+rest.location.search+'&cadastro=true'} />   
    );
  }


  if(rest.path.includes("/login/pedidoMesa")){
      localStorage.clear()
      return (
        <Redirect 
        to={'/'+rest.location.search+'&pedidoMesa=true'} />   
      );
  }


  if(rest.path.includes("/delivery/avaliacaoPedido") && !aplicativoDados){
    localStorage.clear()
    return (
        <Redirect 
        to={'/'+rest.location.search+'&avaliacao=true'} />   
    );
  }

  if(rest.path.includes("/downloads/imagensTematicas") && !aplicativoDados){
    localStorage.clear()
    return (
        <Redirect 
        to={'/?downloadImagens=true'} />   
    );
  }

    if(rest.path.includes("/downloads/escolha") && !aplicativoDados){
      localStorage.clear()
      return (
          <Redirect 
          to={'/?downloadEscolha=true'} />   
      );
    }

  if(rest.path.includes("/downloads") && !aplicativoDados){
    localStorage.clear()
    return (
        <Redirect 
        to={'/?download=true'} />   
    );
  }

  

  if(!aplicativoDados || deuErro){
    localStorage.clear()
    return (
        <Redirect to={'/' + rest.location.search} />   
    );
  }


  
  if(new Date() - new Date(localStorage.getItem('dateAplicativoDadosCF')) > 600000){
    atualizarAppDados(aplicativoDados)
  }


  if(aplicativoDados && typeof aplicativoDados !== 'string'){
    headAdd(aplicativoDados, rest)
  }
  

   const theme = createMuiTheme({
      palette: {
        primary: {
          light: `${aplicativoDados.corSitePrimaria}`,
          main: `${aplicativoDados.corSitePrimaria}`,
          // dark: will be calculated from palette.secondary.main,
          contrastText: `#fff`,
        },
        secondary: {
          light: `${aplicativoDados.corSiteSecundaria === aplicativoDados.corSitePrimaria ? '#6c757d' : aplicativoDados.corSiteSecundaria}`, 
          main: `${aplicativoDados.corSiteSecundaria === aplicativoDados.corSitePrimaria ? '#6c757d' : aplicativoDados.corSiteSecundaria}`, 
          contrastText: `#000000`,
        },
        success:{
          light: `#28a745`,
          main: `#28a745`,
          contrastText: `#fff`,
        }
      },
    });

  

  var usuarioLogado
  
  try {
    usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"));
  } catch (error) {
    localStorage.clear()
    usuarioLogado = null
  }
  
  const params = new URLSearchParams(rest.location.search);  

  

  if(usuarioLogado?.logado && (!params.get('loja') || !params.get('mesa'))  && !rest.path.includes("/delivery/avaliacaoPedido") && !rest.path.includes("/downloads") && !rest.path.includes("/login/pedidoMesa")){
    console.log("tem usuario")
    return (
      <ThemeProvider  theme={theme}>
        {usuarioLogado.estabelecimentos.length === 1 
        ? aplicativoDados.possuiDelivery === false
          ? <Redirect to="/fidelidade" />
          : <Redirect to="/delivery" />
        : <Redirect to="/estabelecimento" />}        
      </ThemeProvider>
  );
  }else{      
    return (
        <ThemeProvider  theme={theme}>
          <Route {...rest} render={props => (
            aplicativoDados && typeof aplicativoDados !== 'string' && navigator.onLine  ?
                  <Component {...props} />
              : <Redirect to="/" />
          )} />
        </ThemeProvider>
    );
  }
};

const atualizarUsuario = async (aplicativoDados, usuarioLogado) => {
  try {
    localStorage.setItem('dateUsuarioCF', new Date())

    const data = {
      "appNome": aplicativoDados.appNome,
      "cliente":{
        "email": usuarioLogado.cliente.email,
        "hashSenha": usuarioLogado.cliente.hashSenha, 
        "appNome": aplicativoDados.appNome,
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
      },
      "localizacao":{
        "latitude": "",
        "longitude": "",
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
        "appNome": aplicativoDados.appNome,
      },
      "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
    }

    const response = await LoginGeral(data, aplicativoDados)

    if(response.retornoErro){
      //algum erro
      if(response.mensagem.includes("inseridos estão incorretos.")){
        localStorage.clear()
        return false
      }
	    // alertStart(response.mensagem, "error")
    }else{ 
      //tudo certo

      if(localStorage.getItem('tokenNotificationFirebase')){
        if( response.cliente.codigoDispositivo !== localStorage.getItem('tokenNotificationFirebase' )){
          response.cliente.codigoDispositivo = localStorage.getItem('tokenNotificationFirebase')
          response.cliente.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`
          AtualizarDispositivoUsuario(response.cliente, aplicativoDados)
        }
      }

      localStorage.setItem('usuarioCF', JSON.stringify(response));
      console.log(" ===== usuario atualizado ===== ") 
    }
  }
  catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions atualizarUsuario ${window.location.hostname} - ${error}`);
      // alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
  }
  return true
}

const atualizarAppDados = async (aplicativoDados) => {
  
  try {
    
    const response = await AplicativoDadosUrl(aplicativoDados.urlAcesso, aplicativoDados.appNome)
    if(response.retornoErro){
      //algum erro
	    // alertStart(response.mensagem, "error")
    }else if(response.codErro > 0){
      
    }else{ 
      //tudo certo
      localStorage.setItem('dateAplicativoDadosCF', new Date())  
      localStorage.setItem('aplicativoCF', JSON.stringify(response));  
      console.log(" ===== appDados atualizado ===== ") 
      
      //Atualziar estabelecimento atual
      let estabelecimentoAtual = JSON.parse(localStorage.getItem('estabelecimentoAtualCF'))
      if(estabelecimentoAtual?.id){
        for(let j = 0; response.estabelecimentos.length > j; j++){
          if(response.estabelecimentos[j].id === estabelecimentoAtual.id){
            localStorage.setItem('estabelecimentoAtualCF', JSON.stringify(response.estabelecimentos[j]))
          }
        }
      }

    }
  }
  catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions AplicativoDadosUrl ${window.location.hostname} - ${error}`);
      // alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
  }

}

const headAdd = (aplicativoDados, rest) => {

    

    pixelFacebook(aplicativoDados)
  
    googleAnalytics(aplicativoDados, rest)

    tagManager(aplicativoDados)


    //console.log("aplicativoDados", aplicativoDados)
    document.title = aplicativoDados.projectName
    //<link rel="apple-touch-icon" href="/sitefiles/12345/678/90/apple-touch-icon.png">
    const logoIphone = document.createElement('link')
    logoIphone.setAttribute('rel', "Apple-touch-icon");
    logoIphone.setAttribute('sizes', "128x128");
    logoIphone.setAttribute('href', aplicativoDados.urlLogo);
    document.head.insertAdjacentElement('beforeend', logoIphone)

    const logoIphone2 = document.createElement('link')
    logoIphone2.setAttribute('rel', "Apple-touch-icon-precomposed");
    logoIphone2.setAttribute('href', aplicativoDados.urlLogo);
    document.head.insertAdjacentElement('beforeend', logoIphone2)

    const shortCurt = document.createElement('link')
    shortCurt.setAttribute('rel', "shortcut icon");
    shortCurt.setAttribute('sizes', "192x192");
    shortCurt.setAttribute('href', aplicativoDados.urlLogo);
    document.head.insertAdjacentElement('beforeend', shortCurt)
    
    const shortCurt2 = document.createElement('link')
    shortCurt2.setAttribute('rel', "shortcut icon");
    shortCurt2.setAttribute('sizes', aplicativoDados.corSitePrimaria);
    shortCurt2.setAttribute('href', aplicativoDados.urlLogo);
    document.head.insertAdjacentElement('beforeend', shortCurt2)

    

    const ogImage = document.createElement('meta')
    ogImage.setAttribute('property','og:image')
    ogImage.setAttribute('content', `${aplicativoDados.urlLogo}`)
    document.head.insertAdjacentElement('beforeend', ogImage)
    
    const ogUrl = document.createElement('meta')
    ogUrl.setAttribute('property','og:url')
    ogUrl.setAttribute('content', `https://${aplicativoDados.urlAcesso}`)
    document.head.insertAdjacentElement('beforeend', ogUrl)
    
    const ogType = document.createElement('meta')
    ogType.setAttribute('property','og:type')
    ogType.setAttribute('content', `website`)
    document.head.insertAdjacentElement('beforeend', ogType)
    
    const ogDescription = document.createElement('meta')
    ogDescription.setAttribute('property','og:description')
    ogDescription.setAttribute('content', `Faça pedidos online no delivery OFICIAL ${aplicativoDados.projectName}. Veja preços dos pratos no cardápio virtual do ${aplicativoDados.projectName} para entrega, retirada, pedido de mesa e programas de fidelidade.`)
    document.head.insertAdjacentElement('beforeend', ogDescription)
    
    const description = document.createElement('meta')
    description.setAttribute('name','description')
    description.setAttribute('content', `Faça pedidos online no delivery OFICIAL ${aplicativoDados.projectName}. Veja preços dos pratos no cardápio virtual do ${aplicativoDados.projectName} para entrega, retirada, pedido de mesa e programas de fidelidade.`)
    document.head.insertAdjacentElement('beforeend', description)
    
    
    const keywords = document.createElement('meta')
    keywords.setAttribute('name','keywords')
    keywords.setAttribute('content', `Site ${aplicativoDados.projectName},aplicativo ${aplicativoDados.projectName},pedir ${aplicativoDados.projectName},${aplicativoDados.projectName} delivery OFICIAL, ${aplicativoDados.projectName} delivery, ${aplicativoDados.projectName} entrega, ${aplicativoDados.projectName}, ${aplicativoDados.projectName}, cardapio ${aplicativoDados.projectName}, preços ${aplicativoDados.projectName}`)
    document.head.insertAdjacentElement('beforeend', keywords)
    




    const themeColor = document.createElement('meta')
    themeColor.setAttribute('name','theme-color')
    themeColor.setAttribute('content', aplicativoDados.corSitePrimaria)    
    document.head.insertAdjacentElement('beforeend', themeColor)

    aplicativoDados?.script ? document.head.insertAdjacentHTML("afterbegin", aplicativoDados?.script ) : console.log('nao tem nada adiconar ao head')
    aplicativoDados?.scriptscriptBody ? document.body.insertAdjacentHTML("afterbegin", aplicativoDados?.scriptscriptBody ) : console.log('nao tem nada adiconar ao body')

    const themeLinkUrl = document.createElement('link')
    themeLinkUrl.setAttribute('rel','icon')
    themeLinkUrl.setAttribute('href', aplicativoDados.urlLogo)    
    document.head.insertAdjacentElement('beforeend', themeLinkUrl)

    var myDynamicManifest = {
      "short_name": `${aplicativoDados.projectName}`,
      "scope": "/",
      "start_url": "/",
      "name": `${aplicativoDados.projectName} WEB APP Delivery`,
      "description": `Faça pedidos online no delivery OFICIAL ${aplicativoDados.projectName}. Veja preços dos pratos no cardápio virtual do ${aplicativoDados.projectName} para entrega, retirada, pedido de mesa e programas de fidelidade.`,      
      "orientation": "portrait",
      "display": "standalone",
      "description": "Aceitar seus pedidos de delivery",
      "theme_color": `${aplicativoDados.corSitePrimaria}`,
      "background_color": `${aplicativoDados.corSitePrimaria}`,
      "icons": [
        {
          "src": `${aplicativoDados.urlLogo}`,
          "sizes": "192x192",
          "type": "image/png"
        }
      ],
      "related_applications": [{
        "platform": "web"
      }]
    }

    const stringManifest = JSON.stringify(myDynamicManifest);
    const blob = new Blob([stringManifest], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(blob);
    // document.querySelector('#my-manifest-placeholder').setAttribute('href', manifestURL);
    // document.querySelector('#my-manifest-placeholder').setAttribute('href', "http://localhost:3000/manifest");
}


export default Routes