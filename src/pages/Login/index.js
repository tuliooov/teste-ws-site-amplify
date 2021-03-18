import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Sentry from "@sentry/react";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AirlineSeatReclineNormalIcon from '@material-ui/icons/AirlineSeatReclineNormal';

import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Grid from '@material-ui/core/Grid';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';



import api from '../../services/api';
import {LoginGeral,AtualizarDispositivoUsuario, removeAcento, RedefinirSenha, identificarEstabelecimentoSelecionado} from '../../services/functions';
import './styles.css';



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  rootAlert: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    width: "100%",
    margin: "1em 0",
  },
  pos: {
    marginBottom: 12,
  },
}));


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function Login(props) {
  const [estabelecimentoAtual, setEstabelecimentoAtual] = useState(JSON.parse(localStorage.getItem("estabelecimentoAtualCF")));
  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))  
  const [tipoLogin, setTipoLogin] = useState( (aplicativoDados?.permiteLoginTelefone  && (aplicativoDados.loginApenasTelefone || localStorage.getItem('tipoLoginCF')) == 'apenasTelefone') ? 'apenasTelefone' : 'usuarioSenha' );
  //login salvo pela tentativa de logincom token da izza com link expirado
  localStorage.removeItem('tipoLoginCF')

  // const [definirAcao, setDefinirAcao] = React.useState(tipoLogin ? true : false);
  
  //const [usuario, setUsuario] = useState('guilherme.jar@gmail.com');
  const [usuario, setUsuario] = useState('');
  //const [senha, setSenha] = useState('321321');
  const [senha, setSenha] = useState('');

  const [esqueceuSenha, setEsqueceuSenha] = useState({"abrir": false, "email": '', "tipoRecuperacao": 0});
  const [telefone, setTelefone] = useState('');
  const [smsOrWhatsapp, setSmsOrWhatsapp] = useState('');
  const [CadastroTelefone, setCadastroTelefone] = useState(false);
  const [telaCodigo, setTelaCodigo] = useState(false);
  const [usuariosMesmoTelefone, setUsuariosMesmoTelefone] = useState({});
  const [verificarUsuario, setVerificarUsuario] = useState({"aberto":false, "usuario":0});
  const [acessToken, setAcessToken] = useState('');
  const history = useHistory();
  //LOGIN TOKEN
  const search = props.location.search;
  const params = new URLSearchParams(search);  
  const [whats, setWhats] = useState(params.get('whats'));
  const [chave, setChave] = useState(params.get('chave'));
  const [lojaParams, setLojaParams] = useState(params.get('loja'));

  const FacebookId = params.get('facebookId')
  const FacebookEmail = params.get('facebookEmail')
  const FacebookNome = params.get('facebookNome')

  
  const [tentativaMesa, setTentativaMesa] = useState(0)
  const [tentativaIzza, setTentativaIzza] = useState(0)
  const [tentativaFacebookLogin, setTentativaFacebookLogin] = useState(0)


  const classes = useStyles();

  

  // FUNCOES
  
  //alerts e loading
  const alertStart = (msg, tipo) => {
    setAlert({"status": true, "tipo": tipo, "mesangem": msg});
  };
  
  const alertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({"status": false, "tipo": alert.tipo, "mesangem": alert.mesangem});

  };

  

  const loginPedidoMesa = async () => {
    setLoading(true)
    setTentativaMesa(1)

    try {

      var data = {}

      if(params.get('mesa')){
        data = {
          "appNome": aplicativoDados.appNome,
          "nome": "Mesa " + params.get('mesa'),
          "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
        }
      }else if(params.get('comanda')){
        data = {
          "appNome": aplicativoDados.appNome,
          "nome": "Comanda " + params.get('comanda'),
          "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
        }
      }

      

      await api.post('clientefiel/CadastrarUsuarioMesa', data, {
        headers: { "Content-Type": "application/json" }
      }).then(response => {
       console.log('CadastrarUsuarioMesa', response)

        if(typeof response.data != 'string' && !response.data.codErro > 0){
          response.data.logado = true
          response.data.cliente.telefone = ""
          localStorage.setItem('usuarioCF', JSON.stringify(response.data));
          response.data.cliente.nome = ""
          localStorage.setItem('usuarioPedidoMesaCF_Date', new Date())
          localStorage.setItem('usuarioPedidoMesaCF', JSON.stringify(response.data))

          localStorage.setItem("enderecoAtualCF", JSON.stringify({}))
          localStorage.setItem('carrinhoCF', JSON.stringify({}));
          

          const lojaId = params.get('loja')
          aplicativoDados.estabelecimentos.forEach((loja) => {
            if(loja.id == lojaId){ 
              localStorage.setItem("estabelecimentoAtualCF", JSON.stringify(loja))
            }
          })
          

          if(localStorage.getItem("estabelecimentoAtualCF")){
           //console.log('buscarcarapio')
            buscaCardapioInicial(response.data)
          }else{
            localStorage.removeItem('usuarioPedidoMesaCF')
            localStorage.removeItem('usuarioCF')
            localStorage.removeItem('usuarioPedidoMesaCF_Date')
            setLoading(false)
            alertStart("Nenhum estabelecimento disponivel para essa mesa", "error")   
          }
          
          //realizarLogin_UsuarioSenha(false , response.data.cliente.email, response.data.cliente.hashSenha)
        }else{
          setLoading(false)
          alertStart("Houve um erro ao buscar mesa", "error")
        }

      })
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`${aplicativoDados.appNome} - ${error} - CadastrarUsuarioMesa`);
      alertStart("Erro inesperado ao buscar mesa", "error")
      setLoading(false)
    }

  }
  function calcularValorTotal(carrinho){
    
    const cardapio = JSON.parse(localStorage.getItem('cardapioCF'))
    // const carrinho = JSON.parse(localStorage.getItem('carrinhoCF'))
    const enderecoAtual = JSON.parse(localStorage.getItem('enderecoAtualCF'))

    let valorTotalItens = 0;
    let valorProdutosPromocionais = 0;

    carrinho.pedido.itens.forEach(item => {
      valorTotalItens += item.valorProdutoHistorico      
      if(item.produto.promocional){
        valorProdutosPromocionais += item.valorProdutoHistorico
      }
    })

   //console.log("valorProdutosPromocionais", valorProdutosPromocionais)
   //console.log("valorPrduto", valorTotalItens)
    
    


    let taxaDeEntrega = 0
    if(enderecoAtual?.id !== "retirada" && !(valorTotalItens > cardapio.minimoEntregaGratis && cardapio.minimoEntregaGratis > 0)){ // NAO FOR RETIRADA NO LOCAL
      taxaDeEntrega = carrinho.pedido.valorEntrega ? carrinho.pedido.valorEntrega : enderecoAtual.taxaEntrega ? enderecoAtual.taxaEntrega : 0
    }

    let valorFinalProdutos = 0;
    if(cardapio.percentualDesconto && (cardapio.valorDesconto === 0 || !cardapio.valorDesconto)){
      //desconto percetual - apenas em produtos nao promocionais
      var descontoPercentual = ((valorTotalItens - valorProdutosPromocionais) * cardapio.percentualDesconto) / 100

      //maximo que pode dar de desconto
      if(cardapio.maximoDesconto && descontoPercentual > cardapio.maximoDesconto){
        descontoPercentual = cardapio.maximoDesconto
      }
      

      carrinho.percentualDescontoValor = descontoPercentual
      valorFinalProdutos = ( valorTotalItens - descontoPercentual ) 

    }else{
      //desconto fixo - apenas em produtos nao promocionais
      var descontoFixo = carrinho.pedido.valorDesconto

      //maximo que pode dar de desconto
      if(cardapio.maximoDesconto && descontoFixo > cardapio.maximoDesconto){
        descontoFixo = cardapio.maximoDesconto
      }

      // let produtosNaoPromocionais = valorTotalItens - valorProdutosPromocionais
      // produtosNaoPromocionais -= descontoFixo      
      // valorFinalProdutos = valorProdutosPromocionais + (produtosNaoPromocionais > 0 ? produtosNaoPromocionais : 0)     
      valorFinalProdutos = valorTotalItens - descontoFixo   

    }

   //console.log("valorFinalProdutos", valorFinalProdutos)
    if(valorFinalProdutos < 0){
      carrinho.pedido.valorTotal = taxaDeEntrega
    }else{
      carrinho.pedido.valorTotal = valorFinalProdutos + taxaDeEntrega
    }



    if(carrinho.pedido.valorTotal < 0){
      carrinho.pedido.valorTotal = 0.0
    }

    localStorage.setItem("carrinhoCF", JSON.stringify(carrinho))     


  }

  const adicionarEndereco = async (usuarioLogado) => {  
      var resp = null;
      try {
        const enderecoBackUp = JSON.parse(localStorage.getItem("enderecoAtualCF"))
        const data = {
          "idCliente": usuarioLogado.cliente.id,
          "idEstabelecimento": JSON.parse(localStorage.getItem("estabelecimentoAtualCF"))?.id,
          "cep": enderecoBackUp.cep,
          "uf": enderecoBackUp.uf,
          "cidade": enderecoBackUp.cidade,
          "bairro": enderecoBackUp.bairro,
          "logradouro": enderecoBackUp.logradouro,
          "numero": enderecoBackUp.numero,
          "complemento": enderecoBackUp.complemento,
          "referencia": enderecoBackUp.referencia,
          "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
        }
        
        if(enderecoBackUp.bairroEspecifico){
          data.bairroEspecifico = 1
        }else{
          data.bairroEspecifico = 0
        }
        
        await api.post('cliente/CadastrarEnderecoCliente', data, {
          headers: { "Content-Type": "application/json" }
        }).then(retorno => {
          console.log('CadastrarEnderecoCliente', retorno)
  
          if(typeof retorno.data == 'string' ){
            alertStart("Erro inesperado ao cadastrar endereço", "error")     
          }else if(!(retorno.data.codErro > 0) ){
            
            if(usuarioLogado.cliente && usuarioLogado.cliente.enderecos){
              usuarioLogado.cliente.enderecos.push(retorno.data)
              localStorage.setItem('usuarioCF', JSON.stringify(usuarioLogado))
              resp = retorno.data.id
            }else{
              alertStart('Não foi possivel cadastrar o seu endereço!', "error")     
            }
            
          }else{
            alertStart(retorno.data.mensagem, "error")     
          }
        })
      } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`${aplicativoDados.appNome} - ${error} - CadastrarEnderecoCliente`);
        alertStart("Algo deu errado ao adicionar endereço.", "error")     
      }
      return resp;
  }
  
  async function buscaCardapioInicial(usuarioLogado) {
    const cardapio = JSON.parse(localStorage.getItem("cardapioCF"))
    try {
      if(aplicativoDados.possuiDelivery === true){
        // if(!cardapio || cardapio.id === "usuarioDeslogado" || !!JSON.parse(localStorage.getItem('usuarioPedidoMesaCF'))?.logado){
          var idEndereco = null
          if(!!JSON.parse(localStorage.getItem("enderecoAtualCF")).bairro){
            idEndereco = await adicionarEndereco(usuarioLogado);
            console.log('cadastrar endereco', idEndereco)
          }


          let data = {
            "idCliente": usuarioLogado.cliente.id,
            "idEstabelecimento": localStorage.getItem('estabelecimentoAtualCF') ? JSON.parse(localStorage.getItem('estabelecimentoAtualCF')).id : usuarioLogado.estabelecimentos[0].id,
            "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
          }     


          
          if(idEndereco){
            data.idEndereco = idEndereco
          }
          var response = {};
          if(!!JSON.parse(localStorage.getItem('usuarioPedidoMesaCF'))?.logado){
            response = await api.post('clientefiel/ObterCardapioPedidoMesa', data, {
              headers: { "Content-Type": "application/json",  "plataforma": "site" }
            })
            console.log("ObterCardapioPedidoMesa", data, response)
          }else{
            response = await api.post('clientefiel/ObterCardapioCompletoV1', data, {
              headers: { "Content-Type": "application/json",  "plataforma": "site" }
            })
            console.log("ObterCardapioCompletoV1", data, response)

          }
          
          if(response.data.codErro > 0){
            alertStart(response.data.mensagem, "error")
          }else{
    
            const retorno = response.data
            
            console.log('ObterCardapioCompletoV1 retorno> ', retorno)

            if(!usuarioLogado?.logado){
            // if(!JSON.parse(localStorage.getItem('usuarioCF'))?.logado){
              retorno.id = "usuarioDeslogado"
            }

            localStorage.setItem("cardapioCF", JSON.stringify(retorno))                        
            localStorage.setItem("enderecoAtualCF", JSON.stringify(( retorno?.enderecos != null && retorno?.enderecos.length > 0) ? retorno.enderecos[0] : {}))

            
            const carrinhoRetorno = JSON.parse(localStorage.getItem("carrinhoCF")) 
    
            carrinhoRetorno.valorMinimoPedido = retorno.valorMinimoPedido
            carrinhoRetorno.valorDesconto = retorno.valorDesconto
            carrinhoRetorno.percentualDesconto = retorno.percentualDesconto
            carrinhoRetorno.minimoEntregaGratis = retorno.minimoEntregaGratis
            carrinhoRetorno.maximoPedidoComDesconto = retorno.maximoPedidoComDesconto
            carrinhoRetorno.maximoDesconto = retorno.maximoDesconto
            carrinhoRetorno.cupomDesconto = retorno.cupomDesconto
    
            const produtosDoCarrinho = JSON.parse(localStorage.getItem('backupItensCarrinhoCF'))

            carrinhoRetorno.data = new Date()
            carrinhoRetorno.pedido = {
              "entregaImediata": false,
              "formaPagamento": {},
              "itens": produtosDoCarrinho?.length > 0 ? produtosDoCarrinho :  [],
              "taxaEntrega": ( retorno?.endereco != null && retorno?.endereco.length > 0) ? retorno.enderecos[0].taxaEntrega : null,
              //"tipoDesconto": null,
              "tokenCartaoCredito": null,
              "troco": null,
              "valorDesconto": carrinhoRetorno.valorDesconto,
              "valorEntrega": null,
              "valorTotal": 0,
              "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
            }

            if(produtosDoCarrinho?.length > 0){
              calcularValorTotal(carrinhoRetorno)
            }else{
              localStorage.setItem("carrinhoCF", JSON.stringify(carrinhoRetorno))     
            }


            
            if(JSON.parse(localStorage.getItem('usuarioPedidoMesaCF'))?.logado || (usuarioLogado.estabelecimentos.length === 1 || (JSON.parse(localStorage.getItem('estabelecimentoAtualCF'))?.id && produtosDoCarrinho?.length > 0) || (JSON.parse(localStorage.getItem('estabelecimentoAtualCF'))?.id == lojaParams || JSON.parse(localStorage.getItem('estabelecimentoAtualCF'))?.codigo == lojaParams) ) ){
              history.push(`/delivery${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
            }else if(usuarioLogado.estabelecimentos.length > 1 ){
              history.push(`/estabelecimento`)
            }
    
    
          }
      }else{
        history.push(`/fidelidade${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
      }  
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`${aplicativoDados.appNome} - ${error} - ObterCardapio`);
      alertStart("Erro nao identificado ObterCardapioCompletoV1" + error, "error")  
      console.log(error)
      setLoading(false)       
    }
  }


  
  

  
  const [loading, setLoading] = React.useState(!!chave);
  const [alert, setAlert] = useState({"status": false, "tipo": "success", "mesangem": ""});


  
  
  if(tentativaMesa === 0 && (params.get("mesa") || params.get("comanda"))){
    loginPedidoMesa()  
  }
  
  if(tentativaIzza === 0){
    if(!!chave && !!whats){
      realizarLogin_tokenizza(chave, whats)
    }  
  }

  if(tentativaFacebookLogin === 0){
    if(!!FacebookId){
      realizarLogin_UsuarioSenha(null, null, null, FacebookId, FacebookEmail, FacebookNome)
    }  
  }

  async function cadastrarUsuarioLoginTelefone(e){
    e.preventDefault()
    setLoading(true)
    setCadastroTelefone(false)
    try {
      let telefoneReplace = telefone.replace(' ', '').replace('.','').replace('-','').replace('(','').replace(')','').replace('/','')
      const data = {
        "appNome": aplicativoDados.appNome,
        "nome": document.getElementById('nomeCadastroTelefone').value,
        "telefone": telefone,
        "dataNascimentoTexto": '',
        "email": '55'+telefoneReplace+"@c.us",
        "hashSenha": '!@#$%semsenha\nok?',
        "cpf": '',
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
      }

      /*
        if(codigoIndicacao){
          data.codigoAmigo = codigoIndicacao.codigo
        }
      */
  
     //console.log("CadastrarUsuario", data)
      await api.post('cliente/CadastrarUsuario' , data , {
        headers: {"Content-Type": "application/json"}
      }).then(resposta => {
       //console.log("Cadastrar Usuario", resposta)
        if(resposta.data.codErro > 0){ // ERRO
          alertStart(resposta.data.mensagem, "error")
          setLoading(false)
          return false
        }else{ // DEU CERTO
          alertStart("Seu usuario foi cadastrado corretamente!", "success")
          realizarLogin_UsuarioTelefone(e)
          //CHAMAR LOGIN
        }

      });

      
      return true
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`${aplicativoDados.appNome} - ${error} - CadastrarUsuario`);
      alertStart("Erro nao identificado ao cadastrar usuario por login telefone!", "error") 
      setLoading(false)
    }
  }
  async function realizarLogin_tokenizza(chave, whats){
   //console.log("realizarLogin_tokenizza")
   setTentativaIzza(1)
   alertStart("Estou tentando te conectar diretamente com o link clicado no whatsapp!", "warning") 
    try {
      const clientefiel = {
        "appNome": aplicativoDados.appNome,
        "cliente":{
          "email": chave,
          "hashSenha": chave, 
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
      

      const response = await api.post('clientefiel/LoginToken', clientefiel, {
        headers: {"Content-Type": "application/json"}
      });
      
    console.log("loginToken", response)
      if(response.data.codErro > 0 ){   
        
        localStorage.setItem('tipoLoginCF', 'apenasTelefone')
        console.log('loginToken', lojaParams)
        if(lojaParams){
          history.push(`/?loja=${lojaParams}`)
        }else{
          history.push(`/`)
        }

        
        //informe o telefone para fazer login
        // if(whats){
        //   window.location.href = `https://api.whatsapp.com/send?phone=${whats}&text=Ola,%20tudo%20bem?%20Tentei%20conectar%20com%20acesso%20expirado,%20me%20envia%20um%20novo%20link%20do%20cardápio%20ja%20conectado?`
        // }
        // alertStart(response.data.mensagem, "error")
        // setChave('')
        // setWhats('')
        // setDefinirAcao(false)
        // setTipoLogin('apenasTelefone')
        // setLoading(false)
      }else{
        localStorage.setItem('usuarioIzzaCF', JSON.stringify(response.data));
        localStorage.setItem('usuarioCF', JSON.stringify(response.data));

        if(!JSON.parse(localStorage.getItem("enderecoAtualCF"))?.bairro){
          localStorage.setItem("enderecoAtualCF", JSON.stringify({}))
        }
        
        if(lojaParams){
          const estabelecimentoEncontrado = response.data.estabelecimentos.filter((e) => (e.id == lojaParams || e.codigo == lojaParams))
          if(estabelecimentoEncontrado.length > 0){
            localStorage.setItem("estabelecimentoAtualCF", JSON.stringify(estabelecimentoEncontrado[0]))
          }else{
            localStorage.setItem("estabelecimentoAtualCF", JSON.stringify(response.data.estabelecimentos[0]))
          }
          
        }else{
          localStorage.setItem("estabelecimentoAtualCF", JSON.stringify(response.data.estabelecimentos[0]))
        }
        

        localStorage.setItem('carrinhoCF', JSON.stringify({}));

        if(response.data.estabelecimentos.length > 0){
          await buscaCardapioInicial(response.data)
        }else{
          alertStart("Nenhum estabelecimento disponivel nesse aplicativo", "error")   
        }

      }
    } catch (error) {        
      Sentry.captureMessage(localStorage.getItem('versao')+`${aplicativoDados.appNome} - ${error} - LoginToken`);
      alertStart("Erro nao identificado LoginToken", "error")    
    }   
  }
  
  function asteriscosUsuarioLoginTelefone(recebi){
    const tamanho = recebi.length
    let retorno = recebi[0]
    let astericos = '';
    for(let i = 1; i < (tamanho-1); i++){
      if(recebi[i] === '@'){
        astericos += "@" + recebi[i+1]
        i++
      }else if(recebi[i] === '.'){
        astericos += "." + recebi[i+1]
        i++
      }
      astericos += "*"
    }
    retorno += astericos + recebi[tamanho-1]
    return retorno
  }

  
  async function verificarTokenLoginTelefone(codigo) {
    
    try {

      alertClose()

      if(codigo !== acessToken){
        alertStart("Código invalido!", "error")
        setTelaCodigo(false)
        return false
      }

      setLoading(true)

      const data = {
        "idCliente": -1,
        "appName": aplicativoDados.appNome,
        "telefone": telefone,
        "codigoAcesso": codigo,
      }

      api.post('clientefiel/oauth/Autenticar' , data , {
        headers: {"Content-Type": "application/json"}
      }).then(resposta => {

        if(resposta.data.codErro > 0){ // ERRO
          alertStart(resposta.data.mensagem, "error")
          return false
        }else{ // DEU CERTO  

          

          //Existe outros usuarios
          if(resposta.data.length > 1){            
            setTelaCodigo(false)
            setUsuariosMesmoTelefone(resposta.data)
            setLoading(false)  
            alertStart("Existem outros usuarios com mesmo telefone! Identifique o seu usuário.", "warning")
          }else{
            realizarLogin_UsuarioSenha(null, resposta.data[0].email, resposta.data[0].hashSenha)
            
            //fazendo Login
            /*setUsuarioLogado(resposta.data[0])
            localStorage.setItem('usuarioCF', JSON.stringify(resposta.data[0]));
            localStorage.setItem("enderecoAtualCF", '{}')
            localStorage.setItem("estabelecimentoAtualCF", JSON.stringify(resposta.data[0].estabelecimentos[0]))
            localStorage.setItem('carrinhoCF', '{}');

            if(resposta.data[0].estabelecimentos.length > 0){
              buscaCardapioInicial(resposta.data[0])
            }else{
              alertStart("Nenhum estabelecimento disponivel para esse usuario", "error")   
            }*/
          }
        }    

      });
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions verificarTokenLoginTelefone ${window.location.hostname} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")   
    }
  }

  async function realizarLogin_UsuarioTelefone(e) {
    
    try {
      e.preventDefault()
    
      if(!(telefone.length >= 10 && telefone.length <= 11)){
        alertStart("Seu telefone esta incompleto, verifique se você digitou o DDD e o digito 9!", "warning")
        document.getElementById('telefone').focus()
        return false
      }   
      
      setLoading(true)

      const data = {
        "appNome": aplicativoDados.appNome,
        "cliente":{
          "telefone": telefone,
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

      //AJAX ENVIAR CONDIGO
      let urlEnviarCodigo = ''
      if(smsOrWhatsapp === 'WHATSAPP'){
        urlEnviarCodigo = 'clientefiel/oauth/GerarChaveTelefoneWhatsApp'
      }else if(smsOrWhatsapp === 'SMS'){
        urlEnviarCodigo = 'clientefiel/oauth/GerarChaveTelefoneSms'
      }
      

      api.post(urlEnviarCodigo , data , {
        headers: {"Content-Type": "application/json", "Plataforma": "Site"}
      }).then(resposta => { 
       //console.log('respostaa', resposta, data, urlEnviarCodigo)
        if(resposta.data.codErro > 0){ // ERRO
          alertStart(resposta.data.mensagem, "error")
          setLoading(false) 
          
          if(resposta.data.mensagem === "Usuário não encontrado") setCadastroTelefone(true)
          return false
        }else{ // DEU CERTO              
          setAcessToken(resposta.data.access_token)      
          alertStart(`Código de verificação foi enviado por ${smsOrWhatsapp}!`, "success")   
          setTelaCodigo(true)   
          setLoading(false)   
        }
        
         

      });
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions realizarLogin_UsuarioTelefone ${window.location.hostname} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")   
    }
  }


  
  async function realizarLogin_UsuarioSenha(e = false, usuarioVerificado, senhaVerificado, facebookId = null, facebookEmail = null, facebookNome = null) {
    
    try {
      if(e){
        e.preventDefault();
      }
  
      // os 2 parametros: usuarioVerificado e senhaVerificado
      // são para usuarios que conectao por telefone, apenas reutilizei essa funcao para nao criar outra
  
      setLoading(true)
      let clientefiel = {
        "appNome": aplicativoDados.appNome,
        "cliente":{
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

      if(!facebookId && (facebookEmail || facebookNome)){
        // login facebook sem id
        alertStart("Seu Facebook não permite esse tipo de login!", "wharning")

        return false
      }else if(facebookId){
        //LOGIN FACEBOOK
        setTentativaFacebookLogin(1)
        clientefiel.cliente.email = facebookEmail ? facebookEmail : `${facebookId}@facebook.com.br`
        clientefiel.cliente.facebookId = facebookId
        clientefiel.cliente.nome = facebookNome ? facebookNome : "Nome Não Identificado"
      }else if(usuarioVerificado || usuario){
        //LOGIN NORMAL
        if(!usuarioVerificado && usuario.length < 10){
          setLoading(false)
          alertStart("Email ou telefone incorreto!", "warning")
          return false
        }
        clientefiel.cliente.email = usuarioVerificado ? usuarioVerificado : usuario
        clientefiel.cliente.hashSenha = senhaVerificado ? senhaVerificado : senha
      }else{
        setLoading(false)
        alertStart("Função chamada incorretamente", "warning")
        return false
      }

      const response = await LoginGeral(clientefiel, aplicativoDados)
      
      console.log("LoginGeral", response)
      if(response.retornoErro){
        alertStart(response.mensagem, "error")
        setLoading(false)
      }else{
        
        if(localStorage.getItem('tokenNotificationFirebase')){
          if( response.cliente.codigoDispositivo !== localStorage.getItem('tokenNotificationFirebase' )){
            response.cliente.codigoDispositivo = localStorage.getItem('tokenNotificationFirebase')
            response.cliente.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`
            AtualizarDispositivoUsuario(response.cliente, aplicativoDados)
          }
        }

        localStorage.setItem('usuarioCF', JSON.stringify(response));
        
        if(!JSON.parse(localStorage.getItem("enderecoAtualCF"))?.bairro){
          localStorage.setItem("enderecoAtualCF", JSON.stringify({}))
        }

        if(!localStorage.getItem("estabelecimentoAtualCF")){
          localStorage.setItem("estabelecimentoAtualCF", JSON.stringify(response.estabelecimentos[0]))
        }
        
        
        localStorage.setItem('carrinhoCF', JSON.stringify({}));

        if(response.estabelecimentos.length > 0){
          await buscaCardapioInicial(response)
        }else{
          alertStart("Nenhum estabelecimento disponivel para esse usuario", "error")   
        }
      }
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions LoginGeral - ${aplicativoDados.appNome} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro: "+error.message, "error") 
      setLoading(false)       
    }
  }



  async function recuperarSenha(){

    try {
      const dadoDigitado = document.getElementById("esqueceuSenhaCampo").value
    //console.log("dadoDigitado", dadoDigitado)
      if( esqueceuSenha.tipoRecuperacao === 0 && !(dadoDigitado.includes("@") && dadoDigitado.includes(".")) ){
        //SEM PADRAO DE EMAIL
        alertStart("Informe um email válido.", "error")
        document.getElementById('esqueceuSenhaCampo').focus()                   
      }else if(esqueceuSenha.tipoRecuperacao === 2 && !(dadoDigitado.length >= 10 && dadoDigitado.length <= 11) ){
        //SEM PADRAO TELEFONE WHATSAPP
        alertStart("Seu telefone esta incompleto, verifique se você digitou o DDD e o digito 9!", "warning")
        document.getElementById('esqueceuSenhaCampo').focus()    
      }else{

        /*

          ENVIANDO CODIGO NOVA SENHA
          existe 3 tipos de recuperação de senha

          - 0 email
          - 1 sms
          - 2 whatsapp

        */
        setEsqueceuSenha({"abrir": false, "email": esqueceuSenha.email, "tipoEsqueceu": 0})
        setLoading(true)

        let data = {}

        if(esqueceuSenha.tipoRecuperacao == 0){
          data = {
            "appNome": aplicativoDados.appNome,
            "email": esqueceuSenha.email,
            "tipoVerificacao": esqueceuSenha.tipoRecuperacao,
            "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
          } 
        }else{
          data = {
            "appNome": aplicativoDados.appNome,
            "telefone": esqueceuSenha.email,
            "tipoVerificacao": esqueceuSenha.tipoRecuperacao,
            "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
          } 
        }
        
        const response = await RedefinirSenha(data, aplicativoDados)
    
        if(response.retornoErro){
          //algum erro
          alertStart(response.mensagem, "error")
        }else{ 
          //tudo certo
          alertStart(response.mensagem, "success")
        }
        setLoading(false)
      }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions recuperarSenha ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
    }
  }

  return (



    <Container component="main" maxWidth="xs">

      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={alert.status} autoHideDuration={6000} onClose={alertClose}>
        <Alert onClose={alertClose} severity={alert.tipo}>
          {alert.mesangem}
        </Alert>
      </Snackbar>


      <CssBaseline />
            
      


      <div className={classes.paper}>
           
        <img src={aplicativoDados.urlLogo} style={{"height": "150px"}} alt="" />
      
            <Typography component="h1" variant="h5" className="mt-3">
              {telaCodigo ? `Verifique o Código Enviado Por ${smsOrWhatsapp}` : "Conectar ao Usuário"}
            </Typography>

            {
              // INICIO LOGIN COMUM usuario e senha
              tipoLogin === 'usuarioSenha'
              &&  
              (<form className={classes.form, "container"} onSubmit={realizarLogin_UsuarioSenha}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                onChange={e => {
                  setUsuario((e.target.value).replace(/ /, ''))
                }}
                id="usuario"
                value={usuario}
                label="Email ou Telefone"
                name="usuario"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={senha}
                onChange={e => setSenha(e.target.value)}
                name="senha"
                label="Senha"
                type="password"
                id="senha"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Entrar
              </Button>

              {estabelecimentoAtual?.possuiPedidoMesa? <Button
                type="button"
                fullWidth
                onClick={() => {
                  history.push("conectar-mesa")
                }}
                variant="contained"
                style={{"margin": "0 0 1em 0", "background":"#3c3c3c", "color":"white"}}
              >
                <AirlineSeatReclineNormalIcon/>  Conectar na mesa
              </Button> : null} 

              <Button
                type="button"
                fullWidth
                onClick={() => {
                  setLoading(true)
                  window.location.href = `https://delivery.pedidosite.com.br/login/loginUnificado?urlLogo=${aplicativoDados.urlLogo}&urlDominio=${(aplicativoDados.urlAcesso).replace("www.",'')}&facebookApplicationId=&corFundo=${aplicativoDados.corSitePrimaria}&corSecundaria=${aplicativoDados.corSiteSecundaria}&imgFundo=null`
                }}
                variant="contained"
                style={{"margin": "0 0 1em 0", "background":"#3a5593", "color":"white"}}
              >
                <FacebookIcon/>  Entrar Com Facebook
              </Button>
              
              {
                aplicativoDados.permiteLoginTelefone 
                ? <Button
                    type="button"
                    fullWidth
                    onClick={() => {
                      setTipoLogin('apenasTelefone')
                    }}
                    variant="contained"
                    style={{"margin": "0 0 1em 0", "background":"#24cc63", "color":"white"}}
                  >
                    <WhatsAppIcon/>  Entrar Com Whatsapp
                  </Button>
                : null
              }
              
              
              <Grid container>
                <Grid item xs>
                  <Link to="#" onClick={((e) =>{
                    setEsqueceuSenha({"abrir": true, "email": '', "tipoRecuperacao": 0})
                  })} variant="body2" style={{"color":`${aplicativoDados.corSitePrimaria}`}}>
                    Esqueci senha
                  </Link>
                </Grid>
                <Grid item>
                  <Link to={`/cadastro${identificarEstabelecimentoSelecionado(aplicativoDados)}`} variant="body2" style={{"color":`${aplicativoDados.corSitePrimaria}`}}>
                    {"Cadastrar usuário"}
                  </Link>
                </Grid>
              </Grid>

              { ( aplicativoDados.inicioTelaLogin === false && aplicativoDados.estabelecimentos.length > 1) ?
                <Button
                  type="button"
                  fullWidth
                  style={{"color":`${aplicativoDados.corSitePrimaria}`}}
                  onClick={() => {
                    history.push(`/lojas`)
                  }}
                >
                  Ver Lojas
                </Button>
                : null
              }

              <Dialog
                  open={esqueceuSenha.abrir}
                  aria-labelledby="esqueceuSenha">
                  <DialogTitle id="esqueceuSenha">{"Esqueceu Sua Senha?"}</DialogTitle>


                  <DialogContent>

                    
                  <Select 
                      fullWidth
                      variant="outlined"
                      onChange={(e) => {setEsqueceuSenha({"abrir": true, "email": esqueceuSenha.email, "tipoRecuperacao": e.target.value})}}
                      defaultValue={esqueceuSenha.tipoRecuperacao} 
                      id="selectRecuperacao">
                    <MenuItem value={0}>{"Email"}</MenuItem>
                    <MenuItem value={2}>{"Whatsapp"}</MenuItem>
                  </Select>
                  
                    {
                      esqueceuSenha.tipoRecuperacao === 0 
                      ? 
                      (<TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={(e) =>{setEsqueceuSenha({"abrir": true, "email": e.target.value, "tipoRecuperacao": esqueceuSenha.tipoRecuperacao})}}
                        value={esqueceuSenha.email}
                        id="esqueceuSenhaCampo"
                        label="Email do usuário"
                        name="esqueceuSenhaCampo"
                        type="email"
                        autoFocus
                      />)
                      :
                      (<TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={(e) =>{setEsqueceuSenha({"abrir": true, "email": e.target.value, "tipoRecuperacao": esqueceuSenha.tipoRecuperacao})}}
                        value={esqueceuSenha.email}
                        id="esqueceuSenhaCampo"
                        label="Telefone do usuário"
                        name="esqueceuSenhaCampo"
                        type="number"
                        autoFocus
                      />)
                    }
                  </DialogContent>

                  <DialogActions>
                    
                    <Button onClick={(e) => {setEsqueceuSenha({"abrir": false, "email": '', "tipoRecuperacao": 0})}} style={{"color":"#dc3545"}}>
                      Cancelar
                    </Button>
                    <Button onClick={() => {recuperarSenha()}} style={{"color": "white", "backgroundColor":"#28a745"}}>
                      Recuperar Senha
                    </Button>
                  </DialogActions>
                </Dialog>
            </form>)
        }

        

        {     
          // INICIO LOGIN POR WHATSAPP
          tipoLogin === 'apenasTelefone' && !(usuariosMesmoTelefone.length > 0)  &&
          (       
            <form className={classes.form, "container"} onSubmit={realizarLogin_UsuarioTelefone}>              
              { 
                //DIGITA O TELEFONE
                !telaCodigo && 
                (<>
                  
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      onChange={e => setTelefone(e.target.value)}
                      id="telefone"
                      value={telefone}
                      label="Telefone"
                      name="telefone"
                      type="number"
                      autoFocus
                    />

                    


                    <Button
                      fullWidth
                      type="submit"
                      onClick={() => {setSmsOrWhatsapp('WHATSAPP')}}
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      style={{"background": "#28a745"}}
                    >
                      Whatsapp
                    </Button>


                    <Grid container>
                      <Grid item>
                        <Typography onClick={() => {
                          setTipoLogin('usuarioSenha')
                          }}  style={{"cursor": "pointer", "color":`${aplicativoDados.corSitePrimaria}`}}>
                          {"Outras Opções"}
                        </Typography>
                      </Grid>
                    </Grid>


                    {/* <Button
                      fullWidth
                      type="submit"
                      onClick={() => {setSmsOrWhatsapp('SMS')}}
                      variant="contained"
                      color="primary"
                      style={{"background": "#6c757d"}}
                    >
                      SMS
                    </Button> */}
                </>) 
              }   

              {
                //DIGITA O CÓDIGO
                telaCodigo
                &&
                (<><TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  onChange={e => {
                    if(e.target.value.length === 6){
                      verificarTokenLoginTelefone(e.target.value)
                    }

                  }}
                  id="CodigoVerificacao"
                  label="Codigo de Verificação"
                  name="CodigoVerificacao"
                  type="number"
                  autoFocus
                />
                <Grid container>
                  <Grid item xs>
                    <Link to='#' onClick={() => {setTelaCodigo(false)}} variant="body2" style={{"color":`${aplicativoDados.corSitePrimaria}`}}>
                      Editar telefone
                    </Link>
                  </Grid>
                </Grid>
                </>) 
              }     

              <Dialog
                open={CadastroTelefone}
                aria-labelledby="cadastrarLoginTelefone">
                <DialogTitle id="cadastrarLoginTelefone">{"Cadastrar Usuario"}</DialogTitle>


                <DialogContent>
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="nomeCadastroTelefone"
                      label="Nome"
                      name="nomeCadastroTelefone"
                      autoFocus
                    />
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      onChange={e => setTelefone(e.target.value)}
                      id="telefone"
                      value={telefone}
                      label="Telefone"
                      name="telefone"
                      type="number"
                    />

                </DialogContent>

                <DialogActions>
                  
                  <Button onClick={(e) => {setCadastroTelefone(false)}}>
                    Cancelar
                  </Button>
                  <Button onClick={cadastrarUsuarioLoginTelefone}>
                    Cadastrar
                  </Button>
                </DialogActions>
              </Dialog>     
            </form>  
            
          )           
        }
              
        {
          // FIM INICIO POR WHATSAPP
          usuariosMesmoTelefone.length > 0
          &&
          (<>
            {
              usuariosMesmoTelefone.map((usuario, index) => (              
                <Card key={usuario.id} className={classes.root}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      { 
                        asteriscosUsuarioLoginTelefone(usuario.nome)
                      }
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {asteriscosUsuarioLoginTelefone(usuario.email)}
                    </Typography>                 
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => {
                      setVerificarUsuario({"aberto": true, "usuario":index})
                      
                    }}>Este Usuário</Button>
                  </CardActions>
                </Card>
              ))
            }
            <Dialog
              open={verificarUsuario.aberto}
              aria-labelledby="verificarUsuario">
              <DialogTitle id="verificarUsuario">{"Verificar Usuario"}</DialogTitle>


              <DialogContent>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="verificarUsuarioDigitado"
                  label="Digite o nome do usuário"
                  name="verificarUsuarioDigitado"
                  type="text"
                  autoFocus
                />
              </DialogContent>

              <DialogActions>
                <Button onClick={(e) => {

                  const digitou = removeAcento(((document.getElementById("verificarUsuarioDigitado").value).replace(/ /, '')).toLocaleLowerCase())
                  const nomeCorreto = removeAcento(((usuariosMesmoTelefone[verificarUsuario.usuario].nome).replace(/ /, '')).toLocaleLowerCase())

                  if(digitou === nomeCorreto){
                    // acertou
                    realizarLogin_UsuarioSenha(e, usuariosMesmoTelefone[verificarUsuario.usuario].email, usuariosMesmoTelefone[verificarUsuario.usuario].hashSenha)
                    setVerificarUsuario({"aberto": false, "usuario":0})
                    setLoading(true)
                  }else{
                    //erro
                    alertStart(`Desculpe você digitou errado!`, "error") 
                    setVerificarUsuario({"aberto": false, "usuario":0})
                    setTelefone('')
                    setUsuariosMesmoTelefone({})
                  }
                  
                }} style={{"color": "white","backgroundColor":"#28a745"}}>
                  Verificar
                </Button>
              </DialogActions>
            </Dialog>
          </>)
        }         
      </div>
    </Container>


  );
}
