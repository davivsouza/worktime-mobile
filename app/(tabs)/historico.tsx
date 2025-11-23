import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { pausaService } from '@/services/api';
import { Pausa } from '@/types/pausa';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View, SafeAreaView } from 'react-native';

export default function HistoricoScreen() {
  const router = useRouter();
  const [pausas, setPausas] = useState<Pausa[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const carregarPausas = async () => {
    try {
      const response = await pausaService.listar(0, 100);
      setPausas(response.content);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao carregar histórico');
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

  const agruparPorData = (pausas: Pausa[]) => {
    const grupos: { [key: string]: Pausa[] } = {};
    pausas.forEach((pausa) => {
      const data = new Date(pausa.inicio);
      const chave = data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      if (!grupos[chave]) {
        grupos[chave] = [];
      }
      grupos[chave].push(pausa);
    });
    return grupos;
  };

  const grupos = agruparPorData(pausas);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <ThemedText type="title" style={styles.title}>
            Histórico
          </ThemedText>

          {loading ? (
            <ThemedText style={styles.emptyText}>Carregando...</ThemedText>
          ) : pausas.length === 0 ? (
            <ThemedText style={styles.emptyText}>Nenhuma pausa registrada</ThemedText>
          ) : (
            Object.keys(grupos).map((data) => (
              <View key={data} style={styles.grupo}>
                <ThemedText type="subtitle" style={styles.dataGrupo}>
                  {data}
                </ThemedText>
                {grupos[data].map((pausa) => (
                  <Card
                    key={pausa.id}
                    onPress={() => {
                      console.log('clicou na pausa:', pausa.id);
                      router.push(`/detalhes/${pausa.id}`);
                    }}>
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
                ))}
              </View>
            ))
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
    marginBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    opacity: 0.5,
  },
  grupo: {
    marginBottom: 24,
  },
  dataGrupo: {
    marginBottom: 12,
    opacity: 0.8,
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

