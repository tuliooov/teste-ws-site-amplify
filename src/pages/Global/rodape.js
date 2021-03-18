import React from "react";
import { useHistory } from "react-router-dom";
/*import { RiShoppingBag3Line, RiUserLocationLine, RiHeartLine } from 'react-icons/ri';

import { Navbar, Col, Row } from 'react-bootstrap';*/
import { identificarEstabelecimentoSelecionado } from "../../services/functions";

import { createMuiTheme } from "@material-ui/core/styles";
import MotorcycleIcon from "@material-ui/icons/Motorcycle";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import PersonIcon from "@material-ui/icons/Person";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import RoomServiceIcon from "@material-ui/icons/RoomService";
import StoreIcon from "@material-ui/icons/Store";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

import "./styles.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  svg: {
    color: "#fff",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function Rodape(props) {
  const [estabelecimentoAtual, setEstabelecimentoAtual] = React.useState(
    JSON.parse(localStorage.getItem("estabelecimentoAtualCF"))
  );
  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"));
  const classes = useStyles();
  const [value, setValue] = React.useState(props.valor);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const history = useHistory();

  var scrollPos = 0;
  window.addEventListener("scroll", function () {
    if (document.getElementsByClassName("RodapeComponente").length > 0) {
      if (document.body.getBoundingClientRect().top >= scrollPos) {
        //document.getElementsByClassName('RodapeComponente')[0].style.height = "56px"
        //document.getElementsByClassName('cabecalhoApp')[0].style.height = "0px"
      } else {
        //document.getElementsByClassName('cabecalhoApp')[0].style.height = "56px"
        //document.getElementsByClassName('RodapeComponente')[0].style.height = "0px"
      }
      scrollPos = document.body.getBoundingClientRect().top;
    }
  });

  const theme = createMuiTheme({
    palette: {
      primary: {
        light: `${
          !aplicativoDados?.corSiteSecundaria ||
          aplicativoDados?.corSiteSecundaria ===
            aplicativoDados?.corSitePrimaria
            ? "#6c757d"
            : aplicativoDados?.corSiteSecundaria
        }`,
        main: `${
          !aplicativoDados?.corSiteSecundaria ||
          aplicativoDados?.corSiteSecundaria ===
            aplicativoDados?.corSitePrimaria
            ? "#6c757d"
            : aplicativoDados?.corSiteSecundaria
        }`,
        // dark: will be calculated from palette.secondary.main,
        contrastText: `#000000`,
      },
      secondary: {
        light: `${
          !aplicativoDados?.corSiteSecundaria
            ? "#6c757d"
            : aplicativoDados?.corSiteSecundaria
        }`,
        main: `${
          !aplicativoDados?.corSitePrimaria
            ? "#6c757d"
            : aplicativoDados?.corSitePrimaria
        }`,
        contrastText: `#fff`,
      },
    },
  });

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"));
  const usuarioPedidoMesa = JSON.parse(
    localStorage.getItem("usuarioPedidoMesaCF")
  );

  //PEDIDO MESA
  if (usuarioPedidoMesa?.logado) {
    return <div className="RodapeComponente"></div>;
  } else if (usuarioLogado?.logado) {
    return (
      <div className="RodapeComponente" id="RodapeComponente">
        <ThemeProvider theme={theme}>
          <BottomNavigation
            value={value}
            onChange={handleChange}
            className={classes.root}
            style={{ backgroundColor: `${aplicativoDados?.corSitePrimaria}` }}
          >
            <BottomNavigationAction
              onClick={() => {
                if (value !== "Delivery")
                  history.push(
                    `/delivery${identificarEstabelecimentoSelecionado(
                      aplicativoDados
                    )}`
                  );
              }}
              label={
                aplicativoDados.appNome === "gessominas"
                  ? "Produtos"
                  : "Cardápio"
              }
              className={classes.svg}
              value="Delivery"
              icon={
                aplicativoDados.appNome === "gessominas" ? (
                  <ShoppingCartIcon />
                ) : (
                  <RoomServiceIcon />
                )
              }
            />

            {aplicativoDados?.apenasDelivery === false && (
              <BottomNavigationAction
                onClick={() => {
                  if (value !== "Fidelidade")
                    history.push(`/delivery/fidelidade`);
                }}
                label="Fidelidade"
                className={classes.svg}
                value="Fidelidade"
                icon={<LoyaltyIcon />}
              />
            )}

            {usuarioLogado.estabelecimentos.length > 1 ? (
              <BottomNavigationAction
                onClick={() => {
                  if (value !== "Estabelecimento")
                    history.push(`/estabelecimento`);
                }}
                label="Lojas"
                className={classes.svg}
                value="Estabelecimento"
                icon={<StoreIcon />}
              />
            ) : (
              <BottomNavigationAction
                onClick={() => {
                  if (value !== "Endereco")
                    history.push(
                      `/delivery/enderecos${identificarEstabelecimentoSelecionado(
                        aplicativoDados
                      )}`
                    );
                }}
                label="Endereço"
                className={classes.svg}
                value="Endereco"
                icon={<LocationOnIcon />}
              />
            )}

            <BottomNavigationAction
              onClick={() => {
                if (value !== "Perfil") history.push(`/perfil`);
              }}
              label="Perfil"
              className={classes.svg}
              value="Perfil"
              icon={<PersonIcon />}
            />
          </BottomNavigation>
        </ThemeProvider>
      </div>
    );
  } else {
    return (
      <div className="RodapeComponente" id="RodapeComponente">
        <ThemeProvider theme={theme}>
          <BottomNavigation
            value={value}
            onChange={handleChange}
            className={classes.root}
            style={{ backgroundColor: `${aplicativoDados?.corSitePrimaria}` }}
          >
            <BottomNavigationAction
              onClick={() => {
                if (
                  JSON.parse(localStorage.getItem("estabelecimentoAtualCF"))
                    ?.id &&
                  value !== "Delivery"
                ) {
                  history.push(
                    `/delivery${identificarEstabelecimentoSelecionado(
                      aplicativoDados
                    )}`
                  );
                }
              }}
              label={
                aplicativoDados.appNome === "gessominas"
                  ? "Produtos"
                  : "Cardápio"
              }
              className={classes.svg}
              value="Delivery"
              icon={
                aplicativoDados.appNome === "gessominas" ? (
                  <ShoppingCartIcon />
                ) : (
                  <RoomServiceIcon />
                )
              }
            />

            {aplicativoDados?.estabelecimentos?.length > 1 && (
              <BottomNavigationAction
                onClick={() => {
                  if (
                    JSON.parse(localStorage.getItem("estabelecimentoAtualCF"))
                      ?.id &&
                    value !== "Estabelecimento"
                  ) {
                    history.push(`/lojas`);
                  }
                }}
                label="Lojas"
                className={classes.svg}
                value="Estabelecimento"
                icon={<StoreIcon />}
              />
            )}

            <BottomNavigationAction
              onClick={() => {
                if (value !== "Login") {
                  if (
                    !!JSON.parse(localStorage.getItem("carrinhoCF"))?.pedido
                      ?.itens
                  ) {
                    localStorage.setItem(
                      "backupItensCarrinhoCF",
                      JSON.stringify(
                        JSON.parse(localStorage.getItem("carrinhoCF"))?.pedido
                          .itens
                      )
                    );
                  }
                  history.push(
                    `/login`
                  );
                }
              }}
              label="Login"
              className={classes.svg}
              value="Login"
              icon={<PersonIcon />}
            />
          </BottomNavigation>
        </ThemeProvider>
      </div>
    );
  }
}
