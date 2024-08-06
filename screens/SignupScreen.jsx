import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView ,
  ActivityIndicator, 
  StatusBar, View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image, Platform
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { createUser } from "../utils/auth";
import { AuthContext } from "../store/auth-context";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");


  // Individual password validation states
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);
  const [passwordUppercaseValid, setPasswordUppercaseValid] = useState(false);
  const [passwordLowercaseValid, setPasswordLowercaseValid] = useState(false);
  const [passwordNumberValid, setPasswordNumberValid] = useState(false);
  const [passwordSpecialCharValid, setPasswordSpecialCharValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Clear the form values when the screen is focused
      setEmail("");
      setPassword("");
      setPhone("");
      setEmailError("");
      setConfirmPassword("");
      setPasswordLengthValid(false);
      setPasswordUppercaseValid(false);
      setPasswordLowercaseValid(false);
      setPasswordNumberValid(false);
      setPasswordSpecialCharValid(false);
      setIsFormValid(false);

    }, [])
  );

  useEffect(() => {
    // Check if the form is valid whenever email or password criteria change
    const isPasswordValid =
      passwordLengthValid &&
      passwordUppercaseValid &&
      passwordLowercaseValid &&
      passwordNumberValid &&
      passwordSpecialCharValid;
    setIsFormValid(
      email !== "" &&
      isPasswordValid &&
      emailError === ""
    );
  }, [
    email,
    password,
    confirmPassword,
    emailError,
    passwordLengthValid,
    passwordUppercaseValid,
    passwordLowercaseValid,
    passwordNumberValid,
    passwordSpecialCharValid,
  ]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    navigation.navigate("LOGIN");
  };

  const validateEmail = (inputEmail) => {
    // Regex for email validation
    const emailRegex = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
    if (!emailRegex.test(inputEmail)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (inputPassword) => {
    // Check if the password meets the criteria
    setPasswordLengthValid(inputPassword.length >= 8);
    setPasswordUppercaseValid(/(?=.*[A-Z])/.test(inputPassword));
    setPasswordLowercaseValid(/(?=.*[a-z])/.test(inputPassword));
    setPasswordNumberValid(/(?=.*\d)/.test(inputPassword));
    setPasswordSpecialCharValid(/(?=.*[@$!%*?&])/.test(inputPassword));
  };

  const validateConfirmPassword = (inputConfirmPassword) => {
    setPasswordsMatch(inputConfirmPassword === password);
  };
const [isAuthenticating, setIsAuthenticating]= useState(false);
const authCtx = useContext(AuthContext);

async function signupHandler() {
  if (isFormValid) {
    setIsAuthenticating(true);
    try {
    const token=  await createUser(email, password); // Use the correct function signature
      authCtx.authenticate(token.idToken);
    } catch (error) {
      // console.error("Error during user creation:", error);
      // Display error to the user if needed
    } finally {
      setIsAuthenticating(false);
    }
  }
}



  if(isAuthenticating){
    return <ActivityIndicator size="large" color="red" />
  }


  return (
    <ScrollView  style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Let's get</Text>
        <Text style={styles.headingText}>started</Text>
      </View>
      {/* form */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={colors.secondary}
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={colors.secondary}
            secureTextEntry={secureEntry}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setSecureEntry((prev) => !prev);
            }}
          >
            <SimpleLineIcons name={"eye"} size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>


        {/* Password validation feedback */}
        {password !== "" && (
          <View style={styles.passwordCriteriaContainer}>
            <Text style={[styles.passwordCriteriaText, passwordLengthValid ? styles.valid : styles.invalid]}>
              At least 8 characters
            </Text>
            <Text style={[styles.passwordCriteriaText, passwordUppercaseValid ? styles.valid : styles.invalid]}>
              At least one uppercase letter
            </Text>
            <Text style={[styles.passwordCriteriaText, passwordLowercaseValid ? styles.valid : styles.invalid]}>
              At least one lowercase letter
            </Text>
            <Text style={[styles.passwordCriteriaText, passwordNumberValid ? styles.valid : styles.invalid]}>
              At least one number
            </Text>
            <Text style={[styles.passwordCriteriaText, passwordSpecialCharValid ? styles.valid : styles.invalid]}>
              At least one special character (@, $, !, %, *, ?, &)
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <SimpleLineIcons name={"lock"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm your password"
            placeholderTextColor={colors.secondary}
            secureTextEntry={secureEntry}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              validateConfirmPassword(text);
            }}
          />
        </View>
        {confirmPassword !== "" && !passwordsMatch && (
          <Text style={styles.errorText}>Passwords do not match.</Text>
        )}

        <View style={styles.inputContainer}>
          <SimpleLineIcons
            name={"screen-smartphone"}
            size={30}
            color={colors.secondary}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your phone no"
            placeholderTextColor={colors.secondary}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.loginButtonWrapper,
            !isFormValid && { backgroundColor: colors.disabled },
          ]}
          onPress={signupHandler}
          disabled={!isFormValid}
        >
          <Text style={styles.loginText}>Sign up</Text>
        </TouchableOpacity>
        <Text style={styles.continueText}>or continue with</Text>
        <TouchableOpacity style={styles.googleButtonContainer}>
          <Image
            source={require("../assets/images/google.png")}
            style={styles.googleImage}
          />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Already have an account!</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.signupText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView >
  );
};


export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight : 0,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: colors.primary,
    //   fontFamily: fonts.SemiBold,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    padding: 20,
    paddingLeft: 10,
    paddingRight: 10,
    //   fontFamily: fonts.Light,
  },
  forgotPasswordText: {
    textAlign: "right",
    color: colors.primary,
    //   fontFamily: fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    //   fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    //   fontFamily: fonts.Regular,
    color: colors.primary,
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
    //   fontFamily: fonts.SemiBold,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: colors.primary,
    //   fontFamily: fonts.Regular,
  },
  signupText: {
    color: colors.primary,
    //   fontFamily: fonts.Bold,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  passwordCriteriaContainer: {
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  passwordCriteriaText: {
    fontSize: 12,
  },
  valid: {
    color: 'green',
  },
  invalid: {
    color: 'red',
  },

});


