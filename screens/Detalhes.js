// Tela Detalhes --- capa | (título + info) | trailer (iframe)
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  TouchableOpacity, Platform, Image
} from 'react-native';
import API_URL from '../config';

export default function Detalhes({ route, navigation }) {
  const { id } = route.params;
  const [quadrinho, setQuadrinho] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function buscarQuadrinho() {
      try {
        const resposta = await fetch(`${API_URL}/quadrinhos/${id}`);
        const dados = await resposta.json();
        setQuadrinho(dados);
      } catch (e) {
        console.error('Erro ao buscar quadrinho:', e);
        setErro('Não foi possível carregar o quadrinho.');
      } finally {
        setCarregando(false);
      }
    }
    buscarQuadrinho();
  }, [id]);

  async function excluirQuadrinho() {
    const confirmado = Platform.OS === 'web'
      ? window.confirm('Tem certeza que deseja excluir este quadrinho?')
      : true;

    if (!confirmado) return;

    setExcluindo(true);
    setMensagem('');

    try {
      const resposta = await fetch(`${API_URL}/quadrinhos/${id}`, {
        method: 'DELETE'
      });
      const dados = await resposta.json();

      if (resposta.status === 200) {
        setMensagem('✅ Quadrinho excluído com sucesso!');
        setTimeout(() => navigation.goBack(), 1500);
      } else {
        setMensagem('❌ ' + (dados.erro || 'Erro ao excluir o quadrinho.'));
      }
    } catch (erro) {
      console.error('Erro ao excluir:', erro);
      setMensagem('❌ Não foi possível conectar à API.');
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  if (erro || !quadrinho) {
    return (
      <View style={estilos.centro}>
        <Text style={estilos.textoErro}>
          ⚠️ {erro || 'Quadrinho não encontrado.'}
        </Text>
      </View>
    );
  }

  // Verifica se tem trailer cadastrado
  const temTrailer = quadrinho.trailer && quadrinho.trailer.trim() !== '';

  return (
    <ScrollView style={estilos.container} contentContainerStyle={{ padding: 20 }}>

      <View style={estilos.grid}>

        {/* COLUNA 1: Imagem */}
        <View style={estilos.colunaImagem}>
          <Image
            source={{
              uri: quadrinho.imagem && quadrinho.imagem.trim() !== ''
                ? quadrinho.imagem
                : 'https://via.placeholder.com/300x420/1e1e2e/7c3aed?text=Sem+Capa'
            }}
            style={estilos.capa}
            resizeMode="cover"
          />
        </View>

        {/* COLUNA 2: Título + Informações */}
        <View style={estilos.colunaInfo}>
          <Text style={estilos.nome}>{quadrinho.titulo}</Text>

          <Text style={estilos.rotulo}>Volume</Text>
          <Text style={estilos.valor}>{quadrinho.volume}</Text>

          <Text style={estilos.rotulo}>Autor</Text>
          <Text style={estilos.valor}>{quadrinho.autor}</Text>

          <Text style={estilos.rotulo}>Categoria</Text>
          <Text style={estilos.valor}>{quadrinho.categoria}</Text>

          <Text style={estilos.rotulo}>Editora</Text>
          <Text style={estilos.valor}>{quadrinho.editora}</Text>

          <Text style={estilos.rotulo}>Ano</Text>
          <Text style={estilos.valor}>{quadrinho.ano}</Text>
        </View>

        {/* COLUNA 3: Trailer */}
        <View style={estilos.colunaTrailer}>
          <Text style={estilos.rotulo}>Trailer</Text>

          {temTrailer ? (
            Platform.OS === 'web' ? (
              // Na WEB: usa iframe do YouTube
              <View style={estilos.videoContainer}>
                {React.createElement('iframe', {
                  src: quadrinho.trailer,
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
              // No celular: mensagem (iframe não funciona)
              <View style={estilos.placeholderVideo}>
                <Text style={estilos.textoPlaceholder}>
                  🎬 Abra no navegador para ver o trailer
                </Text>
              </View>
            )
          ) : (
            // Sem trailer cadastrado
            <View style={estilos.placeholderVideo}>
              <Text style={estilos.textoPlaceholder}>
                🎬 Sem trailer cadastrado
              </Text>
            </View>
          )}
        </View>

      </View>

      {/* Sinopse embaixo, ocupando largura toda */}
      <Text style={estilos.rotuloSinopse}>Sinopse</Text>
      <Text style={estilos.descricao}>{quadrinho.sinopse}</Text>

      {/* Botões */}
      <TouchableOpacity
        style={estilos.botaoEditar}
        onPress={() => navigation.navigate('Editar', { id: quadrinho.id })}
      >
        <Text style={estilos.textoBotao}>Editar Quadrinho</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={estilos.botaoExcluir}
        onPress={excluirQuadrinho}
        disabled={excluindo}
      >
        {excluindo ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={estilos.textoBotao}>Excluir Quadrinho</Text>
        )}
      </TouchableOpacity>

      {mensagem !== '' && (
        <View style={
          mensagem.startsWith('✅')
            ? estilos.caixaSucesso
            : estilos.caixaErro
        }>
          <Text style={estilos.textoMensagem}>{mensagem}</Text>
        </View>
      )}
    </ScrollView>
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
  textoErro: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 16
  },
  colunaImagem: {
    flex: 2,
    minWidth: 220
  },
  capa: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    backgroundColor: '#2a2a3e'
  },
  colunaInfo: {
    flex: 2,
    minWidth: 180,
    paddingHorizontal: 4
  },
  nome: {
    fontSize: 24,
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

  colunaTrailer: {
    flex: 3,
    minWidth: 280
  },
  videoContainer: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#1e1e2e',
    marginTop: 8
  },
  placeholderVideo: {
    width: '100%',
    height: 400,
    backgroundColor: '#1e1e2e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7c3aed',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginTop: 8
  },
  textoPlaceholder: {
    color: '#7c3aed',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold'
  },

  rotuloSinopse: {
    color: '#7c3aed',
    fontWeight: 'bold',
    fontSize: 13,
    textTransform: 'uppercase',
    marginTop: 24
  },
  descricao: { color: '#ccc', fontSize: 15, marginTop: 6, lineHeight: 22 },

  botaoEditar: {
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center'
  },
  botaoExcluir: {
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center'
  },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  caixaSucesso: {
    backgroundColor: '#14532d',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#4ade80'
  },
  caixaErro: {
    backgroundColor: '#7f1d1d',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ef4444'
  },
  textoMensagem: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});