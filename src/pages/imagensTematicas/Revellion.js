import React, {useState} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Card,  Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import AlertFixo from '@material-ui/lab/Alert';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';


import stories from '../../assets/geradorDeImagens/revellion/1920x1080.jpg';
import feed from '../../assets/geradorDeImagens/revellion/1500x1500.jpg';

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

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));


function download(imageURL, nameDownload){  

  const a = document.createElement("a");
  a.href = imageURL
  a.download = nameDownload;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
} 

export default class Revellion extends React.Component {
  
  render() {

    
    const logoEstabelecimento = new Image();            
    logoEstabelecimento.src = this.props.logo;
    
    
    const backGroundImage1920x1080 = new Image();            
    backGroundImage1920x1080.src = stories

    const backGroundImage1500x1500 = new Image();            
    backGroundImage1500x1500.src = feed

    var s = 0;
    var f = 0;
    
    function criarStories(){
      if(s >= 2){
        console.log('criar')
        const canvas = document.createElement('canvas');
        canvas.height = 1920;
        canvas.width = 1080;
        const context = canvas.getContext("2d")
        context.drawImage(backGroundImage1920x1080, 0, 0)
        context.drawImage(logoEstabelecimento, 340, 250, 400, 400);

        var texto = document.getElementById('opcoes').value

        if(texto === "LINK"){
          context.font = "bold 55px Arial";
          context.fillStyle = "BLACK";
          context.textAlign = "center";
          texto = window.location.hostname
          context.fillText(texto, 540, 1700);

        }else if(texto.includes("CUPOM_")){
          context.font = "bold 50px Arial";
          context.fillStyle = "BLACK";
          context.textAlign = "center";
          context.fillText("CUPOM", 540, 1660);
          
          context.font = "bold 80px Arial";
          context.fillStyle = "BLACK";
          context.textAlign = "center";
          texto = texto.replace("CUPOM_", "")
          context.fillText(texto, 540, 1740);

        }else if(texto === "FRASEPEQUENA"){
          context.font = "bold 55px Arial";
          context.fillStyle = "BLACK";
          context.textAlign = "center";
          context.fillText("PARA VOCÊ E A", 540, 1700);
          context.fillText("TODOS OS SEUS FAMILIARES.", 540, 1760);

        }
        

        context.fill();
        const dataURL = canvas.toDataURL()
        document.getElementById('loadingImageStories').style.display = "none"
        document.getElementById('imageGeradaStories').src = dataURL
        document.getElementById('notLoadingImageStories').style.display = "block"
        document.getElementById('notLoadingOpcoes').style.display = "block"

        

      } 
    }

    function criarFeed(){
      if(f >= 2){
        console.log('criar')
        const canvas = document.createElement('canvas');
        canvas.height = 1500;
        canvas.width = 1500;
        const context = canvas.getContext("2d")
        context.drawImage(backGroundImage1500x1500, 0, 0)
        context.drawImage(logoEstabelecimento, 600, 100, 300, 300);


        var texto = document.getElementById('opcoes').value

        if(texto === "LINK"){
          context.font = "bold 75px Arial";
          context.fillStyle = "BLACK";
          context.textAlign = "center";
          texto = window.location.hostname
          context.fillText(texto, 750, 1375);

        }else if(texto.includes("CUPOM_")){
          context.font = "bold 70px Arial";
          context.fillStyle = "BLACK";
          context.textAlign = "center";
          context.fillText("CUPOM", 750, 1330);
          
          context.font = "bold 100px Arial";
          context.fillStyle = "BLACK";
          context.textAlign = "center";
          texto = texto.replace("CUPOM_", "")
          context.fillText(texto, 750, 1430);

        }else if(texto === "FRASEPEQUENA"){
          context.font = "bold 70px Arial";
          context.fillStyle = "BLACK";
          context.textAlign = "center";
          context.fillText("PARA VOCÊ E A", 750, 1330);

          context.font = "bold 80px Arial";
          context.fillText("TODOS OS SEUS FAMILIARES.", 750, 1430);

        }
        


        

        context.fill();
        const dataURL = canvas.toDataURL()
        document.getElementById('loadingImageFeed').style.display = "none"
        document.getElementById('imageGeradaFeed').src = dataURL
        document.getElementById('notLoadingImageFeed').style.display = "block"
        document.getElementById('notLoadingOpcoes').style.display = "block"

      }
    }


    backGroundImage1920x1080.onload = () => {s++; criarStories()}

    backGroundImage1500x1500.onload = () => {f++; criarFeed()}

    logoEstabelecimento.onload = () => {s++; f++; criarStories(); criarFeed()}


    return(
      <Row>
        <Col xs={12} md={12} lg={12} style={{"margin": "1em 0"}}>
        <AlertFixo severity={"warning"}>
          Lembre-se: Caso seja um cupom, você precisa criar no sistema administrativo.
        </AlertFixo>    
        </Col>
        <Col xs={12} md={12} lg={12} style={{"margin": "1em 0"}}>
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
        </Col>
        <Col xs={12} md={6} lg={6} style={{"margin": "1em 0"}}>
          <CircularProgress id="loadingImageStories"  color="inherit" />
          <span id="notLoadingImageStories" style={{"display": "none"}}>
          <Button
              fullWidth
              onClick={async () => {
                download(await document.getElementById('imageGeradaStories').src, "blackFriday-1080x1920")  
              }}
              variant="contained">Baixar Stories</Button>
            <img ref="image" style={{"width": "100%"}} id="imageGeradaStories" className="hidden" />
           
          </span>
         
        </Col>
        <Col xs={12} md={6} lg={6} style={{"margin": "1em 0"}}>
          <CircularProgress id="loadingImageFeed" color="inherit" />
          <span id="notLoadingImageFeed" style={{"display": "none"}}>
            <Button
              fullWidth
              onClick={async () => {
                download(await document.getElementById('imageGeradaFeed').src, "blackFriday-1500x1500")  
              }}
              variant="contained">Baixar Feed</Button>
            <img ref="image" style={{"width": "100%"}} id="imageGeradaFeed" className="hidden" />
          </span>
        </Col>
      </Row>
    )
  }
}