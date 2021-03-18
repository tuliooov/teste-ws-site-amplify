
import React, { Component, useState } from 'react'
import QrReader from 'react-qr-reader'
import * as Sentry from "@sentry/react";
import { useHistory } from 'react-router-dom';
import './styles.css';
import Avatar from '@material-ui/core/Avatar';
import { Row, Col, Container, Carousel } from 'react-bootstrap';
import {
    identificarEstabelecimentoSelecionado,
    CadastrarUsuario,
    RegistrarSeloSeguro2,
  } from '../../services/functions';

import api from '../../services/api';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

//import Loading from '../loading';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AiOutlineQrcode } from 'react-icons/ai';

//alert
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';


import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';




const useStyles = makeStyles((theme) => ({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing(3),
        right: theme.spacing(3),
        fontSize: "30px",
    },
    rootAlert: {
        width: '100%',
        '& > * + *': {
          marginTop: theme.spacing(2),
        },
      },
    backdrop: {
        zIndex: theme.zIndex.drawer + 9999,
        color: '#fff',
      },
}));

function dataProInput(string){
    let returno = ''
    returno += string.substring(6) + '-'
    returno += string.substring(3,5) + '-'
    returno += string.substring(0,2)  
    //console.log("dataProInput", returno)
    return returno
}


