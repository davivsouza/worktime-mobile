import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { pausaService } from '@/services/api';
import { Pausa } from '@/types/pausa';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const [pausas, setPausas] = useState<Pausa[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [criandoPausa, setCriandoPausa] = useState(false);
  const [pausaAtiva, setPausaAtiva] = useState<Pausa | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const carregarPausas = async () => {
    try {
      const response = await pausaService.listar(0, 5);
      setPausas(response.content);
      // verificar se há pausa ativa
      const ativa = response.content.find(p => !p.fim);
      setPausaAtiva(ativa || null);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao carregar pausas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarPausas();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    carregarPausas();
  };

  const handleIniciarPausa = async () => {
    setCriandoPausa(true);
    try {
      const novaPausa = await pausaService.criar({});
      setPausaAtiva(novaPausa);
      carregarPausas();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao criar pausa');
    } finally {
      setCriandoPausa(false);
    }
  };

  const handleFinalizarPausa = async () => {
    if (!pausaAtiva) return;
    
    try {
      await pausaService.atualizar(pausaAtiva.id, { fim: new Date().toISOString() });
      setPausaAtiva(null);
      carregarPausas();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao finalizar pausa');
    }
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

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <ThemedText type="title" style={styles.title}>
            Worktime Assist
          </ThemedText>
          <ThemedText style={styles.subtitle}>Gerencie suas pausas de trabalho</ThemedText>

          {/* botão principal de pausar */}
          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor: pausaAtiva ? colors.danger : colors.tint,
              },
            ]}
            onPress={pausaAtiva ? handleFinalizarPausa : handleIniciarPausa}
            disabled={criandoPausa}
            activeOpacity={0.8}>
            <View style={styles.mainButtonContent}>
              <Ionicons
                name={pausaAtiva ? 'stop-circle' : 'play-circle'}
                size={64}
                color="#fff"
              />
              <ThemedText style={styles.mainButtonText}>
                {pausaAtiva ? 'Finalizar Pausa' : 'Iniciar Pausa'}
              </ThemedText>
              {pausaAtiva && (
                <ThemedText style={styles.mainButtonSubtext}>
                  Iniciada às {formatarData(pausaAtiva.inicio).split(' ')[1]}
                </ThemedText>
              )}
            </View>
          </TouchableOpacity>

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Pausas Recentes
          </ThemedText>

          {loading ? (
            <ThemedText style={styles.emptyText}>Carregando...</ThemedText>
          ) : pausas.length === 0 ? (
            <ThemedText style={styles.emptyText}>Nenhuma pausa registrada</ThemedText>
          ) : (
            pausas.map((pausa) => (
              <Card
                key={pausa.id}
                onPress={() => router.push({
                  pathname: '/detalhes/[id]',
                  params: { id: pausa.id }
                })}>
                <View style={styles.cardHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                    Pausa
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
                </View>
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
              </Card>
            ))
          )}

          {pausas.length > 0 && (
            <Button
              title="Ver Histórico Completo"
              onPress={() => router.push('/historico')}
              variant="secondary"
            />
          )}
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
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
    opacity: 0.7,
  },
  mainButton: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainButtonContent: {
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  mainButtonSubtext: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.9,
  },
  sectionTitle: {
    marginTop: 32,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    opacity: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
