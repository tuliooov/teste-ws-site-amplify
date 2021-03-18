
import React, {Component, useState, useEffect } from 'react'
import QrReader from 'react-qr-reader'
import * as Sentry from "@sentry/react";

import { Link,useHistory } from 'react-router-dom';
import './styles.css';
import Cabecalho from '../Global/cabecalho';
import Rodape from '../Global/rodape';
import CropFreeIcon from '@material-ui/icons/CropFree';
import Avatar from '@material-ui/core/Avatar';
import DialpadIcon from '@material-ui/icons/Dialpad';
import { Card, Row, Col, Container, Carousel } from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';


import {
    RegistrarSeloSeguro2,
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

import flatMesa from '../../assets/flatMesa.png'
import CardContent from '@material-ui/core/CardContent';


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


export default function Perfil() {
    const [estabelecimentoAtual, setEstabelecimentoAtual] = useState(JSON.parse(localStorage.getItem("estabelecimentoAtualCF")));
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const history = useHistory();
    const classes = useStyles();
    const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))
    //console.log("usuarioLogado", usuarioLogado)

    const [configuracoesPerfilModal, setConfiguracoesPerfilModal] = React.useState(false);
    const [qrCodeModal, setQrCodeModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    

    
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
                    }
                } catch (error) {
                    setLoading(true)
                    setQrCodeModal(false)        
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



            <div className="container container-perfil">
                <Container className="">
                    <Row>
                      <Col xs={12} md={12} lg={12}   style={{"width": "100%",  "textAlign": "center"}}>

                           <img src={estabelecimentoAtual.urlLogo} style={{"width": "100px"}}/>
                           <img src={flatMesa} style={{"maxWidth": "100%", "maxHeight": "300px"}}/>
                           <Typography variant="h4" component="h2" style={{"marginTop": "0.5em"}}>
                                Conecte-se a mesa
                            </Typography>
                            <Typography  style={{"fontSize": "18px", "margin": "0.5em 0 0.5em 0"}} >
                                Na mesa do estabelecimento {estabelecimentoAtual.nome} provavelmente haverá um QRCode ou Código para se conectar a mesa.
                            </Typography>

                        </Col>

                        <Col xs={12} md={12} lg={12}   style={{"width": "100%",  "textAlign": "center"}}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="codigo"
                                label="Código da Mesa"
                                name="codigo"
                                autoFocus
                            />
                        </Col>
                        <Col xs={12} md={12} lg={12}   style={{"width": "100%",  "textAlign": "center"}}>
                            <Button
                                type="button"
                                fullWidth
                                onClick={() => {
                                    const codigo = document.getElementById("codigo").value
                                    var codigo2 = ((parseInt(codigo) - 5555) + "")
                                    var mesa = codigo2.substring(0,1) + codigo2.substring(4,5)

                                    if(mesa > 0 && mesa < 51){
                                        setLoading(true)
                                        window.location.href = `https://${aplicativoDados.urlAcesso}/?loja=${estabelecimentoAtual.id}&mesa=${mesa}`
                                    }
                                    console.log('mesa', mesa)
                                }}
                                variant="contained"
                                style={{"margin": "0 0 1em 0", "background":`${aplicativoDados.corSitePrimaria}`, "color":"white"}}
                            >
                            <DialpadIcon style={{"fontSize": "25px","marginRight": "10px"}}/>  Enviar Código
                            </Button>
                        </Col>


                        <Col xs={12} md={12} lg={12}   style={{"width": "100%",  "textAlign": "center"}}>
                            <Button
                                type="button"
                                fullWidth
                                onClick={() => {
                                    setQrCodeModal(true)
                                }}
                                variant="contained"
                                style={{"background":`${aplicativoDados.corSitePrimaria}`, "color":"white"}}
                            >
                            <AiOutlineQrcode style={{"fontSize": "25px","marginRight": "10px"}}/>Ler QR Code
                            </Button>
                        </Col>

                        <Col xs={12} md={12} lg={12}   style={{"marginTop":"1em", "width": "100%",  "textAlign": "center"}}>
                            <Link to={`/login`} variant="body2" style={{"color":`${aplicativoDados.corSitePrimaria}`}}>
                                {"Voltar"}
                            </Link>
                        </Col>
                        
                        
                    </Row>
                    
                </Container>
            </div>






            <Dialog
              fullScreen={fullScreen}
              open={qrCodeModal}
              aria-labelledby="qrCodeModal">

              <DialogTitle id="qrCodeModal">{"QRCode de Mesa"}</DialogTitle>
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


        </>
    );
}

