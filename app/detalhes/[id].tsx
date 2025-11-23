import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { pausaService } from '@/services/api';
import { Pausa, PausaUpdate } from '@/types/pausa';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View, SafeAreaView } from 'react-native';

export default function DetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pausa, setPausa] = useState<Pausa | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (id) {
      carregarPausa();
    }
  }, [id]);

  const carregarPausa = async () => {
    if (!id) return;
    try {
      const dados = await pausaService.obterPorId(id);
      setPausa(dados);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao carregar pausa');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizar = async () => {
    if (!pausa || !id) return;

    Alert.alert('Finalizar Pausa', 'Deseja finalizar esta pausa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Finalizar',
        onPress: async () => {
          setSalvando(true);
          try {
            const atualizacao: PausaUpdate = {
              fim: new Date().toISOString(),
            };
            const atualizada = await pausaService.atualizar(id, atualizacao);
            setPausa(atualizada);
            Alert.alert('Sucesso', 'Pausa finalizada com sucesso!');
          } catch (error) {
            Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao finalizar pausa');
          } finally {
            setSalvando(false);
          }
        },
      },
    ]);
  };

  const handleDeletar = () => {
    if (!id) return;

    Alert.alert('Deletar Pausa', 'Tem certeza que deseja deletar esta pausa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          setDeletando(true);
          try {
            await pausaService.deletar(id);
            Alert.alert('Sucesso', 'Pausa deletada com sucesso', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          } catch (error) {
            Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao deletar pausa');
          } finally {
            setDeletando(false);
          }
        },
      },
    ]);
  };

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatarDuracao = (duracao?: number) => {
    if (!duracao) return '-';
    const horas = Math.floor(duracao / 3600);
    const minutos = Math.floor((duracao % 3600) / 60);
    if (horas > 0) {
      return `${horas}h ${minutos}m`;
    }
    return `${minutos}m`;
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText style={styles.loadingText}>Carregando...</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (!pausa) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText style={[styles.errorText, { color: colors.danger }]}>
            Pausa não encontrada
          </ThemedText>
          <Button title="Voltar" onPress={() => router.back()} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Detalhes da Pausa
          </ThemedText>

          <Card>
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Informações
            </ThemedText>
            <ThemedText style={styles.cardText}>
              Início: {formatarData(pausa.inicio)}
            </ThemedText>
            {pausa.fim && (
              <ThemedText style={styles.cardText}>
                Fim: {formatarData(pausa.fim)}
              </ThemedText>
            )}
            <ThemedText style={styles.cardText}>
              Duração: {formatarDuracao(pausa.duracao)}
            </ThemedText>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: pausa.fim ? colors.icon : colors.success,
                },
              ]}>
              <ThemedText style={styles.statusText}>
                {pausa.fim ? 'Finalizada' : 'Ativa'}
              </ThemedText>
            </View>
          </Card>

          <View style={styles.actions}>
            {!pausa.fim && (
              <Button
                title="Finalizar Pausa"
                onPress={handleFinalizar}
                loading={salvando}
                disabled={salvando || deletando}
              />
            )}

            <Button
              title="Deletar Pausa"
              onPress={handleDeletar}
              variant="danger"
              loading={deletando}
              disabled={salvando || deletando}
            />
          </View>

          <Button title="Voltar" onPress={() => router.back()} variant="secondary" />
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
    marginBottom: 24,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 32,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 32,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
});

