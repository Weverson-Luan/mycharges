import React from "react";
import codePush from "react-native-code-push";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "styled-components/native";

import { Routes } from "./src/routes";

import theme from "./src/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        style="dark"
        translucent
        backgroundColor={theme.COLORS.BACKGROUND}
      />
      <Routes />
    </ThemeProvider>
  );
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  updateDialog: {
    appendReleaseDescription: false,
    title: "Atualização disponível",
    mandatoryUpdateMessage:
      "Uma nova atualização está disponível para ser instalada.",
    mandatoryContinueButtonLabel: "Instalar",
    optionalUpdateMessage:
      "Uma nova atualização está disponível para ser instalada.",
    optionalInstallButtonLabel: "Instalar",
    optionalIgnoreButtonLabel: "Ignorar",
  },
  installMode: codePush.InstallMode.IMMEDIATE,
};

export default codePush(codePushOptions)(App);
