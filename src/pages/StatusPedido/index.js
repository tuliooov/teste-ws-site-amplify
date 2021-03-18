import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import * as Sentry from "@sentry/react";
import { ObterStatusPedido, CancelarPedido } from "../../services/functions";

import PopUpDoacao from "./popupDoacao";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import { Row, Container } from "react-bootstrap";

import Cabecalho from "../Global/cabecalho";

import api from "../../services/api";

import "./styles.css";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 999,
    color: "#fff",
  },
  alerta: {
    zIndex: theme.zIndex.drawer + 9999,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

/*
    AGUARDANDO_ACEITACAO = 0;
    ACEITO = 1;
    CONFIRMACAO_VISUALIZADA = 2;
    EM_ENTREGA = 3;
    ENTREGUE = 4;
    PAGO = 5;
    PRONTO = 6;
    EM_PRODUCAO = 7;
    AGUARDANDO ATUALIZAR STATUS = 10;

    CANCELADO_PELO_DISTRIBUIDOR = -1;
    CANCELADO_PELO_CLIENTE = -2;
    NAO_ENTREGUE = -3;
    EXPIRADO = -4;
    CHARGEBACK = -10;


*/

function getSteps(statusPedido) {
  switch (statusPedido) {
    case 10:
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 7:
      return [
        "Pedido Enviado",
        "Aguardando Aceitação",
        "Aceito",
        "Em Produção",
        "Saiu para Entrega",
        "Entregue",
      ];
    case 6:
      return [
        "Pedido Enviado",
        "Aguardando Aceitação",
        "Aceito",
        "Em Produção",
        "Pronto para Retirada",
        "Entregue",
      ];
    case -1:
    case -2:
    case -3:
    case -4:
    case -5:
    case -10:
      return [
        "Pedido Enviado",
        "Aguardando Aceitação",
        "Cancelado",
        "Saiu para Entrega",
        "Entregue",
      ];
  }
}

function getStepContent(step, statusPedido) {
  switch (statusPedido) {
    case 0: //aguardando aceitação
      return `Seu pedido foi enviado! Estamos aguardando o estabelecimento aceitar seu pedido!`;

    case 10: //aguardando aceitação
      return `Aguarde atualização do status`;

    case 1: //aceito
    case 2: //visualizado
      return `Seu pedido foi aceito! Vamos enviar seu pedido para a produção!`;

    case 3: //em entrega
      return `Seu pedido foi produzido! Nosso entregador acabou de sair com seu pedido. Fique atento para receber!`;

    case 4: //entregue
      return `Seu pedido foi entregue! Obrigado pela preferencia, estamos sempre a disposição.`;

    case 5: //pago
      return `Seu pedido já foi pago!`;

    case 6: //pronto pra retirada
      return `Seu pedido está pronto para retirada!`;

    case 7: //em producao
      return `Seu pedido está em produção!`;

    case -1:
      return `O estabelecimento cancelou seu pedido!`;
    case -2:
      return `Você mesmo cancelou o pedido!`;
    case -3:
      return `O pedido não foi entregue!`;
    case -4:
      return `O pedido expirou por ficar muito tempo aguardando aceitação!`;
    case -5:
    case -10:
      return `Houve uma falha no pagamento!`;
    default:
      return "erro";
  }
}

export default function Status() {
  const { idPedido, statusInicial } = useParams();

  if (parseInt(statusInicial) == 0) {
    localStorage.setItem("atualizarUsuarioCF", true);
  }

  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"));
  const history = useHistory();

  const [loading, setLoading] = React.useState(false);

  const [statusPedido, setStatusPedido] = React.useState(
    parseInt(statusInicial)
  );

  const [alert, setAlert] = useState({
    status: false,
    tipo: "success",
    mesangem: "",
  });

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const alertStart = (msg, tipo) => {
    setAlert({ status: true, tipo: tipo, mesangem: msg });
  };

  const alertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert({ status: false, tipo: alert.tipo, mesangem: alert.mesangem });
  };

  const verificarStatus = async () => {
    try {
      const response = await ObterStatusPedido(idPedido, aplicativoDados);

      if (response.retornoErro) {
        //algum erro
        alertStart(response.mensagem, "error");
      } else {
        //tudo certo
        if (response.status == 0) {
          localStorage.setItem("atualizarUsuarioCF", true);
        }
        setStatusPedido(response.status);
      }
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+
        `NotFunctions verificarStatus ${window.location.hostname} - ${error}`
      );
      alertStart("Procure os desenvolvedores! Erro: " + error.message, "error");
    }
  };

  const cancelarPedido = async () => {
    try {
      setLoading(true);
      const data = {
        id: idPedido,
        token: `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
        appNome: aplicativoDados.appNome,
      };
      const response = await CancelarPedido(data, aplicativoDados);

      if (response.retornoErro) {
        //algum erro
        alertStart(response.mensagem, "error");
        setLoading(false);
      } else {
        //tudo certo
        alertStart("Pedido cancelado", "success");

        const pedidoCancelado = JSON.parse(
          localStorage.getItem("PedidoCanceladoBackupCF")
        );
        localStorage.setItem(
          "carrinhoCF",
          JSON.stringify(pedidoCancelado.carrinho)
        );
        localStorage.setItem(
          "usuarioCF",
          JSON.stringify(pedidoCancelado.usuario)
        );
        localStorage.removeItem("ultimoPedidoCF");

        setTimeout(() => {
          history.goBack();
        }, 3000);
      }
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+
        `NotFunctions cancelarPedido ${window.location.hostname} - ${error}`
      );
      alertStart("Procure os desenvolvedores! Erro: " + error.message, "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      verificarStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  var stepStatus = 0;
  switch (statusPedido) {
    case 10:
      stepStatus = 0;
      break;
    case 0: //aguardando aceitação
      stepStatus = 1; //aguardando aceitacao
      break;
    case 1: //aceito
    case 2: //visualização
      stepStatus = 2; //aceito
      break;

    case 5: //pago
    case 7: //em producao
      stepStatus = 3; //em producao
      break;

    case 3: //em entrega
    case 6: //pronto pra retirada
      stepStatus = 4; //saiu para entrega
      break;

    case 4: //entregue
      stepStatus = 5; //entegue
      break;

    case -1:
    case -2:
    case -3:
    case -4:
    case -5:
    case -10:
      stepStatus = 2; //cancelado
      break;
  }

  //const [activeStep, setActiveStep] = React.useState(stepStatus);

  const steps = getSteps(statusPedido);

  const classes = useStyles();

  return (
    <>
      <Cabecalho voltar={true} produtoNome={`#${idPedido}`}></Cabecalho>
      {loading && (
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      <Snackbar
        open={alert.status}
        className={classes.alerta}
        autoHideDuration={6000}
        onClose={alertClose}
      >
        <Alert onClose={alertClose} severity={alert.tipo}>
          {alert.mesangem}
        </Alert>
      </Snackbar>

      <PopUpDoacao aplicativoDados={aplicativoDados} />

      <div className="container container-statusPedido">
        <Container className="containerStatusPedido">
          <Row>
            <div className={classes.root}>
              <Stepper
                activeStep={stepStatus}
                orientation="vertical"
                style={{ backgroundColor: "#f8f8f8" }}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      <Typography>
                        {getStepContent(index, statusPedido)}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </div>
          </Row>

          <Row>
            <Typography
              style={{ margin: "2em 0.5em 0.5em 0.5em", textAlign: "center" }}
            >
              Você só pode cancelar o pedido caso ele ainda não tenha sido
              aceito.
            </Typography>
            <Button
              fullWidth
              disabled={!(statusPedido === 0 || statusPedido === 10)}
              // variant="contained"
              onClick={cancelarPedido}
              style={
                !(statusPedido === 0 || statusPedido === 10)
                  ? { margin: "0em 0.5em 0.5em 0.5em" }
                  : { margin: "0em 0.5em 0.5em 0.5em", color: "#dc3545" }
              }
              className={classes.submit}
            >
              Cancelar Pedido
            </Button>
          </Row>
        </Container>
      </div>
    </>
  );
}