export default function ApenasFidelidade() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const history = useHistory();
    const classes = useStyles();
    const [usuarioLogado, setUsuarioLogado] = useState(JSON.parse(localStorage.getItem("usuarioCF")))
    const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))
    //console.log("usuarioLogado", usuarioLogado)


    const [configuracoesPerfilModal, setConfiguracoesPerfilModal] = React.useState(false);
    const [qrCodeModal, setQrCodeModal] = React.useState(false);
    const [usuarioEdit, setUsuarioEdit] = React.useState(usuarioLogado.cliente.nome ? usuarioLogado.cliente.nome : '');
    const [cpfEdit, setCpfEdit] = React.useState(usuarioLogado.cliente.cpf ? usuarioLogado.cliente.cpf : '');
    const [telefoneEdit, setTelefoneEdit] = React.useState(usuarioLogado.cliente.telefone ? usuarioLogado.cliente.telefone : '');
    const [dataNascimentoEdit, setDataNascimentoEdit] = React.useState(usuarioLogado.cliente.dataNascimentoTexto ? (dataProInput(usuarioLogado.cliente.dataNascimentoTexto)) : '');
    const [emailEdit, setEmailEdit] = React.useState(usuarioLogado.cliente.email ? usuarioLogado.cliente.email : '');
    const [senhaAntigaEdit, setSenhaAntigaEdit] = React.useState('');
    const [senhaNovaEdit, setSenhaNovaEdit] = React.useState('');
    const [senhaNovaConfirmacaoEdit, setSenhaNovaConfirmacaoEdit] = React.useState('');
    const [estabelecimentoAtual, setEstabelecimentoAtual] = useState(JSON.parse(localStorage.getItem("estabelecimentoAtualCF")));
    const [loading, setLoading] = React.useState(false);
    
    const logOut = () => {
        localStorage.removeItem('cardapioCF');
        localStorage.removeItem('carrinhoCF');
        localStorage.removeItem('usuarioCF');
        localStorage.removeItem('enderecoAtualCF');
        localStorage.removeItem('estabelecimentoAtualCF');
        history.push(`/login}`)
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


  async function salvarConfiguracoesPerfil(e) {   

    try {
        e.preventDefault()
        setLoading(true)

        let dataNascimentoEditado = usuarioLogado.cliente.dataNascimentoTexto

        if(dataNascimentoEditado !== 'NaN/NaN/NaN'){
            //console.log("arrumando data")
            let d = new Date(dataNascimentoEdit);
            let dt = d.getDate();
            dt++
            let mn = d.getMonth();
            mn++
            let yy = d.getFullYear();
            dataNascimentoEditado = dt + "/" + mn + "/" + yy
        }
        if(senhaNovaEdit && senhaNovaEdit.length < 8){
            alertStart("Sua nova senha contem menos de 8 coracteres!", "warning")
            document.getElementById("senhaNovaEdit").focus()
            setLoading(false)
            return false
        }else if(senhaNovaEdit && senhaNovaEdit !== senhaNovaConfirmacaoEdit){
            alertStart("Sua senha de confirmação não é igual a nova senha!", "warning")
            document.getElementById("senhaNovaConfirmacaoEdit").focus()
            setLoading(false)
            return false
        }else if(senhaAntigaEdit && senhaAntigaEdit !== usuarioLogado.cliente.hashSenha){
            alertStart("Sua senha antiga está incorreta!", "warning")
            document.getElementById("senhaAntigaEdit").focus()
            setLoading(false)
            return false
        }


        const data = usuarioLogado.cliente
        data.appNome = aplicativoDados.appNome
        data.nome = usuarioEdit ? usuarioEdit : usuarioLogado.cliente.nome
        data.cpf = cpfEdit ? cpfEdit : usuarioLogado.cliente.cpf
        data.telefone = telefoneEdit ? telefoneEdit : usuarioLogado.cliente.telefone
        data.dataNascimentoTexto = dataNascimentoEditado !== 'NaN/NaN/NaN' ? dataNascimentoEditado : usuarioLogado.cliente.dataNascimentoTexto
        data.email = emailEdit ? emailEdit : usuarioLogado.cliente.email 
        data.hashSenha = senhaNovaEdit ? senhaNovaEdit : usuarioLogado.cliente.hashSenha
        data.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`

        const response = await CadastrarUsuario(data, aplicativoDados)
    
        if(response.retornoErro){
            //algum erro
            alertStart(response.mensagem, "error")
        }else{ 
            //tudo certo
            usuarioLogado.cliente = response
            setUsuarioLogado(usuarioLogado)
            localStorage.setItem("usuarioCF", JSON.stringify(usuarioLogado))
            alertStart("Suas informações pessoais foram salvas com sucesso!", "success")
        }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions CadastrarUsuario ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
    }

    setConfiguracoesPerfilModal(false)
    setLoading(false)
  }
  

 
    class QRCode extends Component {

        state = {
            result: 'No result',
            leu: false,
        }
    
        handleScan = data =>  {           
            if (data && !this.state.leu) {  
                
                setQrCodeModal(false)         
                this.setState({
                    result: data,
                    leu: true,
                })

                //console.log("data", data)

                try {
                    setLoading(true)
                    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"))
                    const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))
                    
                    
                    const data = {}
                    data.idCliente = usuarioLogado.cliente.id         
                    data.appNome = aplicativoDados.appNome
                    data.codigoSelo = data.replace("market://details?id=br.com.clientefiel&", "") 
                    data.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`

                    const response = RegistrarSeloSeguro2(data, aplicativoDados)
                
                    if(response.retornoErro){
                        //algum erro
                        alertStart(response.mensagem, "error")
                    }else{ 
                        //tudo certo
                        let statusAlert = "success"
                        
                        if(response.codErro > 0){ // ERRO
                            statusAlert = "error"
                        }else{

                            if(response.status === 0){                                
                                usuarioLogado.cartelas[0] = response                            
                            }else{
                                //CARTELA COMPLETOU - INICIAR OUTRA
                                usuarioLogado.cartelas.unshift(response)
                            }

                            localStorage.setItem("usuarioCF", JSON.stringify(usuarioLogado))
                            setUsuarioLogado(usuarioLogado)
                            
                        }                          
                        
                        setLoading(false)
                        alertStart(response.mensagem, statusAlert)
                    }
                }
                catch (error) {
                    Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions buscarCardapioOffline ${window.location.hostname} - ${error}`);
                    alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")  
                    setLoading(false)  
                }
            }
        }

        handleError = err => {
            setQrCodeModal(false) 
            setLoading(false)
            alertStart("Algo deu errado ao registrar selo  (handleError)", "error")
        }

        render() {
            return (
                <div>
                    <QrReader
                        delay={300}
                        onError={this.handleError}
                        onScan={this.handleScan}
                        style={{ width: '100%' }}
                    />
                    {/*<p>{this.state.result}</p>*/}
                </div>
            )
        }
    }

    //console.log(QRCode.result)
    

    return (
        <>
            {loading &&
            (<Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
            </Backdrop>)}

            <Snackbar open={alert.status} autoHideDuration={6000} onClose={alertClose}>
                <Alert onClose={alertClose} severity={alert.tipo}>
                {alert.mesangem}
                </Alert>
            </Snackbar>


            
            {/* <Cabecalho voltar={false} pesquisa={false} produtoNome={usuarioLogado.cliente.nome}></Cabecalho> */ }
            <div className="container container-perfil-fidelidade">
                <Container className="containerEstabelecimentoComponente">
                    <div className="EstabelecimentoComponente row" >
                        <div className="divFundo" style={{ "background": aplicativoDados.urlFundoSite ? `url(${aplicativoDados.urlFundoSite})` : `${aplicativoDados.corSitePrimaria}` }}>
                            <Avatar className="logoPerfil" style={{"textTransform": "uppercase" ,"background": aplicativoDados.corSiteSecundaria, "color": aplicativoDados.corSitePrimaria, "fontSize": "3em" }}>{usuarioLogado.cliente.nome[0]}</Avatar>
                        </div>

                        <Carousel indicators={false} controls={false} className="carrossel w-100 fundoInfoEstabelecimento">
                            <Carousel.Item className="container">
                                <Row className="rowUsuarioPerfil">
                                    <Col xs={4} md={4} lg={2}></Col>
                                    <Col xs={8} md={8} lg={6} className="fraseLadoLogo"><h5>{usuarioLogado.cliente.nome}</h5></Col>                                    
                                </Row>
                            </Carousel.Item>
                        </Carousel>

                        <div style={{"width": "100%"}}>
                            <List>

                                
                                <ListItem button onClick={() => { 
                                    history.push(`/fidelidade/cartelas${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
                                    }}>
                                    <ListItemIcon> <FavoriteIcon /> </ListItemIcon>
                                    <ListItemText primary={"Cartelas de Fidelidade"} />
                                </ListItem>

                                <ListItem button onClick={() => { 
                                    history.push(`/fidelidade/estabelecimentos`)
                                    }}>
                                    <ListItemIcon> <LocationOnIcon /> </ListItemIcon>
                                    <ListItemText primary={"Estabelecimentos"} />
                                </ListItem>

                                

                                <ListItem button onClick={() => { setConfiguracoesPerfilModal(true) }}>
                                    <ListItemIcon> <SettingsIcon /> </ListItemIcon>
                                    <ListItemText primary={"Configurações"} />
                                </ListItem>

                            </List>
                            <Divider/>
                            <List>

                                <ListItem button onClick={logOut}>
                                    <ListItemIcon> <ExitToAppIcon /> </ListItemIcon>
                                    <ListItemText primary={"Sair"} />
                                </ListItem>

                            </List>
                        </div>
                    </div>
                    <Tooltip title="Ler QRcode" placement="bottom" aria-label="Ler QRcode" onClick={() => { setQrCodeModal(true) }}>
                        <Fab color="secondary" style={{"color": aplicativoDados.corSitePrimaria}} className={classes.absolute}>
                        <AiOutlineQrcode />
                        </Fab>
                    </Tooltip>
                </Container>
            </div>

            <Dialog
              fullScreen={fullScreen}
              open={configuracoesPerfilModal}
              aria-labelledby="configPerfil">
                  
              <form onSubmit={salvarConfiguracoesPerfil}>

              <DialogTitle id="configPerfil">{"Configurações do Perfil"}</DialogTitle>


              <DialogContent>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    onChange={(e) =>{ setUsuarioEdit(e.target.value)}}
                    value={usuarioEdit}
                    id="usuarioEdit"
                    label="Nome do Usuário"
                    name="usuarioEdit"
                    type="text"                    
                />   

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    onChange={(e) =>{ setCpfEdit(e.target.value)}}
                    value={cpfEdit}
                    id="cpfEdit"
                    label="CPF"
                    name="cpfEdit"
                    type="text"                    
                />   
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    onChange={(e) =>{ setTelefoneEdit(e.target.value)}}
                    value={telefoneEdit}
                    id="telefoneEdit"
                    label="Telefone"
                    name="telefoneEdit"
                    type="number"                    
                />  

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    onChange={(e) =>{ setDataNascimentoEdit(e.target.value)}}
                    value={dataNascimentoEdit}
                    id="dataNascimentoEdit"
                    label="Data Nascimento"
                    name="dataNascimentoEdit"
                    type="date"                    
                />  
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    onChange={(e) =>{ setEmailEdit(e.target.value)}}
                    value={emailEdit}
                    id="emailEdit"
                    label="Email"
                    name="emailEdit"
                    type="email"                    
                />  

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    onChange={(e) =>{ setSenhaAntigaEdit(e.target.value)}}
                    value={senhaAntigaEdit}
                    required={senhaNovaEdit ? true : false}
                    id="senhaAntigaEdit"
                    label="Senha Antiga"
                    name="senhaAntigaEdit"
                    type="password"                    
                />  

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    onChange={(e) =>{ setSenhaNovaEdit(e.target.value)}}
                    value={senhaNovaEdit}
                    required={senhaAntigaEdit ? true : false}
                    id="senhaNovaEdit"
                    label="Senha Nova"
                    name="senhaNovaEdit"
                    type="password"                    
                />  
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required={senhaNovaEdit ? true : false}
                    onChange={(e) =>{ setSenhaNovaConfirmacaoEdit(e.target.value)}}
                    value={senhaNovaConfirmacaoEdit}
                    id="senhaNovaConfirmacaoEdit"
                    label="Senha Nova Confirmação"
                    name="senhaNovaConfirmacaoEdit"
                    type="password"                    
                /> 
              </DialogContent>

              <DialogActions>                
                <Button onClick={() => {setConfiguracoesPerfilModal(false)}} >
                  Cancelar
                </Button>
                <Button type="submit"
                style={{"color": "#28a745"}}>
                  Atualizar
                </Button>
              </DialogActions>
              </form>
            </Dialog>






            <Dialog
              fullScreen={fullScreen}
              open={qrCodeModal}
              aria-labelledby="qrCodeModal">

              <DialogTitle id="qrCodeModal">{"Leitura de QRCode"}</DialogTitle>
              <DialogContent>

                <QRCode/>

              </DialogContent>
              <DialogActions>                
                <Button onClick={() => {setQrCodeModal(false)}} >
                  Cancelar
                </Button>                
              </DialogActions>
            </Dialog>

            {/* <Rodape valor="Perfil"></Rodape> */}
        </>
    );
}

