import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { jobsAPI } from './api';

export const DriverJobsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await jobsAPI.getMyJobs('driver');
      setJobs(res.data || []);
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
        <Text style={[styles.status, statusStyles[item.status]]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.jobDesc}>{item.description}</Text>
      <View style={styles.jobFooter}>
        <Text style={styles.payment}>${item.payment_amount}</Text>
        <Text style={styles.farmer}>Farmer</Text>
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
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No active jobs</Text>
          </View>
        }
      />
    </View>
  );
};

const statusStyles = {
  open: { color: '#4CAF50', backgroundColor: '#E8F5E9' },
  accepted: { color: '#2196F3', backgroundColor: '#E3F2FD' },
  completed: { color: '#666', backgroundColor: '#F5F5F5' },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  jobCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  status: { fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  jobDesc: { fontSize: 14, color: '#666', marginBottom: 10 },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  payment: { fontSize: 16, fontWeight: 'bold', color: '#2196F3' },
  farmer: { fontSize: 12, color: '#999' },
  emptyText: { fontSize: 16, color: '#999' },
});
