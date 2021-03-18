
import React, {Component, useState, useEffect,  } from 'react'
import QrReader from 'react-qr-reader'
import * as Sentry from "@sentry/react";
import { useHistory,useParams } from 'react-router-dom';
import './styles.css';
import Cabecalho from '../Global/cabecalho';
import Rodape from '../Global/rodape';
import Avatar from '@material-ui/core/Avatar';
import { Card, Row, Col, Container, Carousel } from 'react-bootstrap';
import ReceiptIcon from '@material-ui/icons/Receipt';

import {
    ExtratoCashback,
    ResgatarCashBack,
    CadastrarUsuario,
    BuscarPedidosCliente,
    RegistrarSeloSeguro2,
    BuscarUltimoPedidoCliente,
    identificarEstabelecimentoSelecionado,
  } from '../../services/functions';

import api from '../../services/api';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DescriptionIcon from '@material-ui/icons/Description';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import ShareIcon from '@material-ui/icons/Share';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

//import ShareBtn from 'react-share-button';

//import Loading from '../loading';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AiOutlineQrcode } from 'react-icons/ai';

//alert
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import Slide from '@material-ui/core/Slide';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import CardContent from '@material-ui/core/CardContent';
import { Receipt } from '@material-ui/icons';
import GanheDescontos from '../Delivery/ganheDescontos';


function getMoney( str )
{
        return parseInt( str.replace(/[\D]+/g,'') );
}
function formatReal( int )
{
        var tmp = int+'';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if( tmp.length > 6 )
                tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

        return tmp;
}

