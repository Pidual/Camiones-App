import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { jobsAPI } from './api';

export const FarmerJobDetailScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const [loading, setLoading] = useState(false);
  const requests = job.requests || [];

  const handleAcceptDriver = async (driverId) => {
    setLoading(true);
    try {
      await jobsAPI.acceptRequest(job.id, driverId);
      Alert.alert('Success', 'Driver accepted!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <View>
        <Text style={styles.driverName}>{item.driver?.name || item.driver?.email}</Text>
        <Text style={styles.driverPhone}>{item.driver?.phone}</Text>
        <Text style={styles.rating}>⭐ {item.driver?.rating?.toFixed(1) || 'N/A'}</Text>
      </View>
      {job.status === 'open' && (
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptDriver(item.driver_id)}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.acceptButtonText}>Accept</Text>}
        </TouchableOpacity>
      )}
      {job.status === 'accepted' && item.status === 'accepted' && (
        <Text style={styles.acceptedBadge}>✓ Accepted</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={[styles.status, statusStyles[job.status]]}>
          {job.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detail}>
          <Text style={styles.label}>Payment:</Text>
          <Text style={styles.value}>${job.payment_amount}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value}>{job.pickup_location}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value}>{job.dropoff_location}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requests ({requests.length})</Text>
        {requests.length === 0 ? (
          <Text style={styles.noRequests}>No requests yet</Text>
        ) : (
          <FlatList
            data={requests}
            renderItem={renderRequest}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
};

const statusStyles = {
  open: { color: '#4CAF50', backgroundColor: '#E8F5E9' },
  accepted: { color: '#2196F3', backgroundColor: '#E3F2FD' },
  completed: { color: '#666', backgroundColor: '#F5F5F5' },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#4CAF50', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', flex: 1 },
  status: { fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4 },
  section: { backgroundColor: 'white', margin: 10, padding: 15, borderRadius: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  detail: { marginBottom: 10 },
  label: { fontSize: 12, color: '#999' },
  value: { fontSize: 14, color: '#333', marginTop: 3 },
  noRequests: { fontSize: 14, color: '#999', textAlign: 'center', paddingVertical: 20 },
  requestCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  driverPhone: { fontSize: 12, color: '#666', marginTop: 3 },
  rating: { fontSize: 12, color: '#FF9800', marginTop: 3 },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  acceptButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  acceptedBadge: { fontSize: 12, color: '#2196F3', fontWeight: 'bold' },
});
