//HomeScreen After Login
import { ActivityIndicator, TextInput, Button, Image, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Platform, StatusBar, ScrollView, Alert } from "react-native";
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { colors } from "../utils/colors";
import { AuthContext } from '../store/auth-context';
import { resetPassword, sendPasswordResetEmail, getUserInfo } from '../utils/auth';


const HomeScreen = () => {

  const [fetchedMessage, setFetchedMesssage] = useState('');

  // useEffect(() => {
  //   axios
  //     .get(
  //       'https://GFIgRO1xoGm3L2bSKauM.firebaseio.com/userMessage.json?auth=' + token
  //     )
  //     .then((response) => {
  //       setFetchedMesssage(response.data);
  //     });
  // }, [token]);


  //---------------------------------------
  const [isSending, setIsSending] = useState(false);
  const [userDataEmail, setUserDataEmail] = useState('');
  const authCtx = useContext(AuthContext);

  const handlePasswordReset = async () => {
    setIsSending(true);
    try {
      const userData = await getUserInfo(authCtx.token);
      const email = userData.users[0].email;
      setUserDataEmail(email);
      await resetPassword(email);
     } catch (error) {
      // console.log(error);
    }
    setIsSending(false);
  };


  //-------------------------------------




  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Home Screen</Text>
      {userDataEmail ? (
        <>
          <Text>  A password reset link has been sent to  {userDataEmail}</Text>
          <Text>{fetchedMessage}</Text>
        </>
      ) : null}

      <View>

        {isSending ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Button title="Reset Password" onPress={handlePasswordReset} />
        )}
      </View>
    </View>

  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    paddingVertical: 30,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 40,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "center",
    color: colors.primary,
    marginTop: 40,
  },
});