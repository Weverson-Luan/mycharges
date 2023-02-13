import React, { useCallback, useState } from "react";
import { Alert, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Load } from "../Load";
import { Filters } from "../Filters";
import { Order, OrderProps } from "../Order";

import { getRealm } from "../../libs/database/realm-connection";

import { Container, Header, Title, Counter } from "./styles";

export function Orders() {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [status, setStatus] = useState("open");

  const fetchOrders = async () => {
    setIsLoading(true);
    const realm = getRealm();

    try {
      const response = (await realm)
        .objects<OrderProps[]>("Order")
        .filtered(`status = '${status}'`)
        .toJSON();

      setOrders(response);
      console.log("i", response);
    } catch {
      Alert.alert("Chamado", "Não foi possivél carregar os chamados.");
    } finally {
      (await realm).close();
      setIsLoading(false);
    }
  };

  async function orderUpdate(id: string) {
    const realm = await getRealm();

    try {
      setIsLoading(true);

      // pegando p item selecionado.
      const orderSelected = await realm
        .objects<OrderProps>("Order")
        .filtered(`_id = '${id}'`)[0];

      realm.write(() => {
        orderSelected.status =
          orderSelected.status === "open" ? "closed" : "open";
        orderSelected.created_at = new Date();
      });

      Alert.alert("Chamado", "Chamado foi atualizado!");
      fetchOrders();
    } catch {
      Alert.alert("Chamado", "Não foi possivél atualizar o chamado.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOrderUPdate(id: string) {
    Alert.alert("Chamado", "Encerrar chamado?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Confirrmar",
        onPress: () => orderUpdate(id),
      },
    ]);
  }

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [status])
  );
  return (
    <Container>
      <Filters onFilter={setStatus} />

      <Header>
        <Title>Chamados {status === "open" ? "aberto" : "encerrado"}</Title>
        <Counter>{orders.length}</Counter>
      </Header>

      {isLoading ? (
        <Load />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Order data={item} onPress={() => handleOrderUPdate(item._id)} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      )}
    </Container>
  );
}
