import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ServiceDetailsScreen({ route, navigation }) {
  const { service } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: service.image }} style={styles.serviceImage} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{service.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>4.8 (120 reviews)</Text>
        </View>
        <Text style={styles.description}>
          Our professional {service.name.toLowerCase()} service ensures that your electrical systems are functioning
          safely and efficiently. Our experienced technicians use state-of-the-art equipment to diagnose and resolve
          any electrical issues you may be experiencing.
        </Text>
        <Text style={styles.sectionTitle}>What's Included:</Text>
        <View style={styles.includesList}>
          <Text style={styles.includeItem}>• Thorough inspection of electrical systems</Text>
          <Text style={styles.includeItem}>• Diagnosis of electrical issues</Text>
          <Text style={styles.includeItem}>• Professional repair or installation</Text>
          <Text style={styles.includeItem}>• Safety checks and recommendations</Text>
        </View>
        <Text style={styles.sectionTitle}>Pricing:</Text>
        <Text style={styles.pricingText}>Starting from $79 per hour</Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('Booking', { service: service })}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  serviceImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  includesList: {
    marginBottom: 16,
  },
  includeItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  pricingText: {
    fontSize: 16,
    marginBottom: 24,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

