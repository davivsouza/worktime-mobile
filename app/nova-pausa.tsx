import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { pausaService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

export default function NovaPausaScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSalvar = async () => {
    setLoading(true);
    try {
      // a api aceita {} vazio e usa a data/hora atual automaticamente
      await pausaService.criar({});
      router.back();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao criar pausa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="play-circle" size={100} color={colors.tint} />
            </View>

            <ThemedText type="title" style={styles.title}>
              Nova Pausa
            </ThemedText>

            <ThemedText style={styles.description}>
              Clique no botão abaixo para iniciar uma nova pausa. A data e hora de início serão
              registradas automaticamente.
            </ThemedText>

            <Button
              title="Iniciar Pausa"
              onPress={handleSalvar}
              loading={loading}
              disabled={loading}
            />

            <Button
              title="Cancelar"
              onPress={() => router.back()}
              variant="secondary"
              disabled={loading}
            />
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    marginBottom: 32,
    opacity: 0.7,
    lineHeight: 24,
    fontSize: 16,
    textAlign: 'center',
  },
});

