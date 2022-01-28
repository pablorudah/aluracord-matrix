import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import ContentLoader from "react-content-loader";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyNzY1NSwiZXhwIjoxOTU4OTAzNjU1fQ.zVYGpVOOHaoU8HqYlCMvU4cglRdlSOHdP2_Vl5-rFwM";
const SUPABASE_URL = "https://vsnawrvtcsadetnxybmd.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        console.log("Dados da consulta:", data);
        setListaDeMensagens(data);
      });
  }, []);

  /* 
    Usuário
    - Usuário digita no campo textarea
    - Aperta enter para enviar
    - Tem que adicionar o texto escrito na listagem(um array, lista, ou uma estrutura semelhante)
    -

    Dev
    - [X] Campo criado
    - [X] Vamos usar o onChange, usar o useState (ter if pra o caso em que o enter seja digitado, limpar a variável)
    - [X] Lista de Mensagens  
  */

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      // id: listaDeMensagens.length + 1,
      de: 'vanessametonini',
      texto: novaMensagem,
    };

    //Chamada de um backend
    supabaseClient
      .from("mensagens")
      .insert([
        //Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
        mensagem,
      ])
      .then(({ data }) => {
        console.log("Criando mensagem: ", data);
        setListaDeMensagens([data[0], ...listaDeMensagens]);
      });

    setMensagem('');
  }

  //Inserido botão para deletar mensagem
  function handleDeletarMensagem(event) {
    const id = Number(event.target.dataset.id);
    const listaDeMensagemFiltrada = listaDeMensagens.filter(
      (mensagemFiltrada) => {
        return mensagemFiltrada.id != id;
      }
    );

    supabaseClient
      .from("mensagens")
      .delete()
      .match({ id: id })
      .then(({ data }) => {
        console.log("mensagem deletada: ", data);
        //setListaDeMensagens([
        //data[0],
        //...listaDeMensagens,
        //]);
      });

    //Aqui setei uma nova lista filtrada com a mensagem que foi deletada
    setListaDeMensagens(listaDeMensagemFiltrada);
  }

  //Desafio Proposto na aula 3 - botão de OK para enviar mensagem
  function handleSubmit(event) {
    event.preventDefault();
    if (mensagem.length > 0) {
      handleNovaMensagem(mensagem);
    }
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          {listaDeMensagens.length <= 0 ? (
            <LoadMensagens />
          ) : (
            <MessageList
              mensagens={listaDeMensagens}
              delMensagem={handleDeletarMensagem}
            />
          )}

          <Box
            as="form"
            onSubmit={handleSubmit}
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              type="submit"
              styleSheet={{
                width: "10%",
                height: "80%",
                borderRadius: "5px",
                hover: {
                  backgroundColor: appConfig.theme.colors.neutrals[100],
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  const handleDeletarMensagem = props.delMensagem;
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
              <Text
                onClick={handleDeletarMensagem}
                styleSheet={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  marginLeft: "300px",
                  marginTop: "-15px",
                  color: "#fff",
                  backgroundColor: "rgba(70,15,12, 0.9)",
                  width: "15px",
                  height: "15px",
                  borderRadius: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  hover: {
                    backgroundColor: appConfig.theme.colors.neutrals[300],
                    boxShadow: " 0 0 2em rgb(22, 18, 12)",
                  },
                }}
                tag="span"
                data-id={mensagem.id}
              >
                X
              </Text>
            </Box>
            {mensagem.texto}
          </Text>
        );
      })}
    </Box>
  );
}

function LoadMensagens(props) {
  return (
    <ContentLoader
      height={1200}
      width={1060}
      speed={1}
      backgroundColor={"#444"}
      foregroundcolor={"#999"}
      {...props}
    >
      <rect x="103" y="12" rx="3" ry="3" width="123" height="7" />
      <rect x="102" y="152" rx="3" ry="3" width="171" height="6" />
      <circle cx="44" cy="42" r="38" />
      <circle cx="44" cy="147" r="38" />
      <circle cx="44" cy="251" r="38" />
      <rect x="105" y="117" rx="3" ry="3" width="123" height="7" />
      <rect x="104" y="222" rx="3" ry="3" width="123" height="7" />
      <rect x="105" y="48" rx="3" ry="3" width="171" height="6" />
      <rect x="104" y="257" rx="3" ry="3" width="171" height="6" />
    </ContentLoader>
  );
}
