// Tela Editar --- carrega os dados e permite editar imagem e trailer
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator
} from 'react-native';
import API_URL from '../config';

export default function Editar({ navigation, route }) {
  const id = route.params.id;

  const [titulo, setTitulo] = useState('');
  const [volume, setVolume] = useState('');
  const [autor, setAutor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [editora, setEditora] = useState('');
  const [ano, setAno] = useState('');
  const [sinopse, setSinopse] = useState('');
  const [imagem, setImagem] = useState('');
  const [trailer, setTrailer] = useState('');

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  useEffect(() => {
    async function buscarQuadrinho() {
      try {
        const resposta = await fetch(`${API_URL}/quadrinhos/${id}`);
        const dados = await resposta.json();
        setTitulo(dados.titulo);
        setVolume(String(dados.volume));
        setAutor(dados.autor);
        setCategoria(dados.categoria);
        setEditora(dados.editora);
        setAno(String(dados.ano));
        setSinopse(dados.sinopse);
        setImagem(dados.imagem || '');
        setTrailer(dados.trailer || '');
      } catch (erro) {
        console.error('Erro ao buscar quadrinho:', erro);
      } finally {
        setCarregando(false);
      }
    }
    buscarQuadrinho();
  }, [id]);

  async function atualizarQuadrinho() {
    if (
      !titulo.trim() || !volume.trim() || !autor.trim() ||
      !categoria.trim() || !editora.trim() || !ano.trim() || !sinopse.trim()
    ) {
      setMensagemSucesso('⚠️ Preencha todos os campos obrigatórios.');
      return;
    }

    setSalvando(true);
    setMensagemSucesso('');

    try {
      const resposta = await fetch(`${API_URL}/quadrinhos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          volume: parseInt(volume, 10),
          autor,
          categoria,
          editora,
          ano: parseInt(ano, 10),
          sinopse,
          imagem,
          trailer
        })
      });

      const dados = await resposta.json();

      if (resposta.status === 200) {
        setMensagemSucesso('✅ Quadrinho atualizado com sucesso!');
        setTimeout(() => navigation.goBack(), 2000);
      } else {
        setMensagemSucesso('❌ ' + (dados.erro || 'Erro ao atualizar o quadrinho.'));
      }
    } catch (erro) {
      console.error('Erro ao atualizar:', erro);
      setMensagemSucesso('❌ Não foi possível conectar à API.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={estilos.textoAux}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={estilos.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={estilos.titulo}>Editar Quadrinho</Text>

      <Text style={estilos.label}>Título *</Text>
      <TextInput style={estilos.input} value={titulo} onChangeText={setTitulo} placeholderTextColor="#888" />

      <Text style={estilos.label}>Volume *</Text>
      <TextInput style={estilos.input} value={volume} onChangeText={setVolume} keyboardType="numeric" placeholderTextColor="#888" />

      <Text style={estilos.label}>Autor *</Text>
      <TextInput style={estilos.input} value={autor} onChangeText={setAutor} placeholderTextColor="#888" />

      <Text style={estilos.label}>Categoria *</Text>
      <TextInput style={estilos.input} value={categoria} onChangeText={setCategoria} placeholderTextColor="#888" />

      <Text style={estilos.label}>Editora *</Text>
      <TextInput style={estilos.input} value={editora} onChangeText={setEditora} placeholderTextColor="#888" />

      <Text style={estilos.label}>Ano *</Text>
      <TextInput style={estilos.input} value={ano} onChangeText={setAno} keyboardType="numeric" placeholderTextColor="#888" />

      <Text style={estilos.label}>URL da Imagem</Text>
      <TextInput
        style={estilos.input}
        value={imagem}
        onChangeText={setImagem}
        placeholder="https://exemplo.com/capa.jpg"
        placeholderTextColor="#888"
        autoCapitalize="none"
      />

      <Text style={estilos.label}>URL do Trailer</Text>
      <TextInput
        style={estilos.input}
        value={trailer}
        onChangeText={setTrailer}
        placeholder="https://www.youtube.com/embed/ID_DO_VIDEO"
        placeholderTextColor="#888"
        autoCapitalize="none"
      />
      <Text style={estilos.ajuda}>
        Use o formato: https://www.youtube.com/embed/ID_DO_VIDEO
      </Text>

      <Text style={estilos.label}>Sinopse *</Text>
      <TextInput
        style={[estilos.input, estilos.inputDescricao]}
        value={sinopse}
        onChangeText={setSinopse}
        multiline
        numberOfLines={4}
        placeholderTextColor="#888"
      />

      {mensagemSucesso !== '' && (
        <View style={
          mensagemSucesso.startsWith('✅')
            ? estilos.caixaSucesso
            : estilos.caixaErro
        }>
          <Text style={estilos.textoMensagem}>{mensagemSucesso}</Text>
        </View>
      )}

      <TouchableOpacity
        style={estilos.botao}
        onPress={atualizarQuadrinho}
        disabled={salvando}
      >
        {salvando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={estilos.textoBotao}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>
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
  textoAux: { color: '#bbb', marginTop: 10, textAlign: 'center' },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10
  },
  input: {
    backgroundColor: '#1e1e2e',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 6
  },
  inputDescricao: { height: 100, textAlignVertical: 'top', marginBottom: 10 },
  ajuda: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
    fontStyle: 'italic'
  },
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
  },
  botao: {
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50
  },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});