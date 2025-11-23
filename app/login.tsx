import { useState } from 'react';
import { StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, View, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        username: email.trim(),
        password: senha,
      });

      // salvar token primeiro
      await storage.salvarToken(response.token);

      // obter dados do usuário (o token já está salvo, então o interceptor vai adicionar)
      const usuario = await authService.obterPerfil();
      await login(usuario, response.token);

      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erro ao fazer login', error instanceof Error ? error.message : 'Verifique suas credenciais e tente novamente');
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
            <View style={styles.header}>
              <Ionicons name="time-outline" size={80} color={colors.tint} />
              <ThemedText type="title" style={styles.title}>
                Worktime Assist
              </ThemedText>
              <ThemedText style={styles.subtitle}>Gerencie suas pausas de trabalho</ThemedText>
            </View>

            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                placeholder="Sua senha"
                secureTextEntry
              />

              <Button title="Entrar" onPress={handleLogin} loading={loading} disabled={loading} />

              <View style={styles.registerContainer}>
                <ThemedText style={styles.registerText}>Não tem uma conta?</ThemedText>
                <Button
                  title="Criar Conta"
                  onPress={() => router.push('/cadastro')}
                  variant="secondary"
                  disabled={loading}
                />
              </View>
            </View>
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
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 16,
  },
  form: {
    width: '100%',
  },
  registerContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    marginBottom: 12,
    opacity: 0.7,
    fontSize: 16,
  },
});