const useStyles = makeStyles((theme) => ({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    fixed: {
        position: 'fixed',
        bottom: theme.spacing(10),
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
      root: {
        minWidth: 275,
        marginTop: '10px',
      },
      bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
      },
      title: {
        fontSize: 14,
      },
      pos: {
        marginBottom: 12,
      },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function dataProInput(string){
    let returno = ''
    returno += string.substring(6) + '-'
    returno += string.substring(3,5) + '-'
    returno += string.substring(0,2)  
    //console.log("dataProInput", returno)
    return returno
}


export default function Perfil() {
    const {param1} = useParams();
    const [estabelecimentoAtual, setEstabelecimentoAtual] = useState(JSON.parse(localStorage.getItem("estabelecimentoAtualCF")));
    const [openGanheDescontos, setOpenGanheDescontos] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const history = useHistory();
    const classes = useStyles();
    const [usuarioLogado, setUsuarioLogado] = useState(JSON.parse(localStorage.getItem("usuarioCF")))
    const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))
    //console.log("usuarioLogado", usuarioLogado)

    const [configuracoesPerfilModal, setConfiguracoesPerfilModal] = React.useState( param1 === 'configuracao' ? true : false);
    const [qrCodeModal, setQrCodeModal] = React.useState(false);
    const [usuarioEdit, setUsuarioEdit] = React.useState(usuarioLogado.cliente.nome ? usuarioLogado.cliente.nome : '');
    const [cpfEdit, setCpfEdit] = React.useState(usuarioLogado.cliente.cpf ? usuarioLogado.cliente.cpf : '');
    const [telefoneEdit, setTelefoneEdit] = React.useState(usuarioLogado.cliente.telefone ? usuarioLogado.cliente.telefone : '');
    const [dataNascimentoEdit, setDataNascimentoEdit] = React.useState(usuarioLogado.cliente.dataNascimentoTexto ? (dataProInput(usuarioLogado.cliente.dataNascimentoTexto)) : '');
    const [emailEdit, setEmailEdit] = React.useState(usuarioLogado.cliente.email ? usuarioLogado.cliente.email : '');
    const [senhaAntigaEdit, setSenhaAntigaEdit] = React.useState('');
    const [senhaNovaEdit, setSenhaNovaEdit] = React.useState('');
    const [senhaNovaConfirmacaoEdit, setSenhaNovaConfirmacaoEdit] = React.useState('');
    const [Cashback, setCashback] = React.useState(false);
    const [RelatorioCashBack, setRelatorioCashBack] = React.useState(false);
    const [DadosRelatorioCashBack, setDadosRelatorioCashBack] = React.useState('');
    const [LojasCashBack, setLojasCashBack] = React.useState(false);
    const [CompartilharCodigoAmigo, setCompartilharCodigoAmigo] = React.useState( param1 === 'indicacao-amigos' ? true : false );

    const [ultimoPedido, setUltimoPedido] = React.useState(localStorage.getItem("ultimoPedidoCF") ? JSON.parse(localStorage.getItem("ultimoPedidoCF")) : '');
    
    const [loading, setLoading] = React.useState(false);
    
    const logOut = () => {
        localStorage.removeItem('backupItensCarrinhoCF');
        localStorage.removeItem('PedidoCanceladoBackupCF');
        localStorage.removeItem('usuarioPedidoMesaCF');
        localStorage.removeItem('produtoSelecionadoCF');
        localStorage.removeItem('ultimoPedidoCF');
        localStorage.removeItem('cardapioCF');
        localStorage.removeItem('carrinhoCF');
        localStorage.removeItem('usuarioCF');
        localStorage.removeItem('enderecoAtualCF');
        localStorage.removeItem('estabelecimentoAtualCF');
        localStorage.removeItem('dateCardapioCF');
        localStorage.removeItem('usuarioPedidoMesaCF_Date');
        localStorage.removeItem('dateUsuarioCF');
        history.push(`/login`)
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
        }else if(senhaNovaEdit && senhaNovaEdit != senhaNovaConfirmacaoEdit){
            alertStart("Sua senha de confirmação não é igual a nova senha!", "warning")
            document.getElementById("senhaNovaConfirmacaoEdit").focus()
            setLoading(false)
            return false
        }else if(senhaAntigaEdit && senhaAntigaEdit != usuarioLogado.cliente.hashSenha){
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
            if(response.codErro > 0){
                //deu errado 
                alertStart(response.mensagem, "error")
            }else{
                //deu certo
                usuarioLogado.cliente = response
                setUsuarioLogado(usuarioLogado)
                localStorage.setItem("usuarioCF", JSON.stringify(usuarioLogado))
                alertStart("Suas informações pessoais foram salvas com sucesso!", "success")
            } 
        }
        setConfiguracoesPerfilModal(false)
        setLoading(false)
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions salvarConfiguracoesPerfil ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")   
        setSenhaNovaConfirmacaoEdit('')
        setSenhaAntigaEdit('')
        setSenhaNovaEdit('') 
        setConfiguracoesPerfilModal(false)
        setLoading(false)
    }
  }
  

  const buscarHistoricoPedido = async () => {    

    try {
        setLoading(true)
        const data = usuarioLogado.cliente
        data.appNome = aplicativoDados.appNome
        data.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`


        const response = await BuscarPedidosCliente(data, aplicativoDados)
        console.log("buscarHistoricoPedido", response)
    
        if(response.retornoErro){
            //algum erro
            alertStart(response.mensagem, "error")
        }else{ 
            //tudo certo
            localStorage.setItem('historicoPedidosCF', JSON.stringify(response))
            if(response.length > 0){
                history.push(`/delivery/historicoPedidos`)
            }else{
                alertStart("Você ainda não fez pedidos", "warning")
                setLoading(false)
            }
        }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions buscarHistoricoPedido ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
    }

    

    

    //console.log("BuscarPedidosCliente", data)


  }


 
    class QRCode extends Component {

        state = {
            result: 'No result',
            leu: false,
        }
    
        handleScan = async data =>  {           
            if (data && !this.state.leu) {  
                
                this.setState({
                    result: data,
                    leu: true,
                })
                setQrCodeModal(false)         

                //console.log("data", data)

                setLoading(true)
                
                try {

                    if(data.includes("www.") || data.includes("https") || data.includes("http")){
                        window.location.href = data
                    }else if(data){
                        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"))
                        const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))
                        
                        
                        const enviarData = {}
                        enviarData.idCliente = usuarioLogado.cliente.id         
                        enviarData.appNome = aplicativoDados.appNome
                        enviarData.codigoSelo = data?.replace("market://details?id=br.com.clientefiel&", "") 
                        enviarData.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`
                        console.log('data>', enviarData)
                        const response = await RegistrarSeloSeguro2(enviarData, aplicativoDados)
                        console.log('reotnro> ' , response)
                        if(response.retornoErro){
                            //algum erro 
                        alertStart(response.mensagem, "error")
                        setLoading(false)

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
                    }else{
                        alertStart("Esse QRCode não é válido!", "error")   
                    }
                    
                }
                catch (error) {
                    Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions RegistrarSeloSeguro2 ${window.location.hostname} - ${error}`);
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
            if(qrCodeModal){
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
            }else{
                return (
                    <div>
                        
                    </div>
                )
            }
        }
    }
    //console.log(QRCode.result)
    
    useEffect(()=>{
        console.log("useEffect", ultimoPedido)
        const ultimo = async () => {
            console.log("ultimo")
            try {
                const data = usuarioLogado.cliente
                data.appNome = aplicativoDados.appNome
                data.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`
            
                const response = await BuscarUltimoPedidoCliente(data, aplicativoDados)
                console.log('BuscarUltimoPedidoCliente', response)
                if(response.retornoErro){
                    //algum erro
                    alertStart(response.mensagem, "error")
                }else{ 
                    //tudo certo
                    if(response === ""){
                        localStorage.setItem("ultimoPedidoCF", '{"tem":false}')
                        setUltimoPedido({"tem":false})   
                        return false
                    }
                    localStorage.setItem("ultimoPedidoCF", JSON.stringify(response))
                    setUltimoPedido(response)
                }
            }
            catch (error) {
                Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions BuscarUltimoPedidoCliente ${window.location.hostname} - ${error}`);
                alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
            }
        }

        if(!ultimoPedido){
            ultimo();
        }
    }, [ultimoPedido])


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


            <Cabecalho nomeUsuario={true}></Cabecalho>

            <div className="container container-perfil">
                <Container className="containerEstabelecimentoComponente">
                    <div className="EstabelecimentoComponente row" >
                        <div className="divFundo" style={{ "background": aplicativoDados.urlFundoSite ? `url(${aplicativoDados.urlFundoSite})` : `${aplicativoDados.corSiteSecundaria}`, "height": aplicativoDados.urlFundoSite ? "280px" : "125px" }} >
                            <Avatar className="logoPerfil" style={{"top": aplicativoDados.urlFundoSite ? "83%" : "65%", "textTransform": "uppercase" ,"background": aplicativoDados.corSitePrimaria, "color": aplicativoDados.corSiteSecundaria, "fontSize": "3em" }}>{usuarioLogado.cliente.nome[0]}</Avatar>
                        </div>

                        <Carousel indicators={false} controls={false} className="carrossel w-100 fundoInfoEstabelecimento">
                            <Carousel.Item className="container">
                                <Row className="rowUsuarioPerfil">
                                    <Col xs={4} md={4} lg={2}></Col>
                                    <Col xs={8} md={8} lg={6} className="fraseLadoLogo"><h5>{usuarioLogado.cliente.nome}</h5></Col>

                                    {!ultimoPedido 
                                    ? (<Col xs={12} md={12} lg={12} className="fraseLadoLogo" style={{"textAlign": "center"}}><h5><CircularProgress color="inherit" /></h5></Col>) 
                                    : (
                                        <>
                                        { (usuarioLogado.cartelas.length && aplicativoDados.apenasDelivery === false && usuarioLogado.cartelas[0]?.status === 0)
                                        ?   <Col xs={6} md={6} lg={2} className="marginTopMd" >
                                                <b>Cartela Atual</b><br></br>
                                                {usuarioLogado.cartelas[0]?.selos?.length} / {usuarioLogado.cartelas[0]?.promocaoFidelidade?.quantidadeNecessaria} selos
                                            </Col> 
                                        : null}
                                        
                                        {ultimoPedido.tem === true || ultimoPedido.id
                                        ? (<Col xs={6} md={6} lg={2} className="marginTopMd"><b>Ultimo Pedido</b><br></br>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ultimoPedido.valorTotal)}</Col>)
                                        : null}
                                        </>
                                    )}
                                    
                                    
                                </Row>
                            </Carousel.Item>
                        </Carousel>

                        <div style={{"width": "100%", "background": "#f6f6f6"}}>
                            <List>

                                <ListItem button onClick={() => { 
                                    history.push(`/delivery/enderecos${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
                                    }}>
                                    <ListItemIcon> <LocationOnIcon /> </ListItemIcon>
                                    <ListItemText primary={"Endereços"} />
                                </ListItem>

                                {aplicativoDados.tokenCashBack &&
                                    <ListItem button onClick={() => { setCashback(true) }}>
                                    <ListItemIcon> <MonetizationOnIcon/> </ListItemIcon>
                                    <ListItemText primary={"CashBack"} />
                                    </ListItem>
                                }

                                {aplicativoDados.apenasDelivery === false &&
                                    <ListItem button onClick={() => { 
                                        history.push(`/delivery/fidelidade`)
                                    }}>
                                    <ListItemIcon> <FavoriteIcon /> </ListItemIcon>
                                    <ListItemText primary={"Cartelas de Fidelidade"} />
                                    </ListItem>
                                }

                                
                                

                                <ListItem button onClick={() => { buscarHistoricoPedido() }}>
                                    <ListItemIcon> <DescriptionIcon /> </ListItemIcon>
                                    <ListItemText primary={"Histórico de Pedidos"} />
                                </ListItem>

                                <ListItem button onClick={() => { setConfiguracoesPerfilModal(true) }}>
                                    <ListItemIcon> <SettingsIcon /> </ListItemIcon>
                                    <ListItemText primary={"Configurações"} />
                                </ListItem>

                                {/* {aplicativoDados.apenasDelivery === false
                                &&  <ListItem button onClick={() => { setCompartilharCodigoAmigo(true) }}>
                                        <ListItemIcon> <ShareIcon /> </ListItemIcon>
                                        <ListItemText primary={"Ganhar Selos"} />
                                    </ListItem>
                                } */}
                                <ListItem button onClick={() => { setOpenGanheDescontos(true)}}>
                                    <ListItemIcon> <Receipt /> </ListItemIcon>
                                    <ListItemText primary={"Ganhe Descontos"} />
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
                    {
                        aplicativoDados.apenasDelivery === false 
                        ? (<Tooltip title="Ler QRcode" placement="bottom" aria-label="Ler QRcode" onClick={() => { setQrCodeModal(true) }}>
                            <Fab color="secondary" style={{"color": aplicativoDados.corSitePrimaria}} className={classes.fixed}>
                            <AiOutlineQrcode />
                            </Fab>
                        </Tooltip>)
                        : null
                    }
                </Container>
            </div>

            <GanheDescontos 
                setOpenGanheDescontos={setOpenGanheDescontos}
                openGanheDescontos={openGanheDescontos}
                usuario={usuarioLogado}
                jaEstou={true}
                setConfiguracoesPerfilModal={setConfiguracoesPerfilModal}
                setCompartilharCodigoAmigo={setCompartilharCodigoAmigo}
                aplicativoDados={aplicativoDados}
                estabelecimentoAtual={aplicativoDados.estabelecimentos.length === 1 ? aplicativoDados.estabelecimentos[0] : {}}
            />

            <Dialog

                open={CompartilharCodigoAmigo}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => { setCompartilharCodigoAmigo(false) }}
                aria-labelledby="modal-ganhe-selos"
                aria-describedby="modal-ganhe-selos"
            >
            <DialogTitle id="modal-ganhe-selos">{"Ganhe Selos"}</DialogTitle>
            <DialogContent>
                    <Typography> {aplicativoDados.textoPromocaoIndicacao} </Typography>       

                    <br/>
                    <Button variant="outlined" color="primary" fullWidth onClick={(e) => {
                        navigator.clipboard.writeText(usuarioLogado.cliente.codigoCupomDesconto)
                        alertStart("Código copiado!", "info")
                    }}>
                        {usuarioLogado.cliente.codigoCupomDesconto}
                    </Button>
                    <br/>
                                
                    <br/> 
                    <Typography> Você ganha {aplicativoDados.selosPorIndicacaoConvidado} selos </Typography>     
                    <br/>                
                    <Typography> Seu amigo ganha {aplicativoDados.selosPorIndicacaoConvidante} selos </Typography>                    
            </DialogContent>
            <DialogActions>
                <Button onClick={() =>{setCompartilharCodigoAmigo(false)}} style={{"color":"#dc3545"}}>
                    Voltar
                </Button>
                <Button onClick={() =>{
                    let mensagem = aplicativoDados.textoConvidarAmigos
                    mensagem = mensagem.replace('$NOME_APLICATIVO$', aplicativoDados.projectName)
                    mensagem = mensagem.replace('$CODIGO$', usuarioLogado.cliente.codigoCupomDesconto)
                    mensagem = mensagem.replace('$LINK$', aplicativoDados.urlAcesso)

                    window.location.href = `whatsapp://send?text=${mensagem.replace("&", "%26")}` 
                }} style={{"color": "white", "backgroundColor":"#28a745"}}>
                    Compartilhar
                </Button>
            </DialogActions>
            </Dialog>


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
                    // defaultValue={0}
                    id="dataNascimentoEdit"
                    label="Data Nascimento"
                    name="dataNascimentoEdit"
                    type="date"   
                    InputLabelProps={{
                        shrink: true
                    }}   
                />  
                {
                    !usuarioLogado.cliente.email.includes('@c.us')
                    &&
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
                }

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
                <Button onClick={() => {setConfiguracoesPerfilModal(false)}} style={{"color":"#dc3545"}}>
                    Cancelar
                </Button>
                <Button type="submit"
                style={{"color": "white", "backgroundColor":"#28a745"}}>
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
                <Button onClick={() => {
                    setQrCodeModal(false)
                }} >
                  Cancelar
                </Button>                
              </DialogActions>
            </Dialog>


            {aplicativoDados.tokenCashBack ? (<Dialog
              fullScreen={fullScreen}
              open={Cashback}
              aria-labelledby="cashbackModal">

              <DialogTitle id="cashbackModal">{"CashBack"}</DialogTitle>
              <DialogContent>

                <Row style={{"textAlign": "center"}}>

                    <Col xs={12} md={12} lg={12}>
                        <Button variant="contained" onClick={() => { }} style={{"background": `#28a745`, "color":"white"}} className="buttonSaldoCashBack">
                            <span style={{"fontSize": "0.75em"}}>Saldo</span>
                            <span style={{"fontSize": "1.75em"}}>{usuarioLogado.saldoCashBack}</span>
                        </Button>
                    </Col>
                    <Col xs={12} md={12} lg={12} style={{"marginTop": "25px"}}>
                        <Typography>{usuarioLogado.msgCashBack}</Typography>                            
                    </Col>
                    <Col xs={12} md={12} lg={12} style={{"marginTop": "10px"}}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            prefix="R$"
                            onChange={(e) => {
                                e.target.value = "R$ "+formatReal(getMoney(e.target.value))
                            }}
                            id="cashBackValorResgate"
                            label="Valor de Resgate"
                            name="cashBackValorResgate"
                        />  
                        <Button type="submit"
                            style={{"color": "#28a745"}}
                            onClick={
                                async () => {

                                    try {
                                        const valorSaldo = parseInt((usuarioLogado.saldoCashBack.replace('R$', '')))
                                        const valorResgate = parseInt(document.getElementById('cashBackValorResgate').value.replace('R$ ', '').replace('.', '').replace(',', '.'))
                                        //console.log("valorResgate", valorResgate, "valorSaldo", valorSaldo )
                                    
                                        if(valorResgate > valorSaldo){
                                            alertStart("Valor de resgate maior que seu saldo.", "warning")
                                            document.getElementById('cashBackValorResgate').focus()
                                            return false
                                        }else if(valorResgate < 0){
                                            alertStart("Você nao pode resgatar valor negativo.", "warning")
                                            document.getElementById('cashBackValorResgate').focus()
                                            return false
                                        }else if(!valorResgate){
                                            document.getElementById('cashBackValorResgate').focus()
                                            return false
                                        }
                                        setLoading(true)

                                        const data = {"resgateCashback": valorResgate}

                                        const response = await ResgatarCashBack(data, aplicativoDados)
                                    
                                        if(response.retornoErro){
                                            //algum erro
                                            alertStart(response.mensagem, "error")
                                        }else{ 
                                            //tudo certo
                                            alertStart(response.mensagem, "success")
                                        }

                                        setLoading(false)

                                    }
                                    catch (error) {
                                        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions ResgatarCashBack ${window.location.hostname} - ${error}`);
                                        alertStart("Procure os desenvolvedores! Erro: "+error.message, "error") 
                                        setLoading(false)
                                    }
                                }
                            }>
                            Resgatar
                        </Button>              
                    </Col>
                </Row>

              </DialogContent>
              <DialogActions style={{"justifyContent": "center"}}>  
                <Button onClick={() => {setLojasCashBack(true)}} >
                  Lojas CashBack
                </Button>  
                <Button onClick={
                    async () => {  

                        try {
                            const data = usuarioLogado.cliente.id+'/'+usuarioLogado.appNome+'/1/50/00/00'
                            const response = await ExtratoCashback(data, aplicativoDados)
                        
                            if(response.retornoErro){
                                //algum erro
                            alertStart(response.mensagem, "error")
                            }else{ 
                                //tudo certo
                                if(response.properties.success === false){
                                    setLoading(false)   
                                    alertStart(response.properties.result, "error")
                                }else{
                                    //console.log("ExtratoCashback", resposta) 
                                    setDadosRelatorioCashBack(response.properties.result.list)
                                    setRelatorioCashBack(true)
                                    setLoading(false)  
                                }
                            }
                        }
                        catch (error) {
                            Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions ExtratoCashback ${window.location.hostname} - ${error}`);
                            alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
                        }

                    }} >
                  Relatório
                </Button>                
                <Button onClick={() => {setCashback(false)}} >
                  Voltar
                </Button>                
              </DialogActions>
            </Dialog>)
            : null }


            {DadosRelatorioCashBack 
                ? 
                (<Dialog
                    fullScreen={fullScreen}
                    open={RelatorioCashBack}
                    aria-labelledby="cashbackRelatorioModal">
    
                    <DialogTitle id="cashbackRelatorioModal">{"Relatório CashBack"}</DialogTitle>
                    <DialogContent>
                                {/*
                                
                                <Row style={{"textAlign": "center"}} key={index}>
                                    <Col xs={12} md={12} lg={12} style={{"marginTop": "25px"}}>
                                        <Typography>{relatorio.properties.balance}</Typography>                            
                                    </Col>
                                </Row>
                                */}
    
                        {
                            DadosRelatorioCashBack.map((relatorio, index) => (

                                <Card className={classes.root} variant="outlined" key={index}>
                                    <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        {relatorio.properties.date} - {relatorio.properties.hour}
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                        {relatorio.properties.title}
                                        </Typography>
                                        <Typography className={classes.pos} color="textSecondary">
                                        {relatorio.properties.operation} - Tipo {relatorio.properties.type}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                        Saldo: {relatorio.properties.balance}
                                        <br/>
                                        Porcentagem de CashBack: {relatorio.properties.cashback_percentage}
                                        <br/>

                                        Pontuação: {relatorio.properties.score_transfer}
                                        <br/>

                                        Valor da Compra: {relatorio.properties.total_purchase}
                                        <br/>
                                        <br/>

                                        {relatorio.properties.protocolo}                                        
                                        <br/>

                                        
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    
    
                    </DialogContent>
                    <DialogActions>                                
                    <Button onClick={() => {setRelatorioCashBack(false)}} >
                        Voltar
                    </Button>                
                    </DialogActions>
                </Dialog>) 
                : null
            }

            {aplicativoDados.tokenCashBack  ? (<Dialog
                fullScreen={fullScreen}
                open={LojasCashBack}
                aria-labelledby="cashbackLojasModal">

                <DialogTitle id="cashbackLojasModal">{"Lojas com CashBack"}</DialogTitle>
                <DialogContent>
                    <iframe src={'https://sys.vespers.com.br/api/cliente_fiel.php?action=getPartners&mobile='+usuarioLogado.cliente.telefone}></iframe>
                </DialogContent>
                <DialogActions>                                
                <Button onClick={() => {setLojasCashBack(false)}} >
                    Voltar
                </Button>                
                </DialogActions>
            </Dialog> )
            : null}


            <Rodape valor="Perfil"></Rodape>
        </>
    );
}

