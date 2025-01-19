import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const services = [
  { id: '1', name: 'Electrical Repair', icon: 'flash', image: '/placeholder.svg?height=80&width=80' },
  { id: '2', name: 'Wiring Installation', icon: 'git-network', image: '/placeholder.svg?height=80&width=80' },
  { id: '3', name: 'Appliance Installation', icon: 'hardware-chip', image: '/placeholder.svg?height=80&width=80' },
  { id: '4', name: 'Light Fixture Installation', icon: 'bulb', image: '/placeholder.svg?height=80&width=80' },
  { id: '5', name: 'Electrical Inspection', icon: 'search', image: '/placeholder.svg?height=80&width=80' },
  { id: '6', name: 'Circuit Breaker Repair', icon: 'power', image: '/placeholder.svg?height=80&width=80' },
  { id: '7', name: 'Smart Home Setup', icon: 'home', image: '/placeholder.svg?height=80&width=80' },
  { id: '8', name: 'Emergency Services', icon: 'alert-circle', image: '/placeholder.svg?height=80&width=80' },
];

export default function ServiceListScreen({ navigation, route }) {
  const category = route.params?.category;
  const filteredServices = category ? services.filter(service => service.category === category) : services;

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigation.navigate('ServiceDetails', { service: item })}
    >
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription}>Professional {item.name.toLowerCase()} services</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  listContainer: {
    padding: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
  },
});

