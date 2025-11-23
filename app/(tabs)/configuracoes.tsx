import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/services/api';
import { storage } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

export default function ConfiguracoesScreen() {
  const router = useRouter();
  const { usuario, logout } = useAuth();
  const [apiUrl, setApiUrl] = useState('');
  const [salvando, setSalvando] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    const url = await storage.obterApiUrl();
    if (url) {
      setApiUrl(url);
      // atualizar base url do axios
      api.defaults.baseURL = url;
    }
  };

  const handleSalvar = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Erro', 'Informe a URL da API');
      return;
    }

    setSalvando(true);
    try {
      await storage.salvarApiUrl(apiUrl.trim());
      api.defaults.baseURL = apiUrl.trim();
      Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar configurações');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Configurações
          </ThemedText>

          

          
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Conta
          </ThemedText>

          {usuario && (
            <Card>
              <ThemedText style={styles.infoText}>
                <ThemedText type="defaultSemiBold">Nome: </ThemedText>
                {usuario.nome}
              </ThemedText>
              <ThemedText style={styles.infoText}>
                <ThemedText type="defaultSemiBold">Email: </ThemedText>
                {usuario.email}
              </ThemedText>
            </Card>
          )}

          <Button
            title="Sair da Conta"
            onPress={async () => {
              Alert.alert('Sair', 'Deseja realmente sair?', [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Sair',
                  style: 'destructive',
                  onPress: async () => {
                    await logout();
                    router.replace('/login');
                  },
                },
              ]);
            }}
            variant="danger"
          />

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Sobre
          </ThemedText>

          <Card>
            <ThemedText style={styles.infoTitle}>
              Worktime Assist Mobile
            </ThemedText>
            <ThemedText style={styles.infoText}>
              Versão 1.0.0
            </ThemedText>
            <ThemedText style={[styles.infoText, { marginTop: 8 }]}>
              Aplicativo para gerenciamento de pausas de trabalho
            </ThemedText>
          </Card>

      
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
    lineHeight: 20,
  },
});

