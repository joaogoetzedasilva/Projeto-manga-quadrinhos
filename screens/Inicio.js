// Tela inicial --- título no topo, botão no meio da tela
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ImageBackground
} from 'react-native';

export default function Inicio({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/personagens.png')}
      style={estilos.background}
      resizeMode="cover"
    >
      {/* Overlay escuro */}
      <View style={estilos.overlay}>

        {/* Bloco do topo: título + subtítulo */}
        <View style={estilos.topo}>
          <Text style={estilos.titulo}>Coleção de Quadrinhos</Text>
          <Text style={estilos.subtitulo}>
            Explore os quadrinhos e mangás cadastrados no banco de dados
          </Text>
        </View>

        {/* Botão no meio (centralizado verticalmente) */}
        <View style={estilos.meio}>
          <TouchableOpacity
            style={estilos.botao}
            onPress={() => navigation.navigate('Catalogo')}
            activeOpacity={0.8}
          >
            <Text style={estilos.textoBotao}>Ver Catálogo</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingTop: 40,
    paddingHorizontal: 24
  },
  topo: {
    alignItems: 'center'
  },
  titulo: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6
  },
  subtitulo: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4
  },
  meio: {
    flex: 1,                  // ocupa o resto da tela
    justifyContent: 'center', // centraliza o botão verticalmente
    alignItems: 'center'
  },
  botao: {
    backgroundColor: 'rgba(124, 58, 237, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  }
});