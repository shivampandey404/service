import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const bookings = [
  { id: '1', service: 'Electrical Repair', date: '2023-05-15', time: '14:00', status: 'Upcoming' },
  { id: '2', service: 'Wiring Installation', date: '2023-05-10', time: '10:00', status: 'Completed' },
  { id: '3', service: 'Appliance Installation', date: '2023-05-20', time: '11:30', status: 'Upcoming' },
];

export default function BookingsScreen() {
  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <View style={styles.bookingInfo}>
        <Text style={styles.serviceName}>{item.service}</Text>
        <Text style={styles.bookingDate}>{item.date} at {item.time}</Text>
        <Text style={[styles.bookingStatus, item.status === 'Completed' ? styles.completedStatus : styles.upcomingStatus]}>
          {item.status}
        </Text>
      </View>
      <TouchableOpacity style={styles.detailsButton}>
        <Ionicons name="chevron-forward" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
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
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  bookingInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookingStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  completedStatus: {
    color: '#4CAF50',
  },
  upcomingStatus: {
    color: '#FFA000',
  },
  detailsButton: {
    padding: 8,
  },
});

