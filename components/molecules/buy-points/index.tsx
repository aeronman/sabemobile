import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

function BuyPoints({ navigation }) {
  const [senderName, setSenderName] = useState('');
  const [amountSent, setAmountSent] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setAttachedImage(result.uri);
    }
  };

  const handleSendPoints = () => {
    // Logic to send points
    // You can use senderName, amountSent, and attachedImage here
    console.log('Sender Name:', senderName);
    console.log('Amount Sent:', amountSent);
    console.log('Attached Image:', attachedImage);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Sender Name:</Text>
      <TextInput
        style={styles.input}
        value={senderName}
        onChangeText={setSenderName}
        placeholder="Enter sender's name"
      />
      <Text style={styles.label}>Amount Sent:</Text>
      <TextInput
        style={styles.input}
        value={amountSent}
        onChangeText={setAmountSent}
        placeholder="Enter amount sent"
        keyboardType="numeric"
      />
      <Button
        title="Attach Image"
        onPress={pickImage}
      />
      {attachedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: attachedImage }} style={styles.image} />
        </View>
      )}
      <Button
        title="Send Points"
        onPress={handleSendPoints}
        disabled={!senderName || !amountSent}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width - 40,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default BuyPoints;