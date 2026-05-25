import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { jobsAPI } from './api';

export const DriverBrowseJobsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lat, setLat] = useState('40.7128');
  const [lng, setLng] = useState('-74.0060');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await jobsAPI.browseJobs(lat, lng, 50);
      setJobs(res.data.jobs || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('DriverJobDetail', { job: item })}
    >
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.distance}>{item.distance?.toFixed(1) || 0} km</Text>
      </View>
      <Text style={styles.jobDesc}>{item.description}</Text>
      <View style={styles.jobFooter}>
        <Text style={styles.payment}>${item.payment_amount}</Text>
        <Text style={styles.farmer}>by {item.farmer?.email}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Your Lat"
          value={lat}
          onChangeText={setLat}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Your Lng"
          value={lng}
          onChangeText={setLng}
          keyboardType="decimal-pad"
        />
        <TouchableOpacity style={styles.searchButton} onPress={loadJobs}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No jobs found nearby</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchBox: { backgroundColor: 'white', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  input: { backgroundColor: '#f5f5f5', borderRadius: 6, padding: 10, marginBottom: 8, fontSize: 12 },
  searchButton: { backgroundColor: '#2196F3', borderRadius: 6, padding: 10, alignItems: 'center' },
  searchButtonText: { color: 'white', fontWeight: 'bold' },
  jobCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  jobTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  distance: { fontSize: 12, color: '#2196F3', fontWeight: '600' },
  jobDesc: { fontSize: 14, color: '#666', marginBottom: 10 },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  payment: { fontSize: 16, fontWeight: 'bold', color: '#2196F3' },
  farmer: { fontSize: 12, color: '#999' },
  emptyText: { fontSize: 16, color: '#999' },
});
