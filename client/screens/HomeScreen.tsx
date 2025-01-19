import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { id: '1', name: 'Repairs', icon: 'build' },
  { id: '2', name: 'Installations', icon: 'flash' },
  { id: '3', name: 'Maintenance', icon: 'construct' },
];

const featuredServices = [
  { id: '1', name: 'Emergency Repair', image: '/placeholder.svg?height=100&width=100' },
  { id: '2', name: 'Home Wiring', image: '/placeholder.svg?height=100&width=100' },
  { id: '3', name: 'Smart Home Setup', image: '/placeholder.svg?height=100&width=100' },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to RK Service</Text>
      <Text style={styles.subtitle}>Expert Electrician Services at Your Fingertips</Text>

      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => navigation.navigate('ServiceList', { category: category.name })}
          >
            <Ionicons name={category.icon} size={32} color="#007AFF" />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Featured Services</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredContainer}>
        {featuredServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.featuredItem}
            onPress={() => navigation.navigate('ServiceDetails', { service: service })}
          >
            <Image source={{ uri: service.image }} style={styles.featuredImage} />
            <Text style={styles.featuredText}>{service.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.allServicesButton}
        onPress={() => navigation.navigate('ServiceList')}
      >
        <Text style={styles.allServicesButtonText}>View All Services</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F0F0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    width: '30%',
  },
  categoryText: {
    marginTop: 8,
    textAlign: 'center',
  },
  featuredContainer: {
    marginBottom: 24,
  },
  featuredItem: {
    marginRight: 16,
    width: 150,
  },
  featuredImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  featuredText: {
    textAlign: 'center',
  },
  allServicesButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  allServicesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

