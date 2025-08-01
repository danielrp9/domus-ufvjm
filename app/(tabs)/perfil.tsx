// C:\Users\danie\OneDrive\Área de Trabalho\domus-ufvjm\domus-ufvjm\app\(tabs)\perfil.tsx

import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext'; // <<<<< CAMINHO CORRIGIDO AQUI >>>>>

// Componente auxiliar para exibir itens do perfil
function ProfileItem({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string | number | null;
  onPress?: () => void;
}) {
  const displayValue = value !== null && value !== undefined ? String(value) : '-';

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [styles.settingItem, pressed && styles.itemPressed]}
        onPress={onPress}
      >
        <View style={styles.itemContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={20} color="#3355ce" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.itemText}>{label}</Text>
            {displayValue && displayValue !== '-' && <Text style={styles.itemValue}>{displayValue}</Text>}
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.settingItem}>
      <View style={styles.itemContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#3355ce" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemText}>{label}</Text>
          {displayValue && displayValue !== '-' && <Text style={styles.itemValue}>{displayValue}</Text>}
        </View>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, isLoading, isLoggedIn } = useAuth();
  
  const [fontsLoaded, fontError] = useFonts({
    'Afacad-Regular': require('@/assets/fonts/Afacad-VariableFont_wght.ttf'),
    'BebasNeue-Regular': require('@/assets/fonts/BebasNeue-Regular.ttf'),
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading || !isLoggedIn || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3355ce" />
        <Text style={styles.loadingText}>A carregar perfil...</Text>
        {!isLoggedIn && !isLoading && <Text style={styles.loadingText}>Utilizador não logado.</Text>}
      </View>
    );
  }

  const profileGroups = [
    {
      title: 'INFORMAÇÕES ACADÊMICAS',
      items: [
        { icon: 'id-card', label: 'Matrícula', value: user.matricula },
        { icon: 'school', label: 'Curso', value: user.curso },
        { icon: 'calendar', label: 'Ano de Entrada', value: user.ano_de_entrada },
      ],
    },
    {
      title: 'INFORMAÇÕES RESIDENCIAIS',
      items: [
        { icon: 'home', label: 'Bloco', value: user.bloco },
        { icon: 'business', label: 'Apartamento', value: user.apartamento },
      ],
    },
  ];

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <Text style={styles.pageTitle}>PERFIL</Text>
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/icons/profile-count.png')}
              style={styles.avatar}
            />
            <View style={styles.statusIndicator} />
          </View>
          <Text style={styles.userName}>{user.nome}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userStatus}>{user.tipo}</Text>
        </View>

        {profileGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupContainer}>
              {group.items.map((item, itemIndex) => (
                <ProfileItem
                  key={itemIndex}
                  icon={item.icon as any}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  header: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 40,
    color: '#3355ce',
    fontFamily: 'BebasNeue-Regular',
    top: 32,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    top: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e0e0e0',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    color: '#374151',
    fontFamily: 'Afacad-Regular',
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Afacad-Regular',
    marginBottom: 5,
    textAlign: 'center',
  },
  userStatus: {
    fontSize: 14,
    color: '#10B981',
    fontFamily: 'Afacad-Regular',
    fontWeight: '600',
    textAlign: 'center',
  },
  settingsGroup: {
    marginBottom: 20,
    top: 32,
  },
  groupTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: 'Afacad-Regular',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  groupContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  itemPressed: {
    backgroundColor: '#e8e8e8',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Afacad-Regular',
  },
  itemValue: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Afacad-Regular',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Afacad-Regular',
  },
});
