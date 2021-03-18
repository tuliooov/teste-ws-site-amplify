import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';
import Cabecalho from '../Global/cabecalho';
import CadastroEndereco from '../../components/cadastroEndereco';
import Rodape from '../Global/rodape';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import Skeleton from '@material-ui/lab/Skeleton';
import ReactPixel from 'react-facebook-pixel';
import * as Sentry from "@sentry/react"; 

import {identificarEstabelecimentoSelecionado, Post_ListarEstabelecimentosPorEndereco, CadastrarEnderecoCliente, ObterCardapio, ObterCardapioCompletoV1, ComumCep } from '../../services/functions';

import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';

import AlertFixo from '@material-ui/lab/Alert';

import api from '../../services/api';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Divider from '@material-ui/core/Divider';
import {fade, makeStyles, useTheme } from '@material-ui/core/styles';

import BackspaceIcon from '@material-ui/icons/Backspace';
import { Row, Col } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormControlLabel from '@material-ui/core/FormControlLabel';


import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
//alert
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import useMediaQuery from '@material-ui/core/useMediaQuery';


//import Loading from '../loading';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  // root: {
  //   maxWidth: 345,
  // },
  rootAlerts: {
    margin: "0 0 1em 0",
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 999,
    color: '#fff', 
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));


const verificarSeEntrega = (estabelecimento, lojas) => {
  for(var i = 0; i < lojas.length; i++){
    if(lojas[i].id == estabelecimento.id){
      if(lojas[i].taxaEntrega < 0){
        return false
      }else{
        return true
      }
    }
  }
  return false
}

const qtdFiltro = (estabelecimentos, tipo, retirada, endereco, exibirTodasLojas) => {
  if(retirada === true && (tipo != 1 && tipo != 2)){
    tipo = 5
  }

  if(tipo === 0 && endereco === true && exibirTodasLojas === false ){
    tipo = 7
  }
  
  if(tipo === 0 && exibirTodasLojas === false){
    tipo = 6
  }

  
  
  
  
  console.log(estabelecimentos, tipo, retirada, endereco, exibirTodasLojas)

  // 0 = Todos 
  // 1 = aberto
  // 2 = fechado
  // 3 = Entregam
  // 4 = nao entrega
  // 5 = retirada
  // 6 = nao exibir todas lojas 
  
  let num = 0

  if(estabelecimentos){
    if(tipo == 0){
      num = estabelecimentos.length
    }else if(tipo == 1 || tipo == 2 || tipo == 6 ){
      const estabelecimentos = document.getElementsByClassName("estabelecimento")
      console.log('estabelecimentosestabelecimentos', estabelecimentos)
      for(let i = 0; i < estabelecimentos.length; i++){
        if(estabelecimentos[i].style.display != "none"){
          num++
        }
      }
    }else{
      estabelecimentos.forEach(loja => {  
        if(tipo == 7 && loja.taxaEntrega >= 0){
          num++
        } else  
        if(tipo == 5 && loja.permiteRetiradaBalcao){
          num++
        }else if(tipo == 3 && (loja.taxaEntrega >= 0)){
          num++
        }else if(tipo == 4 && (loja.taxaEntrega == -1)){
          num++
        }
      })
    }
  }
  console.log('qtd', num)
  return num 
}

const quantoEntregam = (estabelecimentos, todos = true, retirada = false) => {
  console.log(estabelecimentos, todos, retirada)
  let num = 0
  if(estabelecimentos){
    estabelecimentos.forEach(loja => {     
      if(!retirada && todos == true){
        num++
      }else if(!retirada && loja.taxaEntrega >= 0 && todos == false){
        num++
      }else if(loja.permiteRetiradaBalcao && retirada){
        num++
      }
    })
  }
  console.log('quantoEntregam', num)
  return num 
}

function removeAcento (text){       
  text = text.toLowerCase();                                                         
  text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
  text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
  text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
  text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
  text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
  text = text.replace(new RegExp('[Ç]','gi'), 'c');
  return text;                 
}

const procurarEstabelecimento = (e) => {
  const valorPesqusa = removeAcento(e.target.value.toLocaleLowerCase())
  const estabelecimentos = document.getElementsByClassName("estabelecimento")

  for(let j = 0; j < estabelecimentos.length; j++){
    const nome = removeAcento(estabelecimentos[j].getElementsByClassName("nomeLoja")[0].innerHTML.toLocaleLowerCase()).includes(valorPesqusa)
    const descricao = removeAcento(estabelecimentos[j].getElementsByClassName("descricaoLoja")[0].innerHTML.toLocaleLowerCase()).includes(valorPesqusa) 
    if(nome || descricao){
      estabelecimentos[j].style.display = ""
    }else{
      estabelecimentos[j].style.display = "none"
    }
  }
}

const possuiOpcao = (array, string) => {
  for(var i = 0; i < array.length; i++){
    if(array[i] === string){
      return true
    }
  }
  return false
}


