import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Sentry from "@sentry/react";

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

import ReactPixel from 'react-facebook-pixel';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import {
  CadastrarUsuario,
  AtualizarDispositivoUsuario,
  ObterCardapioCompletoV1,
  LoginGeral,
  identificarEstabelecimentoSelecionado,
  CadastrarEnderecoCliente,
} from '../../services/functions';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import api from '../../services/api';

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
}));


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function Login(props) {

  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))  
  
  
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [estabelecimentoAtual, setEstabelecimentoAtual] = useState(JSON.parse(localStorage.getItem("estabelecimentoAtualCF")));
  const history = useHistory();
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const search = props.location.search;
  const params = new URLSearchParams(search);
  const [codigoIndicacao, setCodigoIndicacao] = React.useState({"abrir": false, "codigo": params.get('codigoAmigo') ? params.get('codigoAmigo') : "" });
  const [alert, setAlert] = useState({"status": false, "tipo": "success", "mesangem": ""});



  const cadastrarUsuario = async (e) =>{
    try {
      e.preventDefault()
      //console.log("cadastrarUsuario", cadastrarUsuario)

      let telefoneReplace = telefone.replace(' ', '').replace('.','').replace('-','').replace('(','').replace(')','').replace('/','')
      
      if(telefoneReplace.charAt(0) == "0"){
        telefoneReplace = telefoneReplace.substring(1)
      }

      
      
      if(senha.length < 6){
        alertStart("Sua senha deve conter no minimo 6 caracteres!", "warning")
        return false
      }else if(confirmarSenha !== senha){
        alertStart("Senhas digitadas não são compativeis!", "warning")      
        return false
      }else if(!(telefoneReplace.length >= 10 && telefoneReplace.length <= 11)){
        alertStart("Seu telefone esta incompleto, verifique se você digitou o DDD e o digito 9!", "warning")
        return false
      }

      setLoading(true)

      //ENVIAR CADASTRO
      
      const data = {
        "appNome": aplicativoDados.appNome,
        "nome": nome,
        "telefone": telefone,
        "dataNascimentoTexto": '',
        "email": email ? email : '55'+telefoneReplace+"@c.us",
        "hashSenha": senha,
        "cpf": '',
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
      }

      if(codigoIndicacao){
        data.codigoAmigo = codigoIndicacao.codigo
      }
  
      //console.log("CadastrarUsuario", data)

      const response = await CadastrarUsuario(data, aplicativoDados)
  
      if(response.retornoErro){
        //algum erro
        alertStart(email === "" ? response.mensagem.replace("email", "telefone") : response.mensagem, "error")
        setLoading(false)
        return false
      }else{ 
        //tudo certo

        if(aplicativoDados.pixelFacebook){
            ReactPixel.track('CompleteRegistration')
        }

        alertStart("Seu usuario foi cadastrado corretamente! Aguarde o login automatico.", "success")
        realizarLogin_UsuarioSenha(response.email, response.hashSenha)
        //CHAMAR LOGIN
      }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions CadastrarUsuario ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro: " + error.message, "error")  
        setLoading(false)
    }
    return true
  }

  function calcularValorTotal(carrinho){
    
    const cardapio = JSON.parse(localStorage.getItem('cardapioCF'))
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
        "idEstabelecimento": JSON.parse(localStorage.getItem("estabelecimentoAtualCF"))?.id ? JSON.parse(localStorage.getItem("estabelecimentoAtualCF"))?.id  : null,
        "cep": enderecoBackUp.cep,
        "uf": enderecoBackUp.uf,
        "cidade": enderecoBackUp.cidade,
        "bairro": enderecoBackUp.bairro,
        "logradouro": enderecoBackUp.logradouro,
        "numero": enderecoBackUp.numero,
        "complemento": enderecoBackUp.complemento,
        "referencia":  enderecoBackUp.referencia,
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
      }

      if(enderecoBackUp.bairroEspecifico){
        data.bairroEspecifico = 1
      }else{
        data.bairroEspecifico = 0
      }

      const response = await CadastrarEnderecoCliente(data, aplicativoDados)
  
      if(response.retornoErro){
        //algum erro
        alertStart(response.mensagem, "error")
      }else{ 
        //tudo certo
        usuarioLogado.cliente.enderecos.push(response)
        localStorage.setItem('usuarioCF', JSON.stringify(usuarioLogado))
        resp = response.id
      }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions CadastrarEnderecoCliente ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro CadastrarEnderecoCliente: "+error.message, "error")    
    }
    return resp
  }

  async function buscaCardapioInicial(usuarioLogado) {
    try {
      const cardapio = JSON.parse(localStorage.getItem("cardapioCF"))
      if(aplicativoDados.possuiDelivery === true){
        if(!cardapio || cardapio.id === "usuarioDeslogado"){
          
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

          const response = await ObterCardapioCompletoV1(data, aplicativoDados)
  
          if(response.retornoErro){
            //algum erro
            alertStart(response.mensagem, "error")
          }else{ 
            //tudo certo
            const retorno = response
      
              localStorage.setItem("cardapioCF", JSON.stringify(retorno))                        
              localStorage.setItem("enderecoAtualCF", JSON.stringify(!!retorno.enderecos[0] ? retorno.enderecos[0] : {}))
      
              const carrinhoRetorno = JSON.parse(localStorage.getItem("carrinhoCF")) 
      
              carrinhoRetorno.valorMinimoPedido = retorno.valorMinimoPedido
              carrinhoRetorno.valorDesconto = retorno.valorDesconto
              carrinhoRetorno.percentualDesconto = retorno.percentualDesconto
              carrinhoRetorno.minimoEntregaGratis = retorno.minimoEntregaGratis
              carrinhoRetorno.maximoPedidoComDesconto = retorno.maximoPedidoComDesconto
              carrinhoRetorno.maximoDesconto = retorno.maximoDesconto
              carrinhoRetorno.cupomDesconto = retorno.cupomDesconto

              const produtosDoCarrinho = JSON.parse(localStorage.getItem('backupItensCarrinhoCF'))
              localStorage.removeItem('backupItensCarrinhoCF')
              carrinhoRetorno.pedido = {
                "entregaImediata": false,
                "formaPagamento": {},
                "itens": produtosDoCarrinho?.length > 0 ? produtosDoCarrinho :  [],
                "taxaEntrega": !!retorno.enderecos[0] ? retorno.enderecos[0].taxaEntrega : null,
                //"tipoDesconto": null,
                "tokenCartaoCredito": null,
                "troco": null,
                "valorDesconto": carrinhoRetorno.valorDesconto,
                "valorEntrega": null,
                "valorTotal": 0,
                "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
              }
              localStorage.setItem("carrinhoCF", JSON.stringify(carrinhoRetorno))     
      
              if(produtosDoCarrinho?.length > 0){
                calcularValorTotal(carrinhoRetorno)
              }
              
              if(usuarioLogado.estabelecimentos.length === 1 || (JSON.parse(localStorage.getItem('estabelecimentoAtualCF'))?.id && produtosDoCarrinho?.length > 0)){
                history.push(`/delivery${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
              }else if(usuarioLogado.estabelecimentos.length > 1 ){
                history.push(`/estabelecimento`)
              }
          }
        
        }else{
          history.push(`/delivery${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
        }
      }else{
        history.push(`/fidelidade${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
      }  
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions adicionarEndereco ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro adicionarEndereco: "+error.message, "error")
        setLoading(false)        
    }

  

  }

  async function realizarLogin_UsuarioSenha(usuarioVerificado, senhaVerificado) {

    // os 2 parametros: usuarioVerificado e senhaVerificado
    // são para usuarios que conectao por telefone, apenas reutilizei essa funcao para nao criar outra

    try {
      setLoading(true)
      const data = {
        "appNome": aplicativoDados.appNome,
        "cliente":{
          "email": usuarioVerificado,
          "hashSenha": senhaVerificado,
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
        alertStart(response.mensagem, "error")
        setLoading(false)

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

        if(!JSON.parse(localStorage.getItem("enderecoAtualCF"))?.bairro){
          localStorage.setItem("enderecoAtualCF", JSON.stringify({}))
        }

        if(!JSON.parse(localStorage.getItem("carrinhoCF"))){
          localStorage.setItem("carrinhoCF", JSON.stringify({}))
        }

        if(!localStorage.getItem("estabelecimentoAtualCF")){
          localStorage.setItem("estabelecimentoAtualCF", JSON.stringify(response.estabelecimentos[0]))
        }

        if(response.estabelecimentos.length > 0){
          await buscaCardapioInicial(response)
        }else{
          alertStart("Nenhum estabelecimento disponivel para esse usuario", "error")   
        }
      }
    }
    catch (error) {
        console.log('error ', error)
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions LoginGeral ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro LoginGeral: "+error.message, "error")    
    }
      
  }

  const alertStart = (msg, tipo) => {
    setAlert({"status": true, "tipo": tipo, "mesangem": msg});
  };
  const alertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({"status": false, "tipo": "success", "mesangem": ""});
  };

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
      
        <Typography component="h1" variant="h5">
          Cadastrar Usuário
        </Typography>
        <form className={classes.form + " container"} onSubmit={cadastrarUsuario} >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={e => setNome(e.target.value)}
            id="nome"
            value={nome}
            label="Nome"
            name="nome"
          />
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            min="10"
            max="11"
            value={telefone}
            onChange={e => { setTelefone(e.target.value) }}
            name="telefone"
            label="Telefone"
            type="number"
            id="telefone"
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
            name="email"
            label="Email (opcional)"
            type="email"
            id="email"
          />
          <TextField
            variant="outlined"
            margin="normal"
            min="6"
            required
            fullWidth
            value={senha}
            onFocus={ () => {
              window.scrollTo(0, document.querySelector("html").scrollHeight)
            }}
            onChange={e => setSenha(e.target.value)}
            name="senha"
            label="Senha"
            type="password"
            id="senha"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            min="6"
            onFocus={ () => {
              window.scrollTo(0, document.querySelector("html").scrollHeight)
            }}
            value={confirmarSenha}
            onChange={e => setConfirmarSenha(e.target.value)}
            name="confirmarSenha"
            label="Confirmar Senha"
            type="password"
            id="confirmarSenha"
          />
          <Grid container>
            <Grid item xs>
              <Link onClick={() => {
                setCodigoIndicacao({"abrir": true, "codigo": codigoIndicacao.codigo})
              }} variant="body2" style={{"color":`${aplicativoDados.corSitePrimaria}`}}>
                Código do Amigo {<b>{codigoIndicacao.codigo}</b>} 
              </Link>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Cadastrar
          </Button>

          <Grid container style={{"textAlign": "center"}}>
            <Grid item xs>
              <Link to={`/login`} variant="body2" style={{"color":`${aplicativoDados.corSitePrimaria}`}}>
                Ja tenho usuário
              </Link>
            </Grid>
          </Grid>
          
        </form>
      </div>


            <Dialog
              open={codigoIndicacao.abrir}
              aria-labelledby="codigoIndicacao">
              <DialogTitle id="codigoIndicacao">{"Código de Indicação"}</DialogTitle>


              <DialogContent>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  onChange={(e) =>{setCodigoIndicacao({"abrir": true, "codigo": e.target.value})}}
                  value={codigoIndicacao.codigo}
                  id="codigoIndicacao"
                  label="Código de Amigo"
                  name="codigoIndicacao"
                  type="text"
                  //autoFocus
                />
              </DialogContent>

              <DialogActions>

                <Button onClick={(e) => {setCodigoIndicacao({"abrir": false, "codigo": codigoIndicacao.codigo})}} style={{"color": "#dc3545"}}>
                  Voltar
                </Button>
                
                <Button onClick={(e) => {setCodigoIndicacao({"abrir": false, "codigo": codigoIndicacao.codigo})}} style={{"color": "white", "backgroundColor":"#28a745"}}>
                  Pronto
                </Button>
              </DialogActions>
            </Dialog>
    </Container>


  );
}
