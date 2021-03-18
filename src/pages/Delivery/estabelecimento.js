import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {  Row, Col, Container } from 'react-bootstrap';
import {
  identificarEstabelecimentoSelecionado
} from '../../services/functions';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

import './styles.css';
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);



const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    height: "100%",
    display: 'block',
    overflow: 'hidden',
    width: '100%',
  },
}));

export default function Cardapio(props) {
  
  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))
  const cardapio = JSON.parse(localStorage.getItem("cardapioCF"))
  const carrinho = JSON.parse(localStorage.getItem("carrinhoCF")) 
  const usuarioPedidoMesa = JSON.parse(localStorage.getItem("usuarioPedidoMesaCF"))


  const enderecoAtual = JSON.parse(localStorage.getItem("enderecoAtualCF"));

  const estabelecimentoAtual = JSON.parse(localStorage.getItem("estabelecimentoAtualCF"));

  const history = useHistory();

  
  const bannersStep = estabelecimentoAtual?.banners;

  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

 


  return (
    <Container className="containerEstabelecimentoComponente">

 

      <div className="EstabelecimentoComponente row">
          <div className={"divFundo " + (bannersStep?.length > 0 ? "" : " notBannerSlide") }  style={{"background":  `${aplicativoDados?.corSiteSecundaria}`}}>
          
            {bannersStep?.length > 0
            ? (
              <AutoPlaySwipeableViews
              style={{"height": "100%", "overflow": "hidden"}}
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={activeStep}
              onChangeIndex={(step) => {setActiveStep(step)}}
              enableMouseEvents
            >
              {bannersStep.map((step, index) => (
                <div key={index}>
                  {Math.abs(activeStep - index) <= 2 ? (
                    <img alt={"banner estabelecimento"} className={classes.img} src={step}/>
                  ) : null}
                </div>
              ))}
            </AutoPlaySwipeableViews>
            ) : null} 
          
        </div>

            
    </div>
    </Container>
  );
}