export default function Estabelecimentos() {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  
  const [confirmarTipoEntrega, setConfirmarTipoEntrega] = useState(false);
  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"))  
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const SkeletonQtd = [0,1,2,3,4,5]
  const [verTodasAsLojas, setVerTodasAsLojas] = useState(false);
  const [temAlgum, setTemAlgum] = useState(true);
  const [enderecoAtual, setEnderecoAtual] = useState(JSON.parse(localStorage.getItem("enderecoAtualCF")));

  let estabelecimentosCepDeslogadoCF = []
  try {
    estabelecimentosCepDeslogadoCF = JSON.parse(localStorage.getItem('estabelecimentosCepDeslogadoCF'))
  } catch (error) {
    
  }
  // const [estabelecimentos, setEstabelecimentos] = useState(enderecoAtual?.bairro ? ( (usuarioLogado?.logado || (!localStorage.getItem('estabelecimentosCepDeslogadoCF') || localStorage.getItem('estabelecimentosCepDeslogadoCF') == "undefined"))  ? aplicativoDados.estabelecimentos : JSON.parse(localStorage.getItem('estabelecimentosCepDeslogadoCF'))) : (aplicativoDados.estabelecimentos.length > 0 ? aplicativoDados.estabelecimentos : []));
  const [estabelecimentos, setEstabelecimentos] = useState(

    ((enderecoAtual?.bairro && estabelecimentosCepDeslogadoCF?.length === 0)
    ? estabelecimentosCepDeslogadoCF
    : (aplicativoDados?.estabelecimentos?.length > 0 
        ? aplicativoDados.estabelecimentos 
        : [])).filter((e) => e.visivel === true)

  );
  
  const [abrirAdicionarEndereco, setAbrirAdicionarEndereco] = useState(false);
  const [estabelecimentoDesejado, setEstabelecimentoDesejado] = useState({});

  const [confirmarDesejo, setConfirmarDesejo] = useState(false);
  const [retirarNoLocal, setRetirarNoLocal] = React.useState(enderecoAtual?.id == "retirada" ? true : false);
  
  const [popUpCep, setPopUpCep] = React.useState(false);
  const [filtroSelect, setFiltroSelect] = React.useState(0);
  const [quantosEntregam, setQuantosEntregam] = React.useState(0);

  useEffect(() => {
    setQuantosEntregam(qtdFiltro(estabelecimentos, filtroSelect, !!retirarNoLocal, !!enderecoAtual?.logradouro, (aplicativoDados?.exibirTodasUnidadesNoDelivery || verTodasAsLojas) ? true : false));
  }, [retirarNoLocal, estabelecimentos, filtroSelect, enderecoAtual, verTodasAsLojas])

  useEffect(() => {

    if(aplicativoDados.pixelFacebook){
          ReactPixel.track('Search')
    }

    if(retirarNoLocal){
      filtroTipoRetirada(true)
    }else if(enderecoAtual?.bairro){
      listarEstabelecimentosPorEndereco(enderecoAtual)
    }
    

    // const interval = setInterval(() => {
    //     //console.log("procurando atualizações ")
    //     if(!aplicativoDados.clienteFielStart){
    //       verificarAberto()
    //       buscarUltimoPedido()  
    //     }
    //     // if(new Date() - new Date(localStorage.getItem('dateCardapioCF')) > 300000){
    //     //   verificarCardapio(estabelecimentoAtual)
    //     // }
    // }, 10000);
    // return () => clearInterval(interval);
  }, []);


  const allBanners = () => {
    var array = []
    for(let i = 0; i < aplicativoDados?.estabelecimentos?.length; i++){
        if(aplicativoDados.estabelecimentos[i].banners){
          for(let j = 0; j < aplicativoDados.estabelecimentos[i].banners.length; j++){
            array.push({"url": aplicativoDados.estabelecimentos[i].banners[j], "id": aplicativoDados.estabelecimentos[i].id})
          }
        }
    }
    return array;
  }


  const [todosBanners, setTodosBanners] = React.useState(allBanners());
  // console.log('todosBanners', todosBanners)
  
  const [loading, setLoading] = React.useState(false);
  const [loadingLogadoEnderecos, setLoadingLogadoEnderecos] = React.useState((enderecoAtual?.bairro) ? true : false);

 
  
  //console.log("aplicativoDados", aplicativoDados)
  //console.log("estabelecimentos", estabelecimentos)
  


  

  const buscarCardapioId = (id) => {
    aplicativoDados.estabelecimentos.forEach(estabelecimento => {
      if(estabelecimento.id == id){
        buscarCardapio(estabelecimento)
        return true
      }
    });
  }

  const clicarEmPedir = (estabelecimento) => {
    setEstabelecimentoDesejado(estabelecimento)
    if(!estabelecimento.online){
      setConfirmarDesejo(true)
    }else if( !(retirarNoLocal || enderecoAtual?.logradouro) ){
      if(estabelecimento.permiteRetiradaBalcao){
        setConfirmarTipoEntrega(true);
      }else{
        selecionarTipoEntrega(estabelecimento);
      }
    }else if(retirarNoLocal){
        selecionarTipoRetirada(estabelecimento);
    }else if( enderecoAtual?.logradouro ){
      selecionarTipoEntrega(estabelecimento);
      // setConfirmarDesejo(true);
    }
  }
  
  const selecionarTipoRetirada = (estabelecimento) =>{
    setEnderecoAtual({"id":"retirada"})
    localStorage.setItem("enderecoAtualCF", JSON.stringify({"id":"retirada"}))
    buscarCardapio(estabelecimento)
  }
  
  const selecionarTipoEntrega = (estabelecimento) =>{
    buscarCardapio(estabelecimento)
  }


  const buscarCardapioDelivery = async (estabelecimento) => {

    const enderecoAtual = JSON.parse(localStorage.getItem('enderecoAtualCF'))
    if(estabelecimento.possuiDelivery == false && estabelecimento.possuiEntrega == false){
      alertStart("Esse estabelecimento não faz delivery!", "warning")
    }else if( estabelecimento.taxaEntrega < 0){
      setEstabelecimentoDesejado(estabelecimento)
      setConfirmarDesejo(true)
      // alertStart("Esse estabelecimento não entrega no seu endereço!", "warning")
    }else if(estabelecimento.online == false){
      setEstabelecimentoDesejado(estabelecimento)
      setConfirmarDesejo(true)
      // alertStart("Esse estabelecimento não esta aberto no momento!", "warning")
    }else if(!enderecoAtual?.logradouro){
      // alertStart("Cadastre seu endereço!", "warning")
      setEstabelecimentoDesejado(estabelecimento)
      setAbrirAdicionarEndereco(true)
      setPopUpCep(true)
    }else if(enderecoAtual?.logradouro){
      buscarCardapio(estabelecimento)
    }
  }

  const buscarCardapioRetirada = (estabelecimento) => {
    if(estabelecimento.online == false){
      setEstabelecimentoDesejado(estabelecimento)
      setConfirmarDesejo(true)
      // alertStart("Esse estabelecimento não esta aberto no momento!", "warning")
    }else{
      setEnderecoAtual({"id":"retirada"})
      localStorage.setItem("enderecoAtualCF", JSON.stringify({"id":"retirada"}))
      buscarCardapio(estabelecimento)
    }
  }
  
  const buscarCardapio = async (estabelecimento) => {  
    try {
      localStorage.removeItem('estabelecimentosCepDeslogadoCF')  
      console.log('buscar cardapio> ', estabelecimento)
      estabelecimento.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`       

      setLoading(true)
      localStorage.setItem('estabelecimentoAtualCF', JSON.stringify(estabelecimento));

      

      if(usuarioLogado?.logado){
        const enderecoAtual = JSON.parse(localStorage.getItem('enderecoAtualCF'))
        let data = {
          "idCliente": usuarioLogado.cliente.id,
          "idEstabelecimento": estabelecimento.id,
          "idEndereco": enderecoAtual.id ? (enderecoAtual.id != 'retirada' ? enderecoAtual.id : null) : null,
          "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
        } 

        const response = await ObterCardapioCompletoV1(data, aplicativoDados)
        
        console.log("ObterCardapioCompletoV1", response)
        if(response.retornoErro){
          alertStart(response.mensagem, "error")
          setLoading(false)
        }else{
          const retorno = response
          console.log("ObterCardapioCompletoV1", retorno)  


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

          if(enderecoAtual?.id == "retirada"){
            carrinhoRetorno.pedido.entregaAgendada = "Retirar(Buscar) no local"
          }
    
          localStorage.setItem("carrinhoCF", JSON.stringify(carrinhoRetorno)) 

          
          localStorage.setItem("cardapioCF", JSON.stringify(retorno))   

          // if(!localStorage.getItem("enderecoAtualCF") || enderecoAtual?.id == "retirada"){
          if(!localStorage.getItem("enderecoAtualCF")){
            localStorage.setItem("enderecoAtualCF", JSON.stringify({})) 
          }else if(enderecoAtual?.id == "retirada"){
            localStorage.setItem("enderecoAtualCF", JSON.stringify({
              id: "retirada"
            })) 
          } else if(retorno.enderecos != null && retorno.enderecos?.length > 0 && enderecoAtual?.id != "retirada"){
            localStorage.setItem("enderecoAtualCF", JSON.stringify(retorno.enderecos[0]))  
          }
    
          history.push(`/delivery${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
        }

      }else{

        const response = await ObterCardapio(estabelecimento, aplicativoDados)
        
        console.log("ObterCardapio", response)
        if(response.retornoErro){
          alertStart(response.mensagem, "error")
          setLoading(false)
        }else{
          const retorno = response
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

          if(!localStorage.getItem("enderecoAtualCF")){
            localStorage.setItem("enderecoAtualCF", JSON.stringify({})) 
          }else if(retorno.enderecos != null && retorno.enderecos?.length > 0 && enderecoAtual?.id != "retirada"){
            localStorage.setItem("enderecoAtualCF", JSON.stringify(retorno.enderecos[0]))  
          }

          localStorage.setItem("usuarioCF", JSON.stringify({}))    
    
          history.push(`/delivery${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
        }
      }
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions buscarCardapio - ${aplicativoDados.appNome} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
    }
  }

  
    //alerts    
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

    const filtroTipo = (e) =>{
      e.preventDefault()
      setFiltroSelect(e.target.value)
      const numero = e.target.value

      // 0 = Todos 
      // 1 = Abertos
      // 2 = Fechados

      const estabelecimentos = document.getElementsByClassName("estabelecimento")
      var valorPesqusa = ""
      switch (numero) {
        case 0:
          valorPesqusa = ""
          break;
        case 1:
          valorPesqusa = "aberto-Estabelecimentos"
          break;
        case 2:
          valorPesqusa = "fechado-Estabelecimentos"
          break;
      
      }
      var qtd = 0
      //console.log('valor', valorPesqusa)
      //console.log('estabelecimentos', estabelecimentos)
      for(let j = 0; j < estabelecimentos.length; j++){
        const filtro = (estabelecimentos[j].classList.value).includes(valorPesqusa)
        if(filtro){
          estabelecimentos[j].style.display = ""
          qtd++
        }else{
          estabelecimentos[j].style.display = "none"
        }
      }

      if(qtd > 0){
        setTemAlgum(true)
      }else{
        setTemAlgum(false)
      }
    }


    const filtroTipoRetirada = async (retiradaSim) => {
      console.log('filtroTipoRetirada', retirarNoLocal, retiradaSim)
      document.getElementById("cepDigitando").value = ""
      var retirada = true
      if(!retiradaSim){
        retirada = !retirarNoLocal
        setRetirarNoLocal(retirada)
        setVerTodasAsLojas(false)
      }
      if(retirada){
        setEnderecoAtual({"id":"retirada"})
        localStorage.setItem("enderecoAtualCF", JSON.stringify({"id":"retirada"}))
        setEstabelecimentos(aplicativoDados.estabelecimentos)
      }else{
        setEnderecoAtual({})
        localStorage.setItem("enderecoAtualCF", JSON.stringify({}))
      }

      const estabelecimentos = document.getElementsByClassName("naoPermiteRetirada")
      for(let j = 0; j < estabelecimentos.length; j++){
        if(retirada == true){
          estabelecimentos[j].style.display = "none"
        }else{
          estabelecimentos[j].style.display = ""
        }
      }
      var qtd = document.getElementsByClassName("permiteRetirada").length;
      if(qtd > 0){
        setTemAlgum(true)
      }else{
        setTemAlgum(false)
      }
      // setQtdDisponivel(qtd)
    }
    
    const filtroTipoEndereco = (e) =>{
      e.preventDefault()
      setFiltroSelect(e.target.value)
      const numero = e.target.value

      // 0 = Todos 
      // 1 = aberto
      // 2 = fechado
      // 3 = Entregam
      // 4 = nao entrega

      const estabelecimentos = document.getElementsByClassName("estabelecimento")
      var valorPesqusa = ""
      switch (numero) {
        case 0:
          valorPesqusa = ""
          break;
        case 3:
          valorPesqusa = "entregaEndereco-Estabelecimentos"
          break;
        case 4:
          valorPesqusa = "naoEntregaEndereco-Estabelecimentos"
          break;
        case 1:
          valorPesqusa = "aberto-Estabelecimentos"
          break;
        case 2:
          valorPesqusa = "fechado-Estabelecimentos"
          break;
      
      }

      var qtd = 0
      //console.log('valor', valorPesqusa)
      //console.log('estabelecimentos', estabelecimentos)
      for(let j = 0; j < estabelecimentos.length; j++){
        const filtro = (estabelecimentos[j].classList.value).includes(valorPesqusa)
        if(filtro){
          estabelecimentos[j].style.display = ""
          qtd++
        }else{
          estabelecimentos[j].style.display = "none"
        }
      }

      if(qtd > 0){
        setTemAlgum(true)
      }else{
        setTemAlgum(false)
      }

    } 
    
    

  

    const listarEstabelecimentosPorEndereco = async (data ) => {
      try {
        data.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`  
        data.appNome = aplicativoDados.appNome

        const retorno = await Post_ListarEstabelecimentosPorEndereco(data, aplicativoDados)
      
        if(retorno.retornoErro){
          alertStart(retorno.mensagem, "error") 
          setLoading(false)
        }else{
          localStorage.setItem('estabelecimentosCepDeslogadoCF', JSON.stringify(retorno))
          setEstabelecimentos(retorno)
          setEnderecoAtual(data)
          
          if(estabelecimentoDesejado?.id && !verificarSeEntrega(estabelecimentoDesejado, retorno)){
            setConfirmarDesejo(true)
            setLoading(false)
          }else if(estabelecimentoDesejado?.id){
            buscarCardapio(estabelecimentoDesejado)
            setEstabelecimentoDesejado({})
          }else{
            setLoading(false)
          }
          if(retorno.mensagem){
            alertStart(retorno.mensagem, "success")
            setLoading(false)
          } 
        }
        
        
        setAbrirAdicionarEndereco(false)

        if(!!document.getElementById("cepDigitando")){
          document.getElementById("cepDigitando").value = ''
          document.getElementById("cepDigitando").blur()
        }
        

      } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions ListarEstabelecimentosPorEndereco - ${aplicativoDados.appNome} - ${error}`);
        alertStart("Procure os desenvolvedores!. Erro: "+error.message, "error")    
      }

      setLoadingLogadoEnderecos(false)
    }
    
  return (
    <>
    <Cabecalho nomeEstabelecimentoLojas={true}/>
    <Rodape valor="Estabelecimento"/>
      <Snackbar open={alert.status} autoHideDuration={6000} onClose={alertClose}>
          <Alert onClose={alertClose} severity={alert.tipo}>
          {alert.mesangem}
          </Alert>
      </Snackbar>

      

      
      <Dialog
        open={confirmarTipoEntrega}
        onClose={() => { setConfirmarTipoEntrega(false) }}
        aria-labelledby="tiposDeEntrega">
        {/* <DialogTitle id="confirmarDesejo">{"Estabelecimento Desejado"}</DialogTitle> */}
        <DialogContent>
          <Row>    
            <Col xs={12} md={12} lg={12} style={{"marginTop": "1em", "marginBottom": "1em",}}>
              <Typography gutterBottom variant="h6" style={{"fontWeight": "100"}}>
                  Selecione a forma de entrega do pedido desejada
              </Typography>
            </Col>
            
            <Col xs={6} md={6} lg={6} style={{"margin": "0.5em 0"}}>
              <Button size="small"  className={"botaoVerde"} onClick={() => {
                  selecionarTipoRetirada(estabelecimentoDesejado);
              }} >
                Retirada
              </Button>
            </Col>

            <Col xs={6} md={6} lg={6} style={{"margin": "0.5em 0"}}>
              <Button size="small" className={"botaoVerde"} onClick={() => {
                  selecionarTipoEntrega(estabelecimentoDesejado) }}>
                Entrega
              </Button>
            </Col>

          </Row>
        </DialogContent>

      </Dialog>


      <Dialog
        open={confirmarDesejo}
        onClose={() => { setConfirmarDesejo(false) }}
        aria-labelledby="confirmarDesejo">
        {/* <DialogTitle id="confirmarDesejo">{"Estabelecimento Desejado"}</DialogTitle> */}
        <DialogContent>
          <Row>    
            <Col xs={12} md={12} lg={12} style={{"marginTop": "1em"}}>
              <Typography gutterBottom variant="h6" style={{"fontWeight": "100"}}>
                {
                  estabelecimentoDesejado.online == false
                  ?  <React.Fragment>
                      <Typography>
                        O estabelecimento
                        <span style={{"fontWeight": "500"}}> {estabelecimentoDesejado?.nome} </span>
                        não está aberto no momento, você deseja ver o cardápio mesmo assim?
                      </Typography>
                    </React.Fragment>
                  : <React.Fragment>
                      <Typography>
                        O estabelecimento
                        <span style={{"fontWeight": "500"}}> {estabelecimentoDesejado?.nome} </span>
                        não entrega no seu endereço  
                        <span style={{"fontWeight": "500"}}> {enderecoAtual?.logradouro} - {enderecoAtual?.numero}</span>
                        , você deseja ver o cardápio mesmo assim?
                      </Typography>
                    </React.Fragment>
                }
                  
              </Typography>
            </Col>
            
            <Col xs={12} md={6} lg={6} style={{"margin": "0.5em 0"}}>
              <Button size="small"  className={"botaoVermelho"}  onClick={() => {
                
                setConfirmarDesejo(false)
                setTimeout(() => {
                  setEstabelecimentoDesejado({})
                }, 500);
              }}>
                Outro Estabelecimento
              </Button>
            </Col>

            <Col xs={12} md={6} lg={6} style={{"margin": "0.5em 0"}}>
              <Button size="small" className={"botaoVerde"} onClick={() => {
                  buscarCardapio(estabelecimentoDesejado)
                  setConfirmarDesejo(false)
                  setTimeout(() => {
                    setEstabelecimentoDesejado({})
                  }, 500);
                }}>
                Ver Cardápio
              </Button>
            </Col>

          </Row>
        </DialogContent>

      </Dialog>
      
      <Dialog
        open={confirmarDesejo}
        aria-labelledby="confirmarDesejo">
        {/* <DialogTitle id="confirmarDesejo">{"Estabelecimento Desejado"}</DialogTitle> */}
        <DialogContent>
          <Row>    
            <Col xs={12} md={12} lg={12} style={{"marginTop": "1em"}}>
              <Typography gutterBottom variant="h6" style={{"fontWeight": "100"}}>
                {
                  estabelecimentoDesejado.online == false
                  ?  <React.Fragment>
                      O estabelecimento
                      <span style={{"fontWeight": "500"}}> {estabelecimentoDesejado?.nome} </span>
                      não está aberto no momento, você deseja ver o cardápio mesmo assim?`
                    </React.Fragment>
                  : <React.Fragment>
                      O estabelecimento
                      <span style={{"fontWeight": "500"}}> {estabelecimentoDesejado?.nome} </span>
                      não entrega no seu endereço  
                      <span style={{"fontWeight": "500"}}> {enderecoAtual?.logradouro} - {enderecoAtual?.numero}</span>
                      , você deseja ver o cardápio mesmo assim?`
                    </React.Fragment>
                }
                  
              </Typography>
            </Col>
            
            <Col xs={12} md={6} lg={6} style={{"margin": "0.5em 0"}}>
              <Button size="small"  className={"botaoVermelho"}  onClick={() => {
                
                setConfirmarDesejo(false)
                setTimeout(() => {
                  setEstabelecimentoDesejado({})
                }, 500);
              }}>
                Outro Estabelecimento
              </Button>
            </Col>

            <Col xs={12} md={6} lg={6} style={{"margin": "0.5em 0"}}>
              <Button size="small" className={"botaoVerde"} onClick={() => {
                  buscarCardapio(estabelecimentoDesejado)
                  setConfirmarDesejo(false)
                  setTimeout(() => {
                    setEstabelecimentoDesejado({})
                  }, 500);
                }}>
                Ver Cardápio
              </Button>
            </Col>

            {
              estabelecimentoDesejado.online
              ? <Col xs={12} md={12} lg={12} style={{"margin": "0.5em 0"}}>
                  <Button size="small" className={"botaoCinza"} onClick={() => {
                      setRetirarNoLocal(true)
                      setEnderecoAtual({"id":"retirada"})
                      localStorage.setItem("enderecoAtualCF", JSON.stringify({"id":"retirada"}))
                      buscarCardapio(estabelecimentoDesejado)
                      
                      setConfirmarDesejo(false)
                      setTimeout(() => {
                        setEstabelecimentoDesejado({})
                      }, 500);
                    }}>
                    Retirar no Local
                  </Button>
                </Col>
            : null
            }
            

          </Row>
        </DialogContent>

      </Dialog>


      <div className="container container-Estabelecimentos-deslogado">
          {
            todosBanners.length > 0
            ? <Row>
                <AppBar position="static" color="default" id="todosBanners" style={{"margin":"1em 0","backgroundColor": "#f8f8f8", "zIndex":"1", "box-shadow":"none"}}>
                  <Tabs
                    // value={0}
                    // onChange={mudarCategoria}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                      {
                        (todosBanners.map((banner, index) => (
                          <img className={"bannerLojas"} style={{"cursor":"pointer"}} src={banner.url} key={index} onClick={() =>{
                            buscarCardapioId(banner.id)   
                          }}/>    
                        )))
                      }
                  </Tabs>
              </AppBar>
              </Row>
            : null
          }


          

          <Row>
            {
              (!todosBanners.length && aplicativoDados)
              ? <Col xs={12} md={12} lg={12} className="bannerAppLogo" style={{"marginBottom": "1em", "backgroundImage": `url("${aplicativoDados?.urlFundoSite}")`}}>
                  {/* <img src={aplicativoDados.urlLogo}/> */}
                  <img src={aplicativoDados?.urlLogo} className={"logoNoBanner"}/>
                </Col>
              : null
            }
          </Row>

          <CadastroEndereco 
            telaDeEstabelecimentos={true}
            // retornoCep={retornoCep}
            setLoading={setLoading}
            alertStart={alertStart}
            aplicativoDados={aplicativoDados}
            usuarioLogado={usuarioLogado}
            
            abrirAdicionarEndereco={abrirAdicionarEndereco} setAbrirAdicionarEndereco={setAbrirAdicionarEndereco}
            enderecoAtual={enderecoAtual} setEnderecoAtual={setEnderecoAtual}
            popUpCep={popUpCep} setPopUpCep={setPopUpCep}
            
            retirarNoLocal={retirarNoLocal} filtroTipoRetirada={filtroTipoRetirada}
            
            setVerTodasAsLojas={setVerTodasAsLojas}
            
            listarEstabelecimentosPorEndereco={listarEstabelecimentosPorEndereco}
            buscarCardapio={buscarCardapio}
            estabelecimentoDesejado={estabelecimentoDesejado}
          />
         
        <Row>
            
         
          
          {/* <Col xs={12} md={12} lg={12} >
            <Typography gutterBottom variant="h6" >
              Selecione o estabelecimento
            </Typography>
          </Col> */}
          
          

         
        {
          ( loadingLogadoEnderecos == false && (verTodasAsLojas || aplicativoDados?.exibirTodasUnidadesNoDelivery || enderecoAtual?.bairro || retirarNoLocal)) 
          ? <React.Fragment>
              {enderecoAtual?.bairro
                ?  <Col xs={12} md={12} lg={6} style={{ "alignSelf": "center"}}> 
                      <Typography gutterBottom variant="h6" >
                        {quantosEntregam == 0 
                        ? null //' Nenhum entrega no seu endereço' 
                        : quantosEntregam == 1
                          ? quantosEntregam + ' Estabelecimento'
                          : quantosEntregam + ' Estabelecimentos'}
                      </Typography> 
                  </Col>
                :  <Col xs={12} md={12} lg={(enderecoAtual?.logradouro  || retirarNoLocal) ? 6 : 12} >   
                    <Typography gutterBottom variant="h6" style={{ "alignSelf": "center"}}>
                      {quantosEntregam} {quantosEntregam > 1 ? "Estabelecimentos encontradas" : "Estabelecimento encontrada"} 
                    </Typography> 
                  </Col>}

                {enderecoAtual?.logradouro 
                  ?  <Col xs={12} md={12} lg={6} >
                      <AlertFixo icon={<PersonPinCircleIcon/>} severity="success">
                        {`${enderecoAtual.logradouro} - ${enderecoAtual.numero}`} 
                        
                        <BackspaceIcon onClick={() => { 
                          
                          localStorage.removeItem('estabelecimentosCepDeslogadoCF')
                          localStorage.removeItem('enderecoAtualCF')
                          setEstabelecimentos(aplicativoDados.estabelecimentos)
                          setEnderecoAtual(null)
                          setFiltroSelect(0)

                        }} style={{"position": "absolute", "right": "1em", "top": "0.5em", "cursor": "pointer"}}/>
                      </AlertFixo>  
                    </Col>
                  : null}

                  {retirarNoLocal
                    ?  <Col xs={12} md={12} lg={6} >
                        <AlertFixo icon={<TransferWithinAStationIcon/>}  severity="success">
                          {`Filtro por retirada no local`} 
                          
                          <BackspaceIcon onClick={() => { 
                            filtroTipoRetirada(false)
                            
                          }} style={{"position": "absolute", "right": "1em", "top": "0.5em", "cursor": "pointer"}}/>
                        </AlertFixo>  
                      </Col>
                    : null
                  }
                  
                  {
                    // !(verTodasAsLojas || (quantosEntregam != 0 && temAlgum ) || (quantosEntregam != 0 && retirarNoLocal ) || loadingLogadoEnderecos)
                    loadingLogadoEnderecos
                    ? null
                    : <React.Fragment>
                        <Col xs={6} md={8} lg={8} style={{"marginTop": "1em"}}>
                          <TextField
                            fullWidth
                            label="Procurar..."
                            onChange={procurarEstabelecimento}
                            variant="outlined"
                          />
                        </Col>
                        <Col xs={6} md={4} lg={4} style={{"marginTop": "1em" /* , "textAlign": "right" */}}>
                          
                              {
                                enderecoAtual?.logradouro 
                                ? <FormControl variant="outlined" style={{"width": "100%"}}>
                                <InputLabel id="demo-simple-select-outlined-label">Filtro</InputLabel>
                                <Select
                                  labelId="demo-simple-select-outlined-label"
                                  id="demo-simple-select-outlined"
                                  value={filtroSelect}
                                  onChange={filtroTipoEndereco}
                                  label="Filtro"
                                > 
                                  <MenuItem key={0} value={0}>{"Todos"}</MenuItem>
                                  <MenuItem key={1} value={1}>{"Aberto"}</MenuItem>
                                  <MenuItem key={2} value={2}>{"Fechado"}</MenuItem>
                                  <MenuItem key={3} value={3}>{"Entrega"}</MenuItem>
                                  {
                                    ( aplicativoDados?.exibirTodasUnidadesNoDelivery || verTodasAsLojas)
                                    ? <MenuItem key={4} value={4}>{"Não Entrega"}</MenuItem>
                                    : null
                                  }
                                  
                                </Select>
                              </FormControl>
                                :<FormControl variant="outlined" style={{"width": "100%"}}>
                                <InputLabel id="demo-simple-select-outlined-label">Filtro</InputLabel>
                                <Select
                                  labelId="demo-simple-select-outlined-label"
                                  id="demo-simple-select-outlined"
                                  value={filtroSelect}
                                  onChange={filtroTipo}
                                  label="Filtro"
                                > 
                                  <MenuItem key={0} value={0}>{"Todos"}</MenuItem>
                                  <MenuItem key={1} value={1}>{"Abertos"}</MenuItem>
                                  <MenuItem key={2} value={2}>{"Fechados"}</MenuItem>
                                </Select>
                              </FormControl>
                              }
                        </Col>
                      </React.Fragment>
                  }
                  
          {/* <Skeleton variant="circle" width={40} height={40} /> */}

          
          
                {
                  estabelecimentos.map( (estabelecimento, index) => (
                    estabelecimento.visivel && 
                    <React.Fragment key={index}>
                      {
                        ( verTodasAsLojas || (aplicativoDados?.exibirTodasUnidadesNoDelivery && !retirarNoLocal) || ((enderecoAtual?.bairro && (estabelecimento.taxaEntrega >= 0 ) || (!enderecoAtual?.bairro && retirarNoLocal && ( /*estabelecimento.possuiDelivery || estabelecimento.possuiEntrega || */ estabelecimento.permiteRetiradaBalcao)))))
                        ? <Col xs={12} md={6} lg={4} key={index} style={{"margin": "1em 0"}}  className={"estabelecimento " 
                              + (estabelecimento.online ? "aberto-Estabelecimentos" : "fechado-Estabelecimentos ") 
                              + (estabelecimento.permiteRetiradaBalcao ? " permiteRetirada " : " naoPermiteRetirada ") 
                              + " estabelecimento-Estabelecimentos" 
                              + (enderecoAtual?.bairro && ((estabelecimento.taxaEntrega >= 0 && estabelecimento.taxaEntrega != null) ? " entregaEndereco-Estabelecimentos" : " naoEntregaEndereco-Estabelecimentos"))}>
                              
                              <Card className={classes.root} style={{"height": "100%"}}>
                                <CardActionArea  style={{ "height": "calc(100% - 30px)", "flexFlow": "column-reverse", "alignItems": "normal"}} onClick={() =>{
                                  clicarEmPedir(estabelecimento)
                                }}>
                                  {/* <CardContent style={{"position":"absolute", "top": "0"}} className={estabelecimento.online &&  estabelecimento.taxaEntrega>=0 ? "disponivel" : "indisponivel"}>
                                    <Typography className={"StatusEstabelecimento"} variant="body2"  component="p">
                                      {estabelecimento.online ? "Aberto" : "Fechado"}
                                      {(enderecoAtual?.bairro) && (estabelecimento.taxaEntrega >= 0 && estabelecimento.taxaEntrega != null ? " - Entrega" : " - Não Entrega")}
                                    </Typography>
                                  </CardContent> */}
                                  <Row style={{"textAlign": "center", "width": "100%", "padding": "1em", "alignItems": "center"}}>
                                    <Col xs={5} md={6} lg={6}>
                                      <CardMedia
                                        component="img"
                                        className={"logoLojas"}
                                        alt={estabelecimento.nome}
                                        image={estabelecimento.urlLogo}
                                        title={estabelecimento.nome}
                                      />
                                    </Col>
                                    <Col xs={7} md={6} lg={6}>
                                      <Typography className={"StatusEstabelecimento"} variant="body2"  component="p">
                                        {estabelecimento.online ? <><CheckCircleIcon style={{"fontSize": "initial", "color":"#28a745"}}/> Aberto</> : <><CancelIcon style={{"fontSize": "initial"}}/> Fechado</>}
                                        {/* {(enderecoAtual?.bairro) && (estabelecimento.taxaEntrega >= 0 && estabelecimento.taxaEntrega != null ? " - Entrega" : " - Não Entrega")} */}
                                      </Typography>
                                      
                                      <Typography gutterBottom  component="h2" className={"nomeLoja"}>                    
                                        {estabelecimento.nomeAlternativo ? estabelecimento.nomeAlternativo : estabelecimento.nome}
                                      </Typography>
                                      <Typography variant="body2" color="textSecondary" component="p" className={"descricaoLoja"}>
                                        {estabelecimento.endereco}
                                      </Typography>
                                      <Typography variant="body2" color="textSecondary" component="p">
                                        {estabelecimento.tempoEntregaTexto}
                                      </Typography>
                                      {
                                        enderecoAtual?.logradouro && 
                                          <Typography variant="body2" color="textSecondary" component="p" className={estabelecimento.taxaEntrega >= 0 ? 'entrega' : 'naoEntrega'}>
                                          {/* se colocar cep, mostrar quais entregam */}
                                            {
                                              estabelecimento.taxaEntrega >= 0
                                                ? 'Entrega'
                                                : 'Não entrega'
                                            }
                                          </Typography>
                                      }
                                      {
                                        enderecoAtual?.id == "retirada" &&
                                        <Typography variant="body2" color="textSecondary" component="p" className={estabelecimento.permiteRetiradaBalcao ? 'entrega' : 'naoEntrega'}>
                                          {/* se colocar cep, mostrar quais entregam */}
                                            {
                                              estabelecimento.permiteRetiradaBalcao
                                                ? 'Permite retirada'
                                                : 'Não permite retirada'
                                            }
                                          </Typography>
                                      }
                                    </Col>
                                  
                                  </Row>
                                  
                                  <CardContent style={{"padding": "0 16px"}}>
                                  </CardContent>
                                </CardActionArea>
                                <CardActions style={{"padding":"0"}}>
              
                                  
                                  {/* {
                                    (estabelecimento.possuiDelivery || estabelecimento.possuiEntrega)
                                    ? ( estabelecimento.taxaEntrega < 0 || !estabelecimento.online || !enderecoAtual?.logradouro
                                        ? (<Button size="small" className={"botaoCinza naoArredondado"} onClick={() => {buscarCardapioDelivery(estabelecimento)}}>
                                            Entrega 
                                          </Button>)
                                        : <Button size="small" className={"botaoVerde naoArredondado"} onClick={() => {buscarCardapioDelivery(estabelecimento)}}>
                                            Entrega {estabelecimento.taxaEntrega >=0 ? Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estabelecimento.taxaEntrega) : null}
                                          </Button>
                                      )
                                    : <Button size="small" className={"botaoCinza GrifadoBotao naoArredondado"} onClick={() => {buscarCardapioDelivery(estabelecimento)}}>
                                        Entrega
                                      </Button>
                                  } */}

                                  <Button  size="small" className={ estabelecimento.online ? "botaoVerde naoArredondado" : "botaoCinza naoArredondado"} 
                                  
                                    onClick={() => {
                                      clicarEmPedir(estabelecimento)    
                                    }}>
                                      Pedir
                                  </Button>
              
                                  {/* {
                                    estabelecimento.permiteRetiradaBalcao 
                                    ? ( !estabelecimento.online
                                        ? <Button size="small" className={"botaoCinza naoArredondado"} onClick={() => {buscarCardapioRetirada(estabelecimento)}}>
                                            Retirar
                                          </Button>
                                        : <Button size="small" className={"botaoVerde naoArredondado"} onClick={() => {buscarCardapioRetirada(estabelecimento)}}>
                                            Retirar
                                          </Button>
                                      )
                                    : null //  <Button size="small" className={"botaoCinza GrifadoBotao"}>
                                    //     Retirar
                                    //   </Button>
                                  } */}
              
              
                                  {/* {
                                    estabelecimento.taxaEntrega >= 0 && estabelecimento.online
                                    ? <Button size="small" style={{"background": "#28a745", "color":"white", "width": "100%"}} onClick={() =>{                       
                                      buscarCardapio(estabelecimento)                       
                                  }}>
                                    Pedir
                                  </Button>
                                  : <Button size="small"  style={{"background": "#6c757d", "color":"white", "width": "100%"}} onClick={() =>{                       
                                    buscarCardapio(estabelecimento)                       
                                }}>
                                  Ver
                                </Button>
                                  } */}
                                  
                                </CardActions>
                              </Card>
                            </Col>
                        : null
                      }
                    </React.Fragment>
                  ))
                }

                { (verTodasAsLojas || quantosEntregam || loadingLogadoEnderecos) 
                ? null 
                : <Col xs={12} md={12} lg={12} style={{"textAlign": "center", "marginTop": "3em"}}> 
                    <Typography variant="h6" >
                      Nenhum estabelecimento disponível
                    </Typography>
                  </Col> }   
            </React.Fragment>
          :  
              (loadingLogadoEnderecos 
              ? <>
                  {/* <Row style={(enderecoAtual?.logradouro || retirarNoLocal) ? {"display":"none"}:null}>
                    <Col xs={12} md={12} lg={12} style={{"display":"flex", "justifyContent": "center"}}>
                      <Skeleton variant="rect" width={400} height={40} />
                    </Col>
                    <Col xs={12} md={12} lg={12} style={{"display":"flex", "justifyContent": "center", "margin": "1em 0"}} >
                      <Skeleton variant="rect" width={300} height={56} />
                    </Col>
                    <Col xs={12} md={12} lg={12} style={{"display":"flex", "justifyContent": "center" , "marginBottom": "1em"}}>
                      <Skeleton variant="rect" width={155} height={42} />
                    </Col>
                    <Divider style={{"width": "100%", "margin": "0 0 1em 0"}}/>
                  </Row> */}
                    
                  <Col  xs={12} md={6} lg={6} style={{"display":"flex", "justifyContent": "center" , "alignItems":"center", "padding": "0.5em"}}>
                    <Skeleton variant="rect" width={"50%"} height={30} />
                  </Col>

                  <Col  xs={12} md={6} lg={6} style={{"padding": "0.5em"}}>
                    <Skeleton variant="rect" width={"100%"} height={56} />
                  </Col>
                  
                  <Col  xs={6} md={6} lg={8} style={{"padding": "0.5em"}}>
                    <Skeleton variant="rect" width={"100%"} height={56} />
                  </Col>

                  <Col  xs={6} md={6} lg={4} style={{"padding": "0.5em"}}>
                    <Skeleton variant="rect" width={"100%"} height={56} />
                  </Col>
                
                  {SkeletonQtd.map((sk, index) => (
                    <Col key={index} xs={12} md={6} lg={4} style={{"padding": "0.5em"}}>
                      <Skeleton variant="rect" width={"100%"} height={165} />
                    </Col>
                  ))}
                </>
              : null )
        }
        </Row>

        {
          (aplicativoDados?.exibirTodasUnidadesNoDelivery == false && loadingLogadoEnderecos  == false && aplicativoDados.exibirLojasOcultas)
          ? <Row style={{"textAlign": "center"}}>
              <Col xs={12} md={12} lg={12}>
                {
                  (verTodasAsLojas == false)
                  ?  <Button size="small"  onClick={() =>{setVerTodasAsLojas(true)}}>
                        Ver Todas as Lojas
                      </Button>
                  : <Button size="small"  onClick={() =>{setVerTodasAsLojas(false)}}>
                        Ocultar Todas as Lojas
                    </Button>
                }
              </Col>
            </Row>
          : null
        }


        {loading &&
        (<Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>)}

      </div>

    </>
  );
}