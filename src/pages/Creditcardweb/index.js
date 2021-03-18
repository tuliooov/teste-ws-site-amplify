import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Card,  Row, Col } from 'react-bootstrap';
import flatCard from '../../assets/payCard.png';
import gifSuccess from '../../assets/success.gif';
import { useHistory } from 'react-router-dom';

//alert
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export default function Creditcardweb(props) {
  const { success, appName, tokenEstabelecimentoPagSeguro, idEstabelecimento, clienteId, corPrincipal } = useParams() 
  
  
  const search = props.location.search;
  const params = new URLSearchParams(search); 

  const [param1, setParam1] = useState(params.get('app_name'));
  const [param2, setParam2] = useState(params.get('token_estabelecimento'));
  const [param3, setParam3] = useState(params.get('idEstabelecimento'));
  const [param4, setParam4] = useState(params.get('cliente_id'));
  const [param5, setParam5] = useState(params.get('cor_principal'));

  const [erros, setErros] = useState('');
  
      
  const [alert, setAlert] = useState({"status": false, "tipo": "success", "mesangem": ""});
  const history = useHistory();


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


  function enviarFormulario(e){
    e.preventDefault()

    var nome = document.getElementById("name").value;
    var cardnumber = document.getElementById("number").value;
    var expirationdateMonth = document.getElementById("validationMonth").value;
    var expirationdateYear = document.getElementById("validationYear").value;	
    var securitycode = document.getElementById("code").value;

    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);


    var publicKey = obterPublicKey(param2, function(publicKey){
      return generateKeyPagSeguro(publicKey, nome, cardnumber, expirationdateMonth, expirationdateYear, securitycode)
    }); //tokenLoja

    /*var keyPagSeguro = generateKeyPagSeguro(publicKey, nome, cardnumber, expirationdateMonth, expirationdateYear, securitycode);

    if(keyPagSeguro != null){
      createReturnObject(keyPagSeguro, param1, param2, param3, param4);
    }else{
      alert("Não foi possível criar o cartão de crédito");
      //mostrar mensagem de erro
    }*/
    

    //window.location.href = "http://telaTeste.html?name=" + nome + "&card=" + cardnumber;
    //document.getElementById("formulario").submit();

  }

  function resultSuccessPublicKey(objWithPublickKey, callbackSuccess){
    var keyPagSeguro = callbackSuccess(objWithPublickKey.publicKey);

    if(keyPagSeguro != null){
      createReturnObject(keyPagSeguro, param1, param2, param3, param4);
    }else{
      setErros("Não foi possível criar o cartão de crédito (key)")
      alertStart("Não foi possível criar o cartão de crédito (key)", "warning")

    }
    
  }

  function resultFailtPublicKey(){
    //exibirMensagem de erro
    setErros("Não foi possível criar o cartão de crédito")
    alertStart("Não foi possível criar o cartão de crédito", "warning")
  }

  function obterPublicKey(tokenLoja, callbackSuccess){
    var http = new XMLHttpRequest();
    var url = 'https://f3f3f6657b48.ngrok.io/clientefiel/rest/';
    var method = "comum/pagseguro/publickey/"+tokenLoja;

    //http.setRequestHeader('Content-Type', 'application/json');
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          //alert(http.responseText);
          var objWithPublickKey = JSON.parse(http.responseText);
          resultSuccessPublicKey(objWithPublickKey, callbackSuccess);
      }else if(this.readyState == 4 && this.status != 200){
        resultFailtPublicKey();
      }
    };
    http.open('GET', url + method, true);
    http.send(null);

  }

  function createReturnObject(keyPagSeguro, appName, tokenEstabelecimento, idEstabelemento, clienteId){
    var valorRetorno = JSON.stringify(
      {
       store: false,
       key_card_token: keyPagSeguro,
       app_name: appName,
       estabelecimento_id: idEstabelemento,
       cliente_id: clienteId
      });

    valorRetorno = btoa(btoa(valorRetorno));

    window.location.href = `http://${window.location.host}/card.html?creditcardweb=${valorRetorno}` 
  }

  function generateKeyPagSeguro(publicKey, nome, cardnumber, expirationdateMonth, expirationdateYear, securitycode){

    var card = window.PagSeguro.encryptCard({
        publicKey: publicKey,
        holder: nome,
        number: cardnumber,
        expMonth: expirationdateMonth,
        expYear: expirationdateYear,
       securityCode: securitycode
    });

    if(card.hasErrors){
      // mostrar Erros
      setErros("Erro")
      return null;
    }
    console.log(card);
    var encrypted = card.encryptedCard;
    return encrypted;
  }



  const handleCard = () => {
    const data = {
      publicKey: tokenEstabelecimentoPagSeguro,
      holder: document.getElementById("name").value,
      number: document.getElementById("number").value,
      expMonth: document.getElementById("validationMonth").value,
      expYear: document.getElementById("validationYear").value, 
      securityCode: document.getElementById("code").value,
    }
    var card = window.PagSeguro.encryptCard(data);

    console.log(card)

    if(card?.errors?.length){
      const error = card.errors[0];
      console.log('error', error)
      switch (error.code) {
        case "INVALID_NUMBER":
            alertStart("Número do cartão está invalido", "error")
          break;
        case "INVALID_SECURITY_CODE":
            alertStart("Código de segurança está invalido", "error")
          break;
        case "INVALID_NUMBER":
            alertStart("Número do cartão está invalido", "error")
          break;

        case "INVALID_EXPIRATION_MONTH":
            if(data.expMonth.length < 2 || data.expMonth.length > 2)
              alertStart("Mês de validade está invalido. A quantidade de digitos é 2 !", "error")
            else
            alertStart("Mês de validade está invalido", "error")
          break;

        case "INVALID_EXPIRATION_YEAR":
            if(data.expYear.length < 2 || data.expYear.length > 4)
              alertStart("Ano de validade está invalido. A quantidade de digitos é 4 !", "error")
            else
              alertStart("Ano de validade está invalido", "error")
          break;
        case "INVALID_HOLDER":
            alertStart("Nome impresso no cartão está invalido", "error")
          break;
        default:
            alertStart(error.message, "error")
          break;
      }
    }else {
      const encrypted = card.encryptedCard;
      // history.push(`/creditcardweb/success?token=${btoa(btoa(btoa(encrypted)))}`)
      history.push(`/creditcardweb/success?token=${btoa(btoa(btoa(card)))}`)
      console.log()
    }
      
      
    
    
    


  }

  if(success){
    return (
      <Row style={{
        "position": "fixed",
        "display": "flex",
        "margin": 0,
        "padding": 0,
        "height": "100vh",
        "background": "#32bc43",
        "width": "100vw",
      }}>
        <Col  xs={12} md={12} lg={12}  style={{
          "margin": 0,
          "padding": 0,
          "display": "flex",
          "justifyContent": "center",
          "alignSelf": "center"
        }}>
          <img src={gifSuccess}/>
        </Col>
      </Row>
    )
  }
  
  return (
      <Row style={{"padding": "2em 2em 0 2em", "margin": "0"}}>
        <Snackbar open={alert.status} autoHideDuration={6000} onClose={alertClose}>
            <Alert onClose={alertClose} severity={alert.tipo}>
              {alert.mesangem}
            </Alert>
        </Snackbar>

        
        <Col  xs={12} md={12} lg={12}  >
          <TextField 
            style={{"backgroundColor": "white"}}
            variant="outlined"
            margin="normal"
            fullWidth
            id="name"
            label="Nome Impresso no Cartão"
            name="name"
          />
        </Col>

        <Col  xs={12} md={12} lg={12}  >
          <TextField 
            style={{"backgroundColor": "white"}}
            variant="outlined"
            margin="normal"
            type={"text"}
            pattern="[0-9]*"
            fullWidth
            id="number"
            label="Numero do Cartão"
            name="number"
          />
        </Col>
        
        <Col  xs={6} md={6} lg={6}  >
          
          <TextField 
            type="text" pattern="[0-9]*" 
            style={{"backgroundColor": "white"}}
            variant="outlined"
            margin="normal"
            fullWidth
            id="validationMonth"
            label="Mes"
            name="validationMonth"
          />
        </Col>
        <Col  xs={6} md={6} lg={6}  >
          <TextField 
            style={{"backgroundColor": "white"}}
            variant="outlined"
            margin="normal"
            fullWidth
            type="text" pattern="[0-9]*" 
            id="validationYear"
            label="Ano"
            name="validationYear"
          />
        </Col>
        <Col  xs={12} md={12} lg={12}  >
          <TextField 
            style={{"backgroundColor": "white"}}
            type="text" pattern="[0-9]*" 
            variant="outlined"
            margin="normal"
            fullWidth
            id="code"
            label="Código"
            name="code"
          />
        </Col>
        <Col  xs={12} md={12} lg={12}  >
          <Typography> {erros} </Typography>
        </Col>
        <Col  xs={12} md={12} lg={12} style={{"zIndex": 2}} >
          <Button fullWidth onClick={enviarFormulario} style={{"color": "white", "backgroundColor": "#28a745"}}>
            Cadastrar
          </Button>
        </Col>
        {/* <Col  xs={12} md={12} lg={12} style={{"zIndex": 2}} >
          <Button fullWidth onClick={handleBack} style={{"color": "white", "backgroundColor": "#6c757d", "marginTop":"1em"}}>
            Voltar
          </Button>
        </Col> */}
        <Col  xs={12} md={12} lg={12} style={{"zIndex": 1}}>
          <img src={flatCard} style={{
                "width": "100%",
          }}/>
        </Col>
      </Row>
  );
}