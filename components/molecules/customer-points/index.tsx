/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eol-last */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */

import React, {  useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  Alert,
} from "react-native";
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import HomeHeader from "../../atoms/home-header";
import { FormTextInput } from "../../../styles/input";
import { StyledText16, styledText } from "../../../styles/text";

const CustomerBuyPoints = ({
  navigation,
  userID,
}: any) => {

  const [currentName, setCurrentName] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [ammount, setAmmount] = useState("");
  const [fileBlob, setFileBlob] = useState("");

  const [loading, setLoading] = useState(false);

  const uploadPicture = async (imageUri: string) => {
    try {
      const rand = generateScrambledCode();
      const fileName =
        rand + userID + '-' + imageUri.substring(imageUri.lastIndexOf('/') + 1);

      const storageRef = storage().ref(`reciept/${fileName}`);
      const task = storageRef.putFile(imageUri);
      const downloadURL = await task.then(() => storageRef.getDownloadURL());
      return downloadURL;

    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  const onSelectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    } as any;

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      }

      if (response.assets) {
        const { uri } = response.assets[0];
        setFileBlob(uri as string);
      }
    });
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const result = await uploadPicture(fileBlob);
      await firestore().collection("Points").add({
        UID: userID,
        name: currentName,
        ammount: Number(ammount),
        referenceNumber,
        recieptID: result,
        status: "pending",
      });
      Alert.alert("Purchase Points successfully");
      setCurrentName("");
      setReferenceNumber("");
      setAmmount("");
      setLoading(false);
      setFileBlob("");
    } catch (error) {
      console.error("Error purchasing points:", error);
      Alert.alert("Error", "Failed to purchase points.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <HomeHeader
          navigation={navigation}
          title={'Buy Points'}
          fromProfile={false}
        />
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, gap: 12, justifyContent: "center", alignItems: "center", marginTop: 100 }}>

          {fileBlob && <View style={{ height: 250, borderWidth: 1, width: '100%', borderRadius: 15, overflow: "hidden" }}>
            <Image source={{ uri: fileBlob }} style={{
              resizeMode: "stretch", width: "100%", height: "100%",
            }} />
          </View>}

          <FormField label="Name" value={currentName} onChange={setCurrentName} />
          <FormField label="Reference" value={referenceNumber} onChange={setReferenceNumber} />
          <FormField label="Amount" value={ammount} onChange={setAmmount} keyboardType="numeric" />
          {!loading && <TouchableHighlight  onPress={onSelectImage} style={{ backgroundColor: "#0652DD", width: "100%", padding: 16, borderRadius: 100, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{"Select Proof"}</Text>
          </TouchableHighlight>}
          <TouchableHighlight disabled={loading} onPress={onSubmit} style={{ backgroundColor: "#042F40", width: "100%", padding: 16, opacity: loading ? 0.65 : 1, justifyContent: "center", alignItems: "center" }}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Buy Points</Text>
            )}
          </TouchableHighlight>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const FormField = ({ label, value, onChange }: { label: string, value: any, onChange: any, keyboardType?: any }) => {
  const sans = styledText();
  return (
    <View style={{ marginBottom: 12, width: "100%" }}>
      <StyledText16
        style={[
          sans.bold,
          { alignSelf: 'flex-start', textAlign: 'left', color: '#042F40' },
        ]}>
        {label}
      </StyledText16>
      <FormTextInput value={value} onChangeText={onChange} keyboardType={"default"} />
    </View>
  );
};

export default CustomerBuyPoints;

function generateScrambledCode() {
  const letters = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)));
  const numbers = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10));
  const code = [...letters, ...numbers];
  for (let i = code.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [code[i], code[j]] = [code[j], code[i]];
  }
  return code.join('');
}