import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import { Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Alert, AlertTitle } from "@material-ui/lab";

import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { AplicativoDadosUrl, Buscardescontos } from "../../services/functions";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function GanheDescontos(props) {
  const {
    openGanheDescontos,
    setOpenGanheDescontos,
    usuario,
    temDesconto,
    cardapio,
    jaEstou,
    setConfiguracoesPerfilModal,
    setCompartilharCodigoAmigo,
    aplicativoDados,
    estabelecimentoAtual = {}, // só tem ele na tela de cardápio ou quando o aplicativo.estabelecimento é igual a 1 no perfil
    pedidoMesa,
  } = props; //parâmetros que recebe da tela de perfil e de cardápio


  const [progress, setProgress] = React.useState(10);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const history = useHistory();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClickOpen = () => {
    setOpenGanheDescontos(true);
  };

  const handleClose = () => {
    setOpenGanheDescontos(false);
  };

  const [estadoSelect, setEstadoSelect] = React.useState("");

  const handleChangeSelect = async (event) => {
    setEstadoSelect(event.target.value);
    if (event.target.value === "") {
      setDescontos([]);
      return false;
    }
    const retorno = await Buscardescontos(event.target.value, aplicativoDados);
    if (retorno.retornoErro) {
      setDescontos([]);
      return false;
    } else {
      setDescontos(retorno);
    }
  };

  const [descontos, setDescontos] = React.useState([]);

  useEffect(() => {
    setTimeout(async () => {
      if (estabelecimentoAtual.id) {
        const retorno = await Buscardescontos(
          estabelecimentoAtual.id,
          aplicativoDados
        );
        if (retorno.retornoErro) {
        } else {
          setDescontos(retorno);
        }
      }
    }, 0);
  }, []);

  const [estabelecimentos, setEstabelecimentos] = React.useState(
    aplicativoDados.estabelecimentos
  );

  const finalizarCadastro = () => {
    if (usuario?.logado) {
      if (jaEstou) {
        setConfiguracoesPerfilModal(true);
      } else {
        history.push(`/perfil/configuracao`);
      }
    } else {
      history.push(`/cadastro`);
    }
  };

  const indicarAmigo = () => {
    if (usuario?.logado) {
      if (jaEstou) {
        setCompartilharCodigoAmigo(true);
      } else {
        history.push(`/perfil/indicacao-amigos`);
      }
    } else {
      history.push(`/login`);
    }
  };

  const cartelaFidelidade = () => {
    usuario?.logado
      ? history.push(`/delivery/fidelidade`)
      : history.push(`/login`);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      onClose={handleClose}
      open={openGanheDescontos}
      style={{ zIndex: "1299" }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Descontos</DialogTitle>
      <DialogContent>
        {!estabelecimentoAtual.id && (
          <Col xs={12} md={12} lg={12} className="colSelect">
            <FormControl
              variant="outlined"
              className={classes.formControl}
              id="divSelect"
            >
              <InputLabel htmlFor="outlined-age-native-simple">
                Escolha um estabelecimento
              </InputLabel>
              <Select
                native
                value={estadoSelect}
                onChange={handleChangeSelect}
                label="Escolha um estabelecimento"
                inputProps={{
                  name: "age",
                  id: "outlined-age-native-simple",
                }}
              >
                <option aria-label="None" value="" />
                {estabelecimentos.map((estabelecimento) => (
                  <option value={estabelecimento.id}>
                    {estabelecimento.nome}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Col>
        )}

        <Col xs={12} md={12} lg={12} className="colGanheDescontos">
          <div className={classes.root}>
            { descontos.filter((desconto) => desconto.possui === true).length > 0 
              ? (
              descontos.map(
                (desconto) =>
                  desconto.possui && (
                    <Accordion
                      expanded={expanded === desconto.titulo}
                      onChange={handleChange(desconto.titulo)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <Typography className={classes.heading}>
                          {desconto.titulo}
                        </Typography>
                        <Typography className={classes.secondaryHeading}>
                          {desconto.comoGanhar}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails className="buttonFinalizeCadastro">
                        <Typography>
                          {desconto.oQueGanhar.replace("ANIVERSARIO10", "")}
                        </Typography>
                        {desconto.titulo != "Cupom de Desconto" &&
                          desconto.titulo != "Forma de Pagamento" && (
                            <Button
                              className="buttonFinalizar"
                              color="primary"
                              autoFocus
                              variant="outlined"
                              onClick={() => {
                                if (desconto.titulo === "Finalize Cadastro") {
                                  finalizarCadastro();
                                } else if (
                                  desconto.titulo === "Indicação de Amigo"
                                ) {
                                  indicarAmigo();
                                } else if (
                                  desconto.titulo === "Cartela de Fidelidade"
                                ) {
                                  cartelaFidelidade();
                                } else if (
                                  desconto.titulo === "Cupom de Desconto"
                                ) {
                                }
                              }}
                            >
                              {desconto.titulo === "Finalize Cadastro"
                                ? "Finalizar Cadastro"
                                : desconto.titulo === "Indicação de Amigo"
                                ? "Indicar um amigo"
                                : desconto.titulo === "Cartela de Fidelidade"
                                ? "Completar cartela"
                                : null}
                            </Button>
                          )}
                      </AccordionDetails>
                    </Accordion>
                  )
              )
            ) : estadoSelect != "" || estabelecimentoAtual.id ? (
              <Col xs={12} md={12} lg={12}>
                Este estabelecimento no momento não possui formas de ganhar
                descontos cadastradas.
              </Col>
            ) : null}
          </div>
        </Col>
        <Col xs={12} md={12} lg={12} className="colAlertInfo">
          {temDesconto ? (
            <Alert severity="info">
              <AlertTitle>Desconto ativo!</AlertTitle>
              Você possui um desconto de{" "}
              {cardapio.valorDesconto
                ? `${Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(cardapio.valorDesconto)}`
                : cardapio.percentualDesconto
                ? `${cardapio.percentualDesconto}%`
                : `Frete Grátis`}{" "}
              -{" "}
              <strong>
                {cardapio.cupomDesconto
                  ? cardapio.cupomDesconto.codigoCupom
                  : "Desconto referente a cartela de fidelidade"}
              </strong>
            </Alert>
          ) : null}
        </Col>
      </DialogContent>
      <DialogActions>
        <Button
          color="sucess"
          onClick={() => {
            handleClose();
          }}
          // style={
          //   {"color": '#9A153E'}
          // }
          autoFocus
          fullWidth
        >
          FECHAR
        </Button>
      </DialogActions>
    </Dialog>
  );
}
