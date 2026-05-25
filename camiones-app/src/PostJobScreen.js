import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { jobsAPI } from './api';

export const PostJobScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Farm A');
  const [dropoffLocation, setDropoffLocation] = useState('Warehouse B');
  const [pickupLat, setPickupLat] = useState('40.7128');
  const [pickupLng, setPickupLng] = useState('-74.0060');
  const [dropoffLat, setDropoffLat] = useState('40.7490');
  const [dropoffLng, setDropoffLng] = useState('-73.9680');
  const [paymentAmount, setPaymentAmount] = useState('75');
  const [loading, setLoading] = useState(false);

  const handlePostJob = async () => {
    if (!title || !paymentAmount) {
      Alert.alert('Error', 'Please fill in title and payment amount');
      return;
    }

    setLoading(true);
    try {
      await jobsAPI.postJob({
        title,
        description,
        pickupLocation,
        dropoffLocation,
        pickupLat: parseFloat(pickupLat),
        pickupLng: parseFloat(pickupLng),
        dropoffLat: parseFloat(dropoffLat),
        dropoffLng: parseFloat(dropoffLng),
        paymentAmount: parseFloat(paymentAmount),
      });

      Alert.alert('Success', 'Job posted!', [
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
      <View style={styles.form}>
        <Text style={styles.label}>Job Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Transport hay bales"
          value={title}
          onChangeText={setTitle}
          editable={!loading}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Job details"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          editable={!loading}
        />

        <Text style={styles.label}>Pickup Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Pickup address"
          value={pickupLocation}
          onChangeText={setPickupLocation}
          editable={!loading}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Lat"
            value={pickupLat}
            onChangeText={setPickupLat}
            keyboardType="decimal-pad"
            editable={!loading}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Lng"
            value={pickupLng}
            onChangeText={setPickupLng}
            keyboardType="decimal-pad"
            editable={!loading}
          />
        </View>

        <Text style={styles.label}>Dropoff Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Dropoff address"
          value={dropoffLocation}
          onChangeText={setDropoffLocation}
          editable={!loading}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Lat"
            value={dropoffLat}
            onChangeText={setDropoffLat}
            keyboardType="decimal-pad"
            editable={!loading}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Lng"
            value={dropoffLng}
            onChangeText={setDropoffLng}
            keyboardType="decimal-pad"
            editable={!loading}
          />
        </View>

        <Text style={styles.label}>Payment Amount ($) *</Text>
        <TextInput
          style={styles.input}
          placeholder="50"
          value={paymentAmount}
          onChangeText={setPaymentAmount}
          keyboardType="decimal-pad"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePostJob}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Post Job</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
