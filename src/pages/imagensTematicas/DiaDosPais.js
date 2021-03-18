import React, {useState} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Card,  Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';


import stories_diaDosPais from '../../assets/geradorDeImagens/diaDosPais/1920x1080.jpg';
import stories_bigode_diaDosPais from '../../assets/geradorDeImagens/diaDosPais/bigode1920x1080.png';
import feed_diaDosPais from '../../assets/geradorDeImagens/diaDosPais/1500x1500.jpg';
import feed_bigode_diaDosPais from '../../assets/geradorDeImagens/diaDosPais/bigode1500x1500.png';

function download(imageURL, nameDownload){  

  const a = document.createElement("a");
  a.href = imageURL
  a.download = nameDownload;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
} 

export default class DiaDosPais extends React.Component {
  
  componentDidMount() {
    const logoEstabelecimento = new Image();            
    logoEstabelecimento.src = this.props.logo;
    
    
    const backGroundImage1920x1080 = new Image();            
    backGroundImage1920x1080.src = stories_diaDosPais
    const bigode1920x1080 = new Image();            
    bigode1920x1080.src = stories_bigode_diaDosPais

    const backGroundImage1500x1500 = new Image();            
    backGroundImage1500x1500.src = feed_diaDosPais
    const bigode1500x1500 = new Image();            
    bigode1500x1500.src = feed_bigode_diaDosPais

    var s = 0;
    var f = 0;
    
    function criarStories(){
      if(s >= 3){
        console.log('criar')
        const canvas = document.createElement('canvas');
        canvas.height = 1920;
        canvas.width = 1080;
        const context = canvas.getContext("2d")
        context.drawImage(backGroundImage1920x1080, 0, 0)
        context.drawImage(logoEstabelecimento, 395, 90, 300, 300);
        context.drawImage(bigode1920x1080, 0, 0)
        context.fill();
        const dataURL = canvas.toDataURL()
        document.getElementById('loadingImageStories').style.display = "none"
        document.getElementById('imageGeradaStories').src = dataURL
        document.getElementById('notLoadingImageStories').style.display = "block"

      }
    }

    function criarFeed(){
      if(f >= 3){
        console.log('criar')
        const canvas = document.createElement('canvas');
        canvas.height = 1500;
        canvas.width = 1500;
        const context = canvas.getContext("2d")
        context.drawImage(backGroundImage1500x1500, 0, 0)
        context.drawImage(logoEstabelecimento, 580, 90, 350, 350);
        context.drawImage(bigode1500x1500, 0, 0)
        context.fill();
        const dataURL = canvas.toDataURL()
        document.getElementById('loadingImageFeed').style.display = "none"
        document.getElementById('imageGeradaFeed').src = dataURL
        document.getElementById('notLoadingImageFeed').style.display = "block"
      }
    }


    backGroundImage1920x1080.onload = () => {s++; criarStories()}
    bigode1920x1080.onload = () => {s++; criarStories()}

    backGroundImage1500x1500.onload = () => {f++; criarFeed()}
    bigode1500x1500.onload = () => {f++; criarFeed()}

    logoEstabelecimento.onload = () => {s++; f++; criarStories(); criarFeed()}

    
  }
  render() {

    return(
      <Row>
        <Col xs={12} md={6} lg={6} style={{"margin": "1em 0"}}>
          <CircularProgress id="loadingImageStories"  color="inherit" />
          <span id="notLoadingImageStories" style={{"display": "none"}}>
          <Button
              fullWidth
              onClick={async () => {
                download(await document.getElementById('imageGeradaStories').src, "diaDosPais-1080x1920")  
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
                download(await document.getElementById('imageGeradaFeed').src, "diaDosPais-1500x1500")  
              }}
              variant="contained">Baixar Feed</Button>
            <img ref="image" style={{"width": "100%"}} id="imageGeradaFeed" className="hidden" />
            
          </span>
        </Col>
      </Row>
    )
  }
}