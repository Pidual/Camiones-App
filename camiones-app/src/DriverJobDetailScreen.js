import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { jobsAPI } from './api';

export const DriverJobDetailScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleRequestJob = async () => {
    setLoading(true);
    try {
      await jobsAPI.requestJob(job.id);
      setRequested(true);
      Alert.alert('Success', 'Job requested! Waiting for farmer to respond.');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteJob = async () => {
    setLoading(true);
    try {
      await jobsAPI.completeJob(job.id);
      Alert.alert('Success', 'Job marked as complete!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={[styles.status, statusStyles[job.status]]}>
          {job.status.toUpperCase()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Info</Text>
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
        <Text style={styles.sectionTitle}>Farmer Info</Text>
        <View style={styles.detail}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{job.farmer?.name || job.farmer?.email}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{job.farmer?.phone}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.label}>Rating:</Text>
          <Text style={styles.value}>⭐ {job.farmer?.rating?.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {job.status === 'open' && !requested && (
          <TouchableOpacity
            style={styles.requestButton}
            onPress={handleRequestJob}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.requestButtonText}>Request This Job</Text>
            )}
          </TouchableOpacity>
        )}

        {requested && job.status === 'open' && (
          <View style={styles.requestedBadge}>
            <Text style={styles.requestedText}>✓ Request Sent</Text>
          </View>
        )}

        {job.status === 'accepted' && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleCompleteJob}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.completeButtonText}>Mark Complete</Text>
            )}
          </TouchableOpacity>
        )}

        {job.status === 'completed' && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓ Job Completed</Text>
          </View>
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
  header: { backgroundColor: '#2196F3', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', flex: 1 },
  status: { fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4 },
  section: { backgroundColor: 'white', margin: 10, padding: 15, borderRadius: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  detail: { marginBottom: 10 },
  label: { fontSize: 12, color: '#999' },
  value: { fontSize: 14, color: '#333', marginTop: 3 },
  actions: { padding: 15, marginBottom: 20 },
  requestButton: { backgroundColor: '#2196F3', borderRadius: 8, padding: 15, alignItems: 'center' },
  requestButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  requestedBadge: { backgroundColor: '#E3F2FD', borderRadius: 8, padding: 15, alignItems: 'center', borderWidth: 2, borderColor: '#2196F3' },
  requestedText: { color: '#2196F3', fontSize: 16, fontWeight: 'bold' },
  completeButton: { backgroundColor: '#4CAF50', borderRadius: 8, padding: 15, alignItems: 'center' },
  completeButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  completedBadge: { backgroundColor: '#F5F5F5', borderRadius: 8, padding: 15, alignItems: 'center', borderWidth: 2, borderColor: '#999' },
  completedText: { color: '#666', fontSize: 16, fontWeight: 'bold' },
});
