import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ReservarPCs() {
  const router = useRouter();

  const listaPCs = [
    { title: 'Pc - A1', icon: 'desktop-outline' },
    { title: 'Pc - A2', icon: 'desktop-outline' },
    { title: 'Pc - A3', icon: 'desktop-outline' },
    { title: 'Pc - A4', icon: 'desktop-outline' },
    { title: 'Pc - A5', icon: 'desktop-outline' },
  ];

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>RESERVA DE PC'S</Text>
        </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquise alguma coisa..."
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.menuList}>
        {listaPCs.map((item, index) => (
          <Pressable key={index} style={styles.menuItem}
            onPress={() => {
              if (item.title === 'Pc - A1') {
                router.push('./reservar-pcs/pc-a1');
              } else if (item.title === 'Pc - A2'){
                router.push('./reservar-pcs/pc-a2');
              } else if (item.title === 'Pc - A3'){
                router.push('./reservar-pcs/pc-a3');
              } else if (item.title === 'Pc - A4'){
                router.push('./reservar-pcs/pc-a4');
              } else if (item.title === 'Pc - A5'){
                router.push('./reservar-pcs/pc-a5');
              }          
              else {
                console.log('Item pressionado:', item.title);
              }
            }} 
            >
            
            <Ionicons name={item.icon as any} size={60} color="#888" />
            <Text style={styles.menuText}>{item.title}</Text>

          </Pressable>
        ))}
        </View>
    
        <Text style={styles.bottomText}>Clique nos monitores para acessar os horários.</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fFF',
  },
  container: {
    padding: 20,
    backgroundColor: '#fFF',
    paddingTop: 50,
    paddingBottom: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom:10,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 40,
    color: '#3355ce',
    fontFamily: 'BebasNeue-Regular',
  },
  titleIcon: {
    marginBottom:5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginBottom: 30,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Afacad-Regular',
  },
  menuList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    },
  menuItem: {
    width: '30%', 
    alignItems: 'center',
    marginBottom: 20,
    },
  iconContainer: {
    backgroundColor: '#FFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Afacad-Regular',
  },
  bottomText:{
    alignSelf:'center',
    margin: 10,
    textAlign: 'center'
  }
});
