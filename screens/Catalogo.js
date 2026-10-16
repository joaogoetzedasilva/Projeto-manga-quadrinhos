// Tela Catálogo --- capa grande à esquerda, info no meio, trailer sob o botão
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, Button, Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import API_URL from '../config';

export default function Catalogo({ navigation }) {
  const [quadrinhos, setQuadrinhos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [abertos, setAbertos] = useState({});

  useFocusEffect(
    useCallback(() => {
      async function buscarQuadrinhos() {
        setCarregando(true);
        setErro(null);
        try {
          const resposta = await fetch(`${API_URL}/quadrinhos`);
          const dados = await resposta.json();
          setQuadrinhos(dados);
        } catch (e) {
          console.error('Erro ao buscar quadrinhos:', e);
          setErro('Não foi possível carregar os quadrinhos.');
        } finally {
          setCarregando(false);
        }
      }
      buscarQuadrinhos();
    }, [])
  );

  function alternarTrailer(id) {
    setAbertos((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={estilos.textoAux}>Carregando quadrinhos...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.textoErro}>⚠️ {erro}</Text>
        <Text style={estilos.textoAux}>
          Verifique se o back-end está rodando e se o IP em config.js está correto.
        </Text>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <FlatList
        data={quadrinhos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <Button
            title="Cadastrar Novo Quadrinho"
            color="#7c3aed"
            onPress={() => navigation.navigate('Cadastrar')}
          />
        }
        ListHeaderComponentStyle={{ marginBottom: 16 }}
        renderItem={({ item }) => {
          const temTrailer = item.trailer && item.trailer.trim() !== '';
          const estaAberto = !!abertos[item.id];

          return (
            <View style={estilos.card}>
              <View style={estilos.grid}>

                {/* COLUNA 1: Capa (altura fixa 420) */}
                <TouchableOpacity
                  style={estilos.colunaImagem}
                  onPress={() => navigation.navigate('Detalhes', { id: item.id })}
                  activeOpacity={0.85}
                >
                  <Image
                    source={{
                      uri: item.imagem && item.imagem.trim() !== ''
                        ? item.imagem
                        : 'https://via.placeholder.com/300x420/1e1e2e/7c3aed?text=Sem+Capa'
                    }}
                    style={estilos.capa}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                {/* COLUNA 2: Título + Informações */}
                <View style={estilos.colunaInfo}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Detalhes', { id: item.id })}
                    activeOpacity={0.85}
                  >
                    <Text style={estilos.nome}>{item.titulo}</Text>
                  </TouchableOpacity>

                  <Text style={estilos.rotulo}>Volume</Text>
                  <Text style={estilos.valor}>{item.volume}</Text>

                  <Text style={estilos.rotulo}>Autor</Text>
                  <Text style={estilos.valor}>{item.autor}</Text>

                  <Text style={estilos.rotulo}>Categoria</Text>
                  <Text style={estilos.valor}>{item.categoria}</Text>

                  <Text style={estilos.rotulo}>Editora</Text>
                  <Text style={estilos.valor}>{item.editora}</Text>

                  <Text style={estilos.rotulo}>Ano</Text>
                  <Text style={estilos.valor}>{item.ano}</Text>
                </View>

                {/* COLUNA 3: Botão + Trailer embaixo */}
                <View style={estilos.colunaBotao}>
                  {temTrailer ? (
                    <>
                      <TouchableOpacity
                        style={estilos.botaoTrailer}
                        onPress={() => alternarTrailer(item.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={estilos.textoBotaoTrailer}>
                          {estaAberto ? '▼ Fechar Trailer' : '▶ Ver Trailer'}
                        </Text>
                      </TouchableOpacity>

                      {/* Trailer embaixo do botão */}
                      {estaAberto && (
                        <View style={estilos.areaTrailerColuna}>
                          {Platform.OS === 'web' ? (
                            <View style={estilos.videoContainerColuna}>
                              {React.createElement('iframe', {
                                src: item.trailer,
                                style: {
                                  width: '100%',
                                  height: '100%',
                                  border: 'none',
                                  borderRadius: '10px'
                                },
                                allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                                allowFullScreen: true
                              })}
                            </View>
                          ) : (
                            <View style={estilos.placeholderVideo}>
                              <Text style={estilos.textoPlaceholder}>
                                🎬 Abra no navegador para ver o trailer
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={estilos.semTrailer}>
                      <Text style={estilos.textoSemTrailer}>Sem trailer</Text>
                    </View>
                  )}
                </View>

              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#12121c' },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#12121c',
    padding: 24
  },
  textoAux: { color: '#bbb', marginTop: 10, textAlign: 'center' },
  textoErro: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8
  },
  card: {
    backgroundColor: '#1e1e2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 16
  },

  // Coluna 1 — Capa com altura fixa 420
  colunaImagem: {
    flex: 2,
    minWidth: 220
  },
  capa: {
    width: '100%',
    height: 420,
    borderRadius: 10,
    backgroundColor: '#2a2a3e'
  },

  // Coluna 2 — Info
  colunaInfo: {
    flex: 2,
    minWidth: 180,
    paddingHorizontal: 4
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12
  },
  rotulo: {
    color: '#7c3aed',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
    marginTop: 8
  },
  valor: { color: '#fff', fontSize: 15, marginTop: 2 },

  // Coluna 3 — Botão + Trailer
  colunaBotao: {
    flex: 2,
    minWidth: 260
  },
  botaoTrailer: {
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4
  },
  textoBotaoTrailer: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center'
  },
  semTrailer: {
    backgroundColor: '#2a2a3e',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a4e',
    borderStyle: 'dashed'
  },
  textoSemTrailer: {
    color: '#666',
    fontSize: 13,
    fontStyle: 'italic'
  },

  // Trailer embaixo do botão
  areaTrailerColuna: {
    marginTop: 12
  },
  videoContainerColuna: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#0a0a12'
  },
  placeholderVideo: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1e1e2e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7c3aed',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12
  },
  textoPlaceholder: {
    color: '#7c3aed',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold'
  }
});