import { useState } from 'react';
import { StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, SafeAreaView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function CadastroScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleCadastro = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await authService.criarUsuario({
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login para continuar', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao criar conta');
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
              <Ionicons name="person-add-outline" size={64} color={colors.tint} />
              <ThemedText type="title" style={styles.title}>
                Criar Conta
              </ThemedText>
              <ThemedText style={styles.subtitle}>Preencha os dados para se cadastrar</ThemedText>
            </View>

            <View style={styles.form}>
              <Input
                label="Nome Completo"
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome"
                autoCapitalize="words"
              />

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
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
              />

              <Input
                label="Confirmar Senha"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                placeholder="Digite a senha novamente"
                secureTextEntry
              />

              <Button
                title="Criar Conta"
                onPress={handleCadastro}
                loading={loading}
                disabled={loading}
              />

              <Button
                title="Voltar"
                onPress={() => router.back()}
                variant="secondary"
                disabled={loading}
              />
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
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
});

