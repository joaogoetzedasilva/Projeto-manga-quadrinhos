// Tela Cadastrar --- formulário com campos de imagem e trailer
import React, { useState } from 'react';
import {
  Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import API_URL from '../config';

export default function Cadastrar({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [volume, setVolume] = useState('');
  const [autor, setAutor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [editora, setEditora] = useState('');
  const [ano, setAno] = useState('');
  const [sinopse, setSinopse] = useState('');
  const [imagem, setImagem] = useState('');
  const [trailer, setTrailer] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function cadastrarQuadrinho() {
    if (
      !titulo.trim() || !volume.trim() || !autor.trim() ||
      !categoria.trim() || !editora.trim() || !ano.trim() || !sinopse.trim()
    ) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setEnviando(true);

    try {
      const resposta = await fetch(`${API_URL}/quadrinhos`, {
        method: 'POST',
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

      if (resposta.status === 201) {
        Alert.alert('Sucesso', 'Quadrinho cadastrado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Erro', dados.erro || 'Ocorreu um erro ao cadastrar o quadrinho.');
      }
    } catch (erro) {
      console.error('Erro ao cadastrar:', erro);
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível conectar à API. Verifique se o back-end está rodando.'
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView style={estilos.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={estilos.titulo}>Cadastrar Novo Quadrinho</Text>

      <Text style={estilos.label}>Título *</Text>
      <TextInput
        style={estilos.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ex: One Piece"
        placeholderTextColor="#888"
      />

      <Text style={estilos.label}>Volume *</Text>
      <TextInput
        style={estilos.input}
        value={volume}
        onChangeText={setVolume}
        placeholder="Ex: 1"
        keyboardType="numeric"
        placeholderTextColor="#888"
      />

      <Text style={estilos.label}>Autor *</Text>
      <TextInput
        style={estilos.input}
        value={autor}
        onChangeText={setAutor}
        placeholder="Ex: Eiichiro Oda"
        placeholderTextColor="#888"
      />

      <Text style={estilos.label}>Categoria *</Text>
      <TextInput
        style={estilos.input}
        value={categoria}
        onChangeText={setCategoria}
        placeholder="Ex: Mangá, HQ, Graphic Novel"
        placeholderTextColor="#888"
      />

      <Text style={estilos.label}>Editora *</Text>
      <TextInput
        style={estilos.input}
        value={editora}
        onChangeText={setEditora}
        placeholder="Ex: Panini"
        placeholderTextColor="#888"
      />

      <Text style={estilos.label}>Ano *</Text>
      <TextInput
        style={estilos.input}
        value={ano}
        onChangeText={setAno}
        placeholder="Ex: 1997"
        keyboardType="numeric"
        placeholderTextColor="#888"
      />

      <Text style={estilos.label}>URL da Imagem (opcional)</Text>
      <TextInput
        style={estilos.input}
        value={imagem}
        onChangeText={setImagem}
        placeholder="https://exemplo.com/capa.jpg"
        placeholderTextColor="#888"
        autoCapitalize="none"
      />

      <Text style={estilos.label}>URL do Trailer (opcional)</Text>
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
        placeholder="Uma breve sinopse do quadrinho..."
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={estilos.botao}
        onPress={cadastrarQuadrinho}
        disabled={enviando}
      >
        {enviando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={estilos.textoBotao}>Cadastrar Quadrinho</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#12121c' },
